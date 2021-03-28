const express = require("express");
const axios = require("axios");
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../schemas/user')

const {
  getUser,
  updateLocation,
  updateSymptoms,
  findClosePeople,
} = require("../services/userService");

const { sendSmS } = require("../services/smsService");

const {
  writeSensors,
  getAllSensors,
  getSensorsById,
} = require("../services/sensorService");


/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", async (req, res, next) => {


  let doc;
  return User.findOne({ "email": req.body.email }, async (err, user) => {

    if (user) {
      res.status(409).send({
        message: 'This email already exists'
      })
    } else {
      doc = new User({
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender
      })
      await doc.save();

      return res.status(200).json(doc).send()
    }
  })
});

router.post("/login", async (req, res, next) => {
  return User.findOne({ "email": req.body.email }, async (err, user) => {

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    } else {
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      } else {
        return res.status(200).send({
          id: user._id,
          email: user.email,
          name: user.name,
          gender: user.gender,
          age: user.age
        })
      }
    }
  })
})

router.post("/predict", async (req, res, next) => {
  try {
    const metadata = await getUser(req.body.id);
    const totaldata = Object.assign({}, metadata._doc, req.body);

    const result = await axios.post("http://localhost:5000", totaldata);

    if (+result.data > 0) {
      const people = await findClosePeople({
        lon: metadata.location[0],
        lat: metadata.location[1],
      });
      console.log("The following people would be notified");
      console.log(people);
    }

    await sendSmS(`00${metadata.phone}`, +result.data);
    res.send(String(result.data));
  } catch (error) {
    console.error(error.stack);
    res.send(500);
  }
});

router.get("/metadata", async (req, res, next) => {
  try {
    const doc = await getUser(req.query.id);
    if (!doc || Object.entries(doc).length === 0) {
      res.sendStatus(404);
    } else {
      res.send(doc);
    }
  } catch (error) {
    res.send(error);
  }
});

/* {
  Nurba's version
  i: id,
  s: sensor_value
}
*/
router.get("/spirometer", async (req, res, next) => {
  try {

    const { i: id, s } = req.query;
    const sensor_value = s / 100;
    console.log({ id, sensor_value });

    const user = await getUser(id);
    const gender = user.gender;
    console.log(user)
    let doc = user;
    //if fev1
    if (gender == "male" && sensor_value < 3.5) {
      doc = await updateSymptoms(id, {
        pneumonia: 1,
        difficult_breathing: 1,
      });
    } else if (gender == "female" && sensor_value < 2.5) {
      console.log("detected");
      doc = await updateSymptoms(id, {
        pneumonia: 1,
        difficult_breathing: 1,
      });
    }

    //CHEST PAIN ML
    //HEADACKE TRESHOLD HIGH BLOOD PRESSURE
    res.status(200).json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//NEED TO BE TESTED
router.get("/pulseoximeter", async (req, res, next) => {
  try {
    console.log(req.query);
    //SEND TO ML SERVICE
    const result = await axios.post("http://localhost:5000", req.query.s);
    if (result == 1) {
      let doc = await updateSymptoms(req.query.i, { fatigue: 1 });
      res.json(doc);
    } else {
      console.log("Fatigue not predicted");
    }
    res.status(200);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//NEED TO BE TESTED
router.get("/thermometer", async (req, res, next) => {
  try {
    console.log(req.query);
    const { i: id, s } = req.query;
    const sensor_value = s / 100;
    //SEND TO ML SERVICE
    const result = await axios.post(
      "http://localhost:5000",
      sensor_value
    );
    if (result == 1) {
      let doc = await updateSymptoms(id, { fever: 1 });
      res.status(200).send(doc);
    } else {
      console.log("Fever not predicted");
    }
  } catch (error) {
    res.status(500).send(error);
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
router.get("/symptoms", async (req, res, next) => {
  try {
    console.log(req.query.symptoms);
    const doc = await updateSymptoms(id, req.query.symptoms);
    res.status(200).send(doc);

  }catch{
    res.status(500).send()
  }
});



router.get("/graph", async (req, res, next) => {
  try {
    const sensors = await getSensorsById(req.query.id);

    const last = JSON.parse("[" + sensors[0].graph + "]");

    const graphData = [];
    last.forEach((value, i) => {
      graphData.push([i, value]);
    });
    res.send(graphData);
  } catch (error) {
    console.log(error.stack);
    res.send(error);
  }
});

router.post("/geo", async (req, res, next) => {
  res.send(await updateLocation(req.body));
});

router.post("/find", async (req, res, next) => {
  console.log(req.body);
  res.send(await findClosePeople(req.body));
});

router.get("/test-sms", async (req, res, next) => {
  await sendSmS(req.query.phone);
  return 200;
});

router.post("/test1", async (req, res, next) => {
  console.log(req.body);
  return 200;
});

router.post("/test2", async (req, res, next) => {
  console.log(req.body);
  return 200;
});

module.exports = router;
