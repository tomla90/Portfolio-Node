var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()


router.post('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  let array = JSON.parse(rawdata);
  const newArray = array.concat([req.body.newText])
  fs.writeFileSync(path.resolve(__dirname, "../data/introductionArray.json"), JSON.stringify(newArray));
  res.end();
});

router.delete('/', function (req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, '../data/introductionArray.json'));
  let array = JSON.parse(rawdata);
  let del = req.body.deletedText;
  let delObj = array.find(() => req.body == del);
  let delIndex = array.indexOf(delObj);
  array.splice(delIndex, 1);
  fs.writeFileSync(
      path.resolve(__dirname, '../data/introductionArray.json'),
      JSON.stringify(array)
  );
  res.end();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  res.render('home', {array:JSON.parse(data)});
});



module.exports = router;