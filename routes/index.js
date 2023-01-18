var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")

 /* GET home page. */
 router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(dirname, "../data/introductionArray.json"));
  let datarecommend = fs.readFileSync(path.resolve(dirname, "../data/recommendations.json"));
  res.render('index', { title: 'Express' , array: JSON.parse(data), datarecommend: JSON.parse(datarecommend)});
});



module.exports = router;