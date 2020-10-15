const express = require('express');
const router = express.Router();
const { register } = require('../services/userService')

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



module.exports = router;
