const express = require("express");
const axios = require("axios");
const router = express.Router();

const {
  register,
  getUser,
  updateSymptoms,
} = require("../services/userService");
const { writeSensors, getAllSensors } = require("../services/sensorService");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", async (req, res, next) => {
  try {
    const doc = await register(req.body);
    console.log("doc");
    console.log(doc);
    res.status(201).json(doc);
  } catch (error) {
    console.log("error");
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
});

router.post("/predict", async (req, res, next) => {
  try {
    const metadata = await getUser(req.body.id);
    const totaldata = Object.assign({}, metadata._doc, req.body);
    const result = await axios.post("http://localhost:5000", totaldata);
    res.send(String(result.data));
  } catch (error) {
    console.error(error.stack);
    res.send(500);
  }
});

router.get("/metadata", async (req, res, next) => {
  try {
    const doc = await getUser(req.query.id);
    res.send(doc);
  } catch (error) {
    res.send(error);
  }
});

/* {
  _id: 0,
  sensor_value: 0
}
*/
router.post("/spirometer", async (req, res, next) => {
  try {
    console.log(req.body);

    const data = await getUser(req.query._id);
    const gender = data.sex;

    let doc;
    if (req.body.sensor_type == "spirometer") {
      //if fev1
      if (gender == "male" && req.body.sensor_value < 3.5) {
        doc = await updateSymptoms(req.body._id, {
          pneumonia: 1,
          difficult_breathing: 1,
        });
      } else if (gender == "female" && req.body.sensor_value < 2.5) {
        doc = await updateSymptoms(req.body._id, {
          pneumonia: 1,
          difficult_breathing: 1,
        });
      }
    }

    //CHEST PAIN ML
    //HEADACKE TRESHOLD HIGH BLOOD PRESSURE
    res.send(doc);
  } catch (error) {
    res.send(error);
  }
});

//NEED TO BE TESTED
router.get("/spo", async (req, res, next) => {
  try {
    console.log(req.query);
    //SEND TO ML SERVICE
    const result = await axios.post("http://localhost:5000", req.query.s);
    if (result == 1) {
      let doc = await updateSymptoms(req.query.i, { fatigue: 1 });
      res.send(doc);
    } else {
      console.log("Fatigue not predicted");
    }
  } catch (error) {
    res.send(error);
  }
});

//NEED TO BE TESTED
router.post("/thermometer", async (req, res, next) => {
  try {
    console.log(req.body);
    //SEND TO ML SERVICE
    const result = await axios.post(
      "http://localhost:5000",
      req.body.sensor_value
    );
    if (result == 1) {
      let doc = await updateSymptoms(req.body.id, { fever: 1 });
      res.send(doc);
    } else {
      console.log("Fever not predicted");
    }
  } catch (error) {
    res.send(error);
  }
});

//NEED TO BE TESTED
// HERE SHOULD BE CHEST PAIN

//ENDPOINT FOR QUESTIONNAIRE
/*
{
  id: int,
  symptoms: {
    
  }
}
*/

router.post("/");

module.exports = router;
