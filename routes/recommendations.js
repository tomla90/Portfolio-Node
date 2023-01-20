var express = require('express');
var router = express.Router();
const fs = require("fs")
const path = require("path")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

/* GET home page. */
router.get('/', function(req, res, next) {
  let data = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  res.render('recommendations', { data: JSON.parse(data)
 });
});

router.post('/', jsonParser, function(req, res, next) {
  //Check if the attributes of req body are valid
  const expectedAttributes = ["name", "avatar", "role", "description"];
  if (!Object.keys(req.body).every(param => expectedAttributes.includes(param))) {
    return res.status(400).send({ error: "Unexpected attribute provided" });
  }
  // Check if the name and avatar attributes are provided
  if(!req.body.name || !req.body.avatar) {
    return res.status(400).send({ error: "Name and avatar not provided" });
  }
  // Check if the avatar is in the array [1,2,3]
  if(!([1,2,3].includes(req.body.avatar))) {
    return res.status(400).send({ error: "Invalid avatar value" });
  }
  // read the recommendations.json file and parse it 
  fs.promises.readFile(path.resolve(__dirname, "../data/recommendations.json"), 'utf8')
    .then(rawdata => {
      let recommendationsArray = JSON.parse(rawdata);
      // check if the name is already in the recommendations array
      if(recommendationsArray.filter(x => x.name === req.body.name).length == 0) {
        // if not, add it to the array
        const newArray = recommendationsArray.concat([req.body])
        //write the new array to the recommendations.json file
        return fs.promises.writeFile(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray));
      }
    }).then(() => {
      //end the response 
      res.end();
    }).catch(err => {
      return res.status(500).send({ error: "Failed to read or write recommendations data"});
    });
});

router.delete('/', jsonParser, function(req, res, next) {
  //Check if the name attribute is provided
  if(!req.body.name) {
    return res.status(400).send({ error: "Name not provided" });
  }
  //read the recommendations.json file and parse it 
  fs.promises.readFile(path.resolve(__dirname, "../data/recommendations.json"), 'utf8')
    .then(rawdata => {
      let recommendationsArray = JSON.parse(rawdata);
      // filter out the recommendation with the name provided in the req body
      const newArray = recommendationsArray.filter(x => x.name !== req.body.name)
      //write the new array to the recommendations.json file
      if (newArray.length !== recommendationsArray.length ) {
        return fs.promises.writeFile(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray));
      }
    }).then(() => {
      res.end();
    }).catch(err => {
      return res.status(500).send({ error: "Failed to read or write recommendationsdata data"});
    });
});

module.exports = router;