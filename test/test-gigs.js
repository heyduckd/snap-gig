'use strict'

let chai = require('chai');
let chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
let expect = require('chai').expect;
let request = require('chai').request;
let mongoose = require('mongoose');

let User = require(__dirname + '/../models/users-schema');
let Gig = require(__dirname + '/../models/gigs-schema');

// mongoose.connect('mongodb://localhost/testdb');
require(__dirname + '/../server');
let userId;
let userToken;
let gigId;

describe('Testing gigs routing and authentication', () => {

  before((done) => {
    let newUser = new User({username:"SirHenry01", password:"123asd", firstName:"Henry", lastName:"Hippo", occupation:"Designer", email:"henryhippo@gmail.com"})
    newUser.save((err, user) => {
      console.log('New User B4 Block', user);
      done();
    });
  });

  it('Should create a new gig with owner as the user created in the before block', (done) => {
    request('localhost:3000')
    .post('/gigs')
    .send({
      "name":"Wizards Beard Logo Creation",
      "category":"Graphic Design",
      "description":"Make a new logo for Wizards Beard Coffee",
      "deadline":"April 4th 2016",
      "payment_range":"$400"})
    .end((err, res) => {
      expect(err).to.eql(null);
      expect(res.status).to.eql(200);
      expect(res.body.name).to.eql('Wizards Beard Logo Creation');
      expect(res.body.category).to.eql('Graphic Design');
      expect(res.body.description).to.eql('Make a new logo for Wizards Beard Coffee');
      expect(res.body.deadline).to.eql('April 4th, 2016');
      expect(res.body.payment_range).to.eql('$400');
      gigId = res.body._id;
      done();
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

});
