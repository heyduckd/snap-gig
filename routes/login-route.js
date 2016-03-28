'use strict'

const jwt = require('jsonwebtoken');
const User = require(__dirname + '/../models/users-schema');

module.exports = (loginRouter) => {
  loginRouter.post('/login', (req, res) => {
    let based64ed = req.headers.authorization.split(' ')[1];
    let authArray = new Buffer(based64ed, 'base64').toString().split(':');
    let name = authArray[0];
    let password = authArray[1];

    User.find({username: name}, (err, user) => {
      let valid = user[0].compareHash(password);
      if(!valid) {
        return res.status(400).json({message: 'invalid login'})
      }

      res.status(200).json({token: user[0].generateToken()})
      res.end();
    })
  })
}
