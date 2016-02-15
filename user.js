'use strict';

var magister = require("magister.js");
var ical_generator = require('ical-generator');

class User {

  /**
   * Called when a new instance of User is created
   * @param  {App}      app      an instance of App that created this instance
   * @param  {String}   school   the schoolname of this user
   * @param  {String}   username the username of this user
   * @param  {String}   password the password of this user
   * @param  {Function} callback called when done creating this user
   */
  constructor(app, school, username, password, callback) {
    var self = this;

    this.ready = false;
    this.failedlogin = false;
    this.app = app;
    this.data = {school: school, username: username, password: password, keepLoggedIn: true};

    //TODO better fix for this?
    if(this.data.password == null) this.data.password = " ";

    new magister.Magister(this.data).ready(function(error) {
      if(error != null) {
        console.log("Error while logging in!");
        console.log(error);
        self.failedlogin = true;
      } else {
        self.ready = true;
        self.magister = this;
      }
      callback();
    });

  }

  /**
   * gets this instance's school
   * @return {String} the school
   */
  get school() {
    return this.data.school;
  }

  /**
   * checks if this user has succesfully logged in
   * @return {Boolean} if the user is logged in
   */
  get hasLoggedIn() {
    return this.ready && !this.failedlogin;
  }

  /**
   * gets this instance's username
   * @return {String} the username
   */
  get username() {
    return this.data.username;
  }

  /**
   * checks if given password is equal to this instance's password
   * @param  {[type]}  enc_password the encrypted password that will be checked
   * @return {Boolean}              if the password is correct
   */
  checkPassword(enc_password) {
    return this.app.decryptText(enc_password) == this.data.password;
  }

  /**
   * Downloads and creates an iCal formatted calendar file for this user instance
   * @param  {Function} callback called with the calendar when done creating it
   */
  getiCalCalendar(callback) {
    var self = this;
    var ical = ical_generator({domain: 'school.yoeori.nl', name: 'School Calendar'}).timezone('Europe/Amsterdam').ttl(60 * 15);

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
