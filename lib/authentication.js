'use strict'
let jwt = require('jsonwebtoken');
let User = require(__dirname + '/../models/users-schema.js');

module.exports = (req, res, next) => {
  let decoded;
  try {
    let token = req.headers.authorization.split(' ')[1];
    console.log(token);
    decoded = jwt.verify(token, 'CHANGE ME');
  }
  catch(err) {
    return res.status(400).json({message: 'authentication error'});
  }
  User.findOne({_id: decoded.id})
    .then(user => {
      next();
    })
    .catch(err => {
      res.status(400).json({message: err});
    })
}
