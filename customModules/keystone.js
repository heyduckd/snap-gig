var express = require('express');
var app = express()
var keystone = require('keystone')
var mongoose = require('mongoose')

var flash = require('connect-flash')
var serve = require('serve-static')

app.use(flash());
app.use(session({
  secret: 'Keystone is the best!',
  resave: false,
  saveUninitialized: true
}));

keystone.app = app;
keystone.mongoose = mongoose;
keystone.init({
  'user model': 'User',
  'mongo': 'mongodb://localhost/keystone',
  'session': true,
  'static': 'public'
});

keystone.import('models');
keystone.routes(app);
keystone.mongoose.connect(keystone.get('mongo'));
