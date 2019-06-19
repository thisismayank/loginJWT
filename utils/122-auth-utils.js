'use strict';

const app = require('../server');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

module.exports = {
    hashPassword: function (password) {
    return bcrypt.hashSync(password, salt);
  },

  comparePassword: function (password, hashedPassword) {
    password = '' + password; // to handle numeric passwords
    hashedPassword = '' + hashedPassword;
    return bcrypt.compareSync(password, hashedPassword);
  }
}