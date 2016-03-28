'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Gigs = require('./gigs-schema');
const Submissions = require('./submissions-schema');

var userSchema = mongoose.Schema({
  username: {type: String, unique: true},
  password: String,
  firstName: String,
  lastName: String,
  occupation: String,
  email: {type: String, unique: true},
  submissions: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  },
  gigs: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig'
  }
})

userSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10))
  console.log('THIS PASSWORD : ', this.password);
  next()
})

userSchema.methods.compareHash = function(password){
  return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateToken = function(){
  return jwt.sign({ _id: this._id, email: this.email, occupation: this.occupation }, 'CHANGE ME')
}

var User = mongoose.model('User', userSchema)
module.exports = User
