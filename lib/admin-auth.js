'use strict'
let jwt = require('jsonwebtoken');
let User = require(__dirname + '/../models/users-schema.js');
require('dotenv').load();

module.exports = (req, res, next) => {
  let adminUserName = req.headers.authorization.split(':')[0];
  let adminpass = req.headers.authorization.split(':')[1];
  if(adminUserName === process.env.ADMIN_USER_NAME && adminpass === process.env.ADMIN_USER_PASSWORD) {
    next();
  } else {
    res.status(400).json({msg: 'You are not authorized.'});
  }
}
