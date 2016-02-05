var express = require("express");
var bodyParser = require('body-parser');
var server = express();

var App = require('./app');

var app = new App(require("./secrets"), require("./data"), function() {

  var router = express.Router();
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({extended: true}));

  //serve index page etc.
  router.use(express.static('public'));

  //download the iCal file
  router.get('/:school/:username/:password', function (req, res) {
    app.getCalendarFromData({school: req.params.school, username: req.params.username, password: req.params.password}, function(ical) {
      if(ical != false) ical.serve(res);
      else res.end('404');
    });
  });

  //generate encrypted password from supplied args
  router.post('/generate', function(req, res) {
    res.end(app.encryptText(req.body.password));
  });

  server.use(process.env.NODE_SUBURL || '', router);

  var listener = server.listen(3000, function() {
    console.log('The magister calendar service has started on http://%s:%s.', listener.address().address, listener.address().port);
  });

});
