'use strict';

//load dependecies
var cron = require("cron").CronJob;
var crypto_json = require('node-cryptojs-aes').JsonFormatter;
var crypto = require('node-cryptojs-aes').CryptoJS;
var magister = require("magister.js");

var User = require('./user');

//create a ES6 class
class App {

  /**
   * Called when a new instance of App is created
   * @param  {Object}   secrets  contains the key to use when encrypting and decrypting
   * @param  {Object}   data     contains information about users and other settings
   * @param  {Function} callback called when the class is fully done with constructing
   */
  constructor(secrets, data, callback) {
    //save secrets and create users array
    this.secrets = secrets;
    this.users = [];

    //add all users in the data object to the app
    this.addUsersFromData(data.users || [], callback);
  }

  /**
   * Add all users in data array to the current instance of this class
   * @param {Array}    data     contains a set of user data: school, username, password (encrypted)
   * @param {Function} callback called when all of the users have been tested and added
   */
  addUsersFromData(data, callback) {
    var self = this;
    if(data.length == 0) {
      callback();
      return;
    }
    this.addUserFromData(data[0], function() {
      data.splice(0,1);
      self.addUsersFromData(data, callback);
    });
  }

  /**
   * Adds single user to the current instance of this class
   * @param {Object}   data     contains school, username and password (encrypted)
   * @param {Function} callback called when user has been tested and added
   */
  addUserFromData(data, callback) {
    var self = this;

    var user = new User(this, data.school, data.username, this.decryptText(data.password), function() {
      if(!user.hasLoggedIn) {
        callback(false)
      } else {
        self.users.push(user);
        callback(true);
      }
    });

  }

  /**
   * Encrypts the given text with AES with the current instance's secret
   * @param  {String} text the text to be encrypted
   * @return {String}      base64 encoded string of the encrypted text
   */
  encryptText(text) {
    return new Buffer(
      crypto.AES.encrypt(
        text, this.secrets.encryption_key,
        {format: crypto_json}
      ).toString()
    ).toString('base64');
  }

  /**
   * Decrypts the given text with AES with the current instance's secret
   * @param  {String} encrypted_text base64 encoded string of the encrypted text
   * @return {String}                the plain decrypted text
   */
  decryptText(encrypted_text) {
    try {
      return crypto.enc.Utf8.stringify(
        crypto.AES.decrypt(
          new Buffer(encrypted_text, 'base64').toString(),
          this.secrets.encryption_key,
          {format: crypto_json}
        )
      );
    } catch(e) {
      return null;
    }
  }

  /**
   * Utility function that checks if the given credentials are correct and work
   * @param  {String}   school   the name of the school
   * @param  {String}   username the username which will be used to login with
   * @param  {String}   password the password (unencrypted) which will be used to login with
   * @param  {Function} callback called with a boolean when the attempt to login has finished
   */
  checkCredentials(school, username, password, callback) {
    new magister.Magister({school: school, username: username, password: password, keepLoggedIn: false}).ready(function(error) {
      callback(error == null);
    });
  }

  /**
   * Finds a user that currently has a session running with the supplied school and username
   * @param  {String} school   the school of the user
   * @param  {String} username the username of the user
   * @return {Object}          class instance of the found user
   */
  findUserBySchoolAndUsername(school, username) {
    for(var i = 0; i < this.users.length; i++) {
      if(this.users[i].school == school && this.users[i].username == username) {
        return this.users[i];
      }
    }
    return false;
  }

  /**
   * gets the calander in iCal format from the specified user if found
   * @param  {Object}   data     contains school, username and an encrypted password
   * @param  {Function} callback called whith the iCal calendar when done downloading/updating
   */
  getCalendarFromData(data, callback) {
    var self = this;

    var user = this.findUserBySchoolAndUsername(data.school, data.username);
    if(user == false || !user.checkPassword(data.password)) {
      this.addUserFromData(data, function(succesfull) {
        if(!succesfull) {
          callback(false);
        } else {
          self.getCalendarFromData(data, callback);
        }
      });
    } else {
      user.getiCalCalendar(callback);
    }

  }

}

//export the class
module.exports = App;
