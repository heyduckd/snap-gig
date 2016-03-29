'use strict'

const express = require('express');
const mongodb = require('mongodb');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./lib/authentication');

// Routers
let publicRouter = express.Router();
let loginRouter = express.Router();
let apiRouter = express.Router();
let adminRouter = express.Router();


mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/db');

// Create User Router
require('./routes/user-route')(publicRouter);

// Login User
require('./routes/login-route')(loginRouter);

// Gigs Router
require('./routes/gigs-route')(apiRouter);

//admin routes
require('./routes/admin-route')(adminRouter);

app.use(bodyParser.json());

app.use('/public', publicRouter);
app.use('/login', loginRouter);
app.use('/api', auth, apiRouter);
app.use('/admin', auth, adminRouter);

app.listen(3000, () => {
  console.log('Server started on 3000!');
});
