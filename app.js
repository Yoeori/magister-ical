var ical = require('ical-generator'),
    http = require('http'),
    cal = ical({domain: 'test.yoeori.nl', name: 'School Calendar'}),
    Magister = require("magister.js");


new Magister.Magister({ school: 'corderius', username: '133998', password: '***REMOVED***' }).ready(function () {
  var m = this;

  m.appointments(new Date(2015, 8, 10), new Date(2015, 10, 30), true, function (error, results) {
    for(i in results) {
      result = results[i];

      if(result.type() == 13) {
        cal.createEvent({
            start: new Date(),
            end: new Date(new Date().getTime() + 3600000),
            summary: result.classes()[0],
            description: result.description(),
            location: 'Corderius College; ' + result.classRooms()[0],
        });
      }

    }
  });

});

http.createServer(function(req, res) {
    cal.serve(res);
}).listen(3000, '127.0.0.1', function() {
    console.log('Server running at http://127.0.0.1:3000/');
});
