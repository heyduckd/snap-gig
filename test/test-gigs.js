'use strict'

let chai = require('chai');
let chaiHTTP = require('chai-http');
chai.use(chaiHTTP);
let expect = chai.expect;
let request = chai.request;
let mongoose = require('mongoose');

let User = require(__dirname + '/../models/users-schema');
let Gig = require(__dirname + '/../models/gigs-schema');

let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');

require(__dirname + '/../server');
let userId;
let testToken;
describe('Testing for creating a new user', () => {

  before((done) => {
    let newGig = new Gig({name:"Wizards Beard Logo Creation",
      category:"Graphic Design",
      description:"Make a new logo for Wizards Beard Coffee",
      deadline:"April 4th 2016",
      payment_range:"$400"})
      newGig.save((err, gig) => {
        console.log('New Test Gig: ', gig)
        done()
      })
    })
// CREATES A NEW USER
  it('should create a new user and save to db', (done) => {
    request('localhost:3000')
    .post('/public/user')
    .send('{"username":"AlienBrain", "password":"123asd", "firstName":"Dwight", "lastName":"Shrute", "occupation":"Alien Hunter", "email":"alienbrain@gmail.com"}')
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      expect(res.body.username).to.eql('AlienBrain')
      expect(res.body.email).to.eql('alienbrain@gmail.com')
      userId = res.body._id
      done()
    })
  })
// LOGGING IN WITH US/PW AND GET USER TOKEN
it('Should login with correct user credentials and receive token', (done) => {
  request('localhost:3000')
  .post('/login/login')
  .auth('AlienBrain:123asd')
  .end((err, res) => {
    expect(res.status).to.eql(200)
    expect(res.body).to.have.property('token')
    testToken = res.body.token
    console.log('This is the test token: ' + testToken);
    done()
  })
})

  it('Should match the new gig created in the before block', (done) => {
    request('localhost:3000')
    .get('/api/gigs')
    .set('Authorization', 'token ' + testToken)
    .end((err, res) => {
      expect(res.status).to.eql(200)
      expect(res.body).to.be.a.object
      done()
    })
  })

  it('Should create a new gig', (done) => {
    request('localhost:3000')
    .post('/api/gigs')
    .send('{"name":"That dude is weird graphic", "category":"Graphic Art", "description":"Create a graphic art peice that shows how weird that TA is", "deadline":"April 1st, 2016", "payment_range":"$1000"}')
    .end((err, res) => {
      // expect(res.status).to.eql(200)
      expect(res.body.name).to.eql('That dude is weird graphic')
      expect(res.body.category).to.eql('Graphic Art')
      expect(res.body.description).to.eql('Create a graphic art peice that shows how weird that TA is')
      expect(res.body.deadline).to.eql('April 1st, 2016')
      expect(res.body.payment_range).to.eql('$1000')
      done()
    })
  })

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done()
    })
  })

})
