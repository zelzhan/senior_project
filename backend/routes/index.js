const express = require('express');
const axios = require('axios')
const router = express.Router();
const { register, getUser } = require('../services/userService')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/register", async (req, res, next) => {

  try {
    const doc = await register(req.body)
    res.send(doc)
  } catch (error) {
    res.send(500);
  }
});

router.post("/predict", async (req, res, next) => {
  try {
    const metadata = await getUser(req.body.id);
    const totaldata = Object.assign({}, metadata._doc, req.body)
    const result = await axios.post('http://localhost:5000',totaldata );
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
    res.send(doc)
  }
})




module.exports = router;
