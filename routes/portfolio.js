var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")
var request = require('request');
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  res.render('portfolio', { cakes: JSON.parse(data)});
});


//download image to the server:
var download = function(url, filename, callback){
  request.head(url, function(err, res, body){
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/'+ filename))).on('close', callback);
  });
};

router.post('/', jsonParser, function(req, res, next) {
  const expectedAttributes = ["url", "name", "alt", "category", "header", "description"]
  let missingAttr = expectedAttributes.filter(x => !Object.keys(req.body).includes(x));
  if(missingAttr.length > 0) {
    res.status(400).end(`Missing attributes: ${missingAttr.join(", ")}`);
    return;
  }

  //check if url and name provided
  if(req.body.url == null || req.body.name == null) {
    res.status(400).end("URL/name not provided");
    return;
  }

  //check if category is correct (if provided)
  if(req.body.category != null && !(["wedding", "christmas", "birthday", "anniversary"].includes(req.body.category))) {
    res.status(400).end("Wrong category provided");
    return;
  } else {
    let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
    let portfoliosArray = JSON.parse(rawdata);
    if(portfoliosArray.filter(x => x.name === req.body.name).length == 0) {
      download(req.body.url, req.body.name, function(){
        console.log('done');
      });
      const newArray = portfoliosArray.concat([req.body])
      fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
    }
    res.end();
  }
});

//check if no additional attributes
// const expectedAttributes = ["url", "name", "alt", "category", "header", "description"]
// Object.keys(req.body).forEach(param => {
//   if(!(expectedAttributes.includes(param))) {
//     res.status(400).end("Wrong attributes");
//   }
// });

// //check if url and name provided
// if(req.body.url == null || req.body.name == null) {
//   res.status(400).end("URL/name not provided");
// }

// //check if category is correct (if provided)
// if(req.body.category != null) {
//   if (!(["wedding", "christmas", "birthday", "anniversary"].includes(req.body.category))) {
//     res.status(400).end("Wrong category provided");
//   }
// }
router.delete('/', jsonParser, function(req, res, next) {
  // Check if the request body has the expected attributes
  const expectedAttributes = ["name"];
  Object.keys(req.body).forEach(param => {
    if(!expectedAttributes.includes(param)) {
      return res.status(400).send({ error: "Unexpected attribute: " + param });
    }
  });

  // Check if the name attribute is provided
  if(!req.body.name) {
    return res.status(400).send({ error: "name attribute is required" });
  }

  // Read the portfolio data from the JSON file
  try {
    let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
    let portfoliosArray = JSON.parse(rawdata);
    // Filter out the portfolio with the specified name
    const newArray = portfoliosArray.filter(x => x.name !== req.body.name)
    if(newArray.length !== portfoliosArray.length) {
      fs.unlinkSync(path.resolve(__dirname, '../data/img/'+ req.body.name));
      console.log(req.body.name + " deleted!");
      fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
    }
    res.end();
  } catch (err) {
    return res.status(500).send({ error: "Failed to read or write portfolio data" });
  }
});

module.exports = router;