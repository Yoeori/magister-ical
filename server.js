//require all necessary libraries
var fs = require("fs");
var crypto = require('crypto');
var express = require("express");
var bodyParser = require('body-parser');
var App = require('./app');
var server = express();

//check if necessary files exist, otherwise start creating them.
try {
  fs.accessSync('./secrets.json', fs.F_OK | fs.R_OK | fs.W_OK);
} catch(e) {
  //generate random key and convert to base64 and save to secrets.json file
  console.log("generating secret and saving it to disk in ./secrets.json");
  fs.writeFileSync('secrets.json', JSON.stringify({encryption_key:crypto.randomBytes(128).toString("base64")}));
}

try {
  fs.accessSync('./data.json', fs.F_OK | fs.R_OK | fs.W_OK);
} catch(e) {
  //create data file
  console.log("creating ./data.json");
  fs.writeFileSync('data.json', JSON.stringify({}));
}

//create a new instance of the ical app
var app = new App(require("./secrets"), require("./data"), function() {

  //create new router to add all routes to
  var router = express.Router();

  //use bodyparser to be able to read request params
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({extended: true}));

  //serve index page etc.
  router.use(express.static('public'));

  //download the iCal file for the given data
  router.get('/:school/:username/:password', function(req, res) {
    app.getCalendarFromData({school: req.params.school, username: req.params.username, password: req.params.password}, function(ical) {
      if(ical != false) ical.serve(res);
      else res.end('404');
    });
  });

  //check given credentials and if correct generate encrypted password
  router.post('/test', function(req, res) {
    app.checkCredentials(req.body.school, req.body.username, req.body.password, function(result) {
      if(result == true) res.json({error: false, password: app.encryptText(req.body.password)});
      else res.json({error: true, message: 'credentials incorrect'});
    });
  });

  //get list of schools matching query
  router.get('/schools', function(req, res) {
    app.getListOfSchools(req.query.name || '', function(result) {
      res.json(result);
    });
  });

  //add the router to the server
  server.use(process.env.NODE_SUBURL || '', router);

  //start the server
  var listener = server.listen(process.env.NODE_PORT || 3000, function() {
    console.log('The magister calendar service has started on http://%s:%s%s.', listener.address().address, listener.address().port, process.env.NODE_SUBURL || '');
  });

});
