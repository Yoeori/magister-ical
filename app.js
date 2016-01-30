'use strict';

//dependecies
var cron = require("cron").CronJob;
var crypto_json = require('node-cryptojs-aes').JsonFormatter;
var crypto = require('node-cryptojs-aes').CryptoJS;

var User = require('./user');

class App {

  constructor(secrets, data, callback) {
    var self = this;

    this.secrets = secrets;
    this.users = [];

    this.addUsersFromData(data.users, callback);
  }

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

  encryptText(text) {
    return new Buffer(
      crypto.AES.encrypt(
        text, this.secrets.encryption_key,
        {format: crypto_json}
      ).toString()
    ).toString('base64');
  }

  decryptText(encrypted_text) {
    return crypto.enc.Utf8.stringify(
      crypto.AES.decrypt(
        new Buffer(encrypted_text, 'base64').toString(),
        this.secrets.encryption_key,
        {format: crypto_json}
      )
    );
  }

  findUserBySchoolAndUsername(school, username) {
    for(var i = 0; i < this.users.length; i++) {
      if(this.users[i].school == school && this.users[i].username == username) {
        return this.users[i];
      }
    }
    return false;
  }

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
module.exports = App;
