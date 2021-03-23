const express = require("express");
const axios = require("axios");
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../schemas/user')

const { getUser, updateSymptoms } = require('../services/userService')
const { writeSensors, getAllSensors } = require('../services/sensorService')

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
  Nurba's version
  i: id,
  s: sensor_value
}
*/
router.get("/spirometer", async (req, res, next) => {
  try {

    const { i: id, s } = req.body;
    const sensor_value = s / 100;
    console.log({ id, sensor_value });

    const user = await getUser(id);
    const gender = user.gender;

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
    res.json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//NEED TO BE TESTED
router.get("/pulseoximeter", async (req, res, next) => {
  try {
    console.log(req.body);
    //SEND TO ML SERVICE
    const result = await axios.post("http://localhost:5000", req.body.s);
    if (result == 1) {
      let doc = await updateSymptoms(req.body.i, { fatigue: 1 });
      res.json(doc);
    } else {
      console.log("Fatigue not predicted");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//NEED TO BE TESTED
router.get("/thermometer", async (req, res, next) => {
  try {
    console.log(req.body);
    const { i: id, s } = req.body;
    const sensor_value = s / 100;
    //SEND TO ML SERVICE
    const result = await axios.post(
      "http://localhost:5000",
      sensor_value
    );
    if (result == 1) {
      let doc = await updateSymptoms(id, { fever: 1 });
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
