var express = require("express");
var bodyParser = require('body-parser');
var server = express();

var App = require('./app');
var app = new App(require("./secrets"), require("./data"), function() {
  
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: true}));

  //serve index page etc.
  server.use(express.static('public'));

  //download the iCal file
  server.get('/:school/:username/:password', function (req, res) {
    app.getCalendarFromData({school: req.params.school, username: req.params.username, password: req.params.password}, function(ical) {
      if(ical != false) ical.serve(res);
      else res.end('404');
    });
  });

  //generate encrypted password from supplied args
  server.post('/generate', function(req, res) {
    res.end(app.encryptText(req.body.password));
  });

  var listener = server.listen(3000, function() {
    console.log('The magister calendar service has started on http://%s:%s.', listener.address().address, listener.address().port);
  });

});
