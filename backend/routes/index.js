const express = require('express');
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
    const totaldata = metadata.concat(req.body);
    const result = await axios.post('http://localhost:5000',totaldata );
    res.send(result)
  } catch (error) {
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
