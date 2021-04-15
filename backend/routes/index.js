const express = require("express");
const axios = require("axios");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User, Symptoms, Sensors } = require("../schemas/user");
const ObjectId = require("mongodb").ObjectId;
const {
  getUser,
  getSensors,
  getSymptoms,
  updateLocation,
  updateSymptoms,
  updateSensors,
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
  return User.findOne({ email: req.body.email }, async (err, user) => {
    if (user) {
      res.status(409).send({
        message: "This email already exists",
      });
    } else {
      doc = new User({
        password: bcrypt.hashSync(req.body.password, 8),
        email: req.body.email,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
      });
      console.log(doc._id);
      doc2 = new Symptoms({
        _userID: doc._id,
      });
      doc3 = new Sensors({
        _userID: doc._id,
      });
      await doc.save();
      await doc2.save();
      await doc3.save();
      return res.status(200).json(doc).send();
    }
  });
});

router.post("/login", async (req, res, next) => {
  return User.findOne({ email: req.body.email }, async (err, user) => {
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
          message: "Invalid Password!",
        });
      } else {
        return res.status(200).send({
          _id: user._id,
          email: user.email,
          name: user.name,
          gender: user.gender,
          age: user.age,
        });
      }
    }
  });
});

router.post("/predict", async (req, res, next) => {
  try {
    const metadata = await getUser(req.body.id);
    const symptoms = await getSymptoms(req.body.id);
    const sensors = await getSensors(req.body.id);
    const body = Object.assign({}, metadata, symptoms, sensors);

    const result = await axios.post("http://localhost:5000/covid", body); //symptoms gender age

    // if (+result.data > 0) {
    //   const people = await findClosePeople({
    //     lon: metadata.location[0],
    //     lat: metadata.location[1],
    //   });
    //   console.log("The following people would be notified");
    //   console.log(people);
    // }

    // await sendSmS(`00${metadata.phone}`, +result.data);
    res.send(String(result.data));
  } catch (error) {
    console.error(error.stack);
    res.sendStatus(500);
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

router.get("/isPredictionReady", async (req, res, next) => {
  try {
    const doc = await getSymptoms(req.query.id);
    console.log(doc);
    if (!doc || Object.entries(doc).length === 0) {
      res.sendStatus(404);
    } else {
      console.log(doc);
      res.status(200).json({ covid_infected: doc.covid_infected }).send();
      const l = await Symptoms.deleteOne({ _userID: ObjectId(req.body.id) });

      const l2 = await Sensors.deleteOne({ _userID: ObjectId(req.body.id) });
      console.log(l);
      console.log(l2);
      doc2 = new Symptoms({
        _userID: req.body.id,
      });
      await doc2.save();

      doc3 = new Sensors({
        _userID: req.body.id,
      });
      await doc3.save();
    }
  } catch (error) {
    res.send(error);
  }
});

router.get("/getHealthInfo", async (req, res, next) => {
  try {
    const symptoms = await getSymptoms(req.query.id);
    const sensors = await getSensors(req.query.id);
    let survey = null;
    if (symptoms.submitted) {
      survey = symptoms;
    }
    let thermometer = null;
    if (sensors.thermometer != 0) {
      thermometer = {
        value: sensors.thermometer,
        fever: sensors.fever,
      };
    }
    let spirometer = null;
    if (sensors.spirometer != 0) {
      spirometer = {
        value: sensors.spirometer,
        difficult_breathing: sensors.difficult_breathing,
        pneumonia: sensors.pneumonia,
      };
    }
    let pulseoximeter = null;
    if (sensors.pulseoximeter != 0) {
      pulseoximeter = {
        value: sensors.pulseoximeter,
        difficult_breathing: sensors.fatigue,
      };
    }
    let result = {
      sensors: {
        pulseoximeter,
        spirometer,
        thermometer,
      },

      survey,
    };
    console.log(result);
    res.status(200).json(result).send();
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
    let doc = user;
    //if fev1
    if ((gender == "male" && sensor_value < 3.5)||(gender == "female" && sensor_value < 2.5)) {
      doc = await updateSymptoms(id, {
        pneumonia: 1,
        difficult_breathing: 1,
        spirometer: sensor_value
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
    //SEND TO ML SERVICE
    console.log(req.query.i)
    const data = await getUser(req.query.i);
    const result = await axios.get(
      `http://localhost:5000/pulseoximeter?s=${req.query.s}&age=${data.age}&gender=${data.gender}`
    );
    let percents = 0;
    
    if (result.data.value != "2") {
      percents = Number(result.data.percents)
    } 
    const doc = await updateSensors(req.query.i, {
      fatigue: {
        value: 1,
        percents: percents,
      },
      pulseoximeter:req.query.s
    });

    res.status(200).json(doc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//NEED TO BE TESTED
router.get("/thermometer", async (req, res, next) => {
  try {
    console.log(req.query);

    const data = await getUser(req.query.i);
    
    const sensor_value = req.query.s / 100;
    const result = await axios.get(
      `http://localhost:5000/thermometer?s=${req.query.s}&age=${data.age}&gender=${data.gender}`
    );
    let percents = 0;
    
    if (result.data.value != "2") {
      percents = Number(result.data.percents)
    } 
    const doc = await updateSensors(req.query.i, {
      fever: {
        value: 1,
        percents: percents,
      },
      thermometer: sensor_value
    });
    res.status(200).json(doc).send();
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
router.post("/symptoms", async (req, res) => {
  try {
    const { id, symptoms } = req.body;
    // const filteredSymptoms = Object.entries(symptoms).reduce((acc, cur) => {
    //   if (cur[1] === 1) {
    //     acc[cur[0]] = 1;
    //   }
    //   return acc;
    // }, {});

    console.log(symptoms);

    const doc = await updateSymptoms(id, symptoms);
    const d = await updateSymptoms(id, {"submitted":true});
    await d.save()
    res.status(200).send(doc);
  } catch {
    res.status(500).send();
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
/*

    var sputum: Int? = null,
    var muscle_pain: Int? = null,
    var sore_throat: Int? = null,
    var pneumonia: Int? = null,
    var cold: Int? = null,
    var fever: Int? = null,
    var sneeze: Int? = null,
    var reflux: Int? = null,
    var diarrhea: Int? = null,
    var runny_nose: Int? = null,
    var difficult_breathing: Int? = null,
    var chest_pain: Int? = null,
    var cough: Int? = null,
    var joint_pain: Int? = null,
    var fatigue: Int? = null,
    var flu: Int? = null,
    var headache: Int? = null,
    var vomiting: Int? = null,
    var loss_appetite: Int? = null,
    var chills: Int? = null,
    var nausea: Int? = null,
    var physical_discomfort: Int? = null,
    var abdominal_pain: Int? = null,

*/
