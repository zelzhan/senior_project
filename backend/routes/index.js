const axios = require("axios");
const { register, getUser } = require("../services/userService");
const { sendSmS } = require("../services/smsService");
const {
  writeSensors,
  getAllSensors,
  getSensorsById,
} = require("../services/sensorService");
const { Router } = require("express");
const router = Router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/register", async (req, res, next) => {
  try {
    const doc = await register(req.body);
    res.send(doc);
  } catch (error) {
    res.send(error.stack);
  }
});

router.post("/predict", async (req, res, next) => {
  try {
    const metadata = await getUser(req.body.id);
    const totaldata = Object.assign({}, metadata._doc, req.body);

    const result = await axios.post("http://localhost:5000", totaldata);
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

router.post("/sensordata", async (req, res, next) => {
  try {
    await writeSensors(req.body);
    const doc = await getAllSensors();
    res.send(doc);
  } catch (error) {
    res.send(error);
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
