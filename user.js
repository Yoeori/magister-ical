'use strict';

var magister = require("magister.js");
var ical_generator = require('ical-generator');

class User {

  constructor(app, school, username, password, callback) {
    var self = this;

    this.ready = false;
    this.failedlogin = false;
    this.app = app;
    this.data = {school: school, username: username, password: password, keepLoggedIn: true};

    new magister.Magister(this.data).ready(function(error) {
      if(error != null) {
        console.log("Error!");
        console.log(error);
        self.failedlogin = true;
      } else {
        self.ready = true;
        self.magister = this;
      }
      callback();
    });
  }

  get school() {
    return this.data.school;
  }

  get hasLoggedIn() {
    return this.ready && !this.failedlogin;
  }

  get username() {
    return this.data.username;
  }

  checkPassword(enc_password) {
    return this.app.decryptText(enc_password) == this.data.password;
  }

  getiCalCalendar(callback) {
    var self = this;
    var ical = ical_generator({domain: 'school.yoeori.nl', name: 'School Calendar'}).timezone('Europe/Amsterdam');

    ical.prodId({
        company: 'nl.yoeori',
        product: 'Magister 6 to iCal',
        language: 'NL'
    });

    var now = new Date().getTime();

    this.magister.appointments(new Date(now - 1000 * 60 * 60 * 24 * 30), new Date(now + 1000 * 60 * 60 * 24 * 30), function (error, results) {
      for(var i in results) {
        var result = results[i];

        if(result.type() == 13 && result.status() != 4 && typeof result.absenceInfo() == "undefined") {
          ical.createEvent({
            uid: result.id() + "-"+self.data.username+"-"+self.data.school,
            start: result.begin(),
            end: result.end(),
            summary: result.classes()[0],
            description: result.description(),
            location: self.data.school + '; ' + result.classRooms()[0],
          });
        }
      }
      callback(ical);
    });

  }

}
module.exports = User;
