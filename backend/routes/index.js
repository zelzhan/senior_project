const express = require('express');
const axios = require('axios')
const router = express.Router();

const { register, getUser, updateSensors } = require('../services/userService')
const { writeSensors, getAllSensors } = require('../services/sensorService')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/register", async (req, res, next) => {

  try {
    const doc = await register(req.body)
    res.send(doc)
  } catch (error) {
    res.send(error.stack);
  }
});

router.post("/predict", async (req, res, next) => {
  try {
    const metadata = await getUser(req.body.id);
    const totaldata = Object.assign({}, metadata._doc, req.body)
    const result = await axios.post('http://localhost:5000', totaldata);
    res.send(String(result.data))
  } catch (error) {
    console.error(error.stack)
    res.send(500)
  }
});

router.get("/metadata", async (req, res, next) => {
  try {
    const doc = await getUser(req.query.id);
    res.send(doc)
  } catch (error) {
    res.send(error)
  }
})

/* {
  id: 0,
  sensor_value: 0,
  sensor_type: "string"
}
*/
router.post("/sensordata", async (req, res, next) => {
  try {
    const data = await getUser(req.query._id);
    const gender = data.sex;
    
    let doc;
    if (req.body.sensor_type == "spirometer" ){
      //if fev1
      if (   gender == "male" && req.body.sensor_value < 3.5 ) {
        doc = await updateSensors(req.body.id,{"pneumonia":1, "difficult_breathing":1});
      }
      else if (   gender == "female" && req.body.sensor_value < 2.5 ) {
        doc = await updateSensors(req.body.id,{"pneumonia":1, "difficult_breathing":1});
      }
    }

    else if (req.body.sensor_type == "thermometer" ){
      if (req.body.sensor_value > 36.6) {
        doc = await updateSensors(req.body._id,{"fever":1});

      }
    }
    else if (req.body.sensor_type == "pulseoximeter" ){
      if (req.body.sensor_value < 60) {
        doc = await updateSensors(req.body.id,{"fatigue":1});
      }
    }
  
    res.send(doc);

  } catch (error) {
    res.send(error)
  }
})

router.post("/")



module.exports = router;
