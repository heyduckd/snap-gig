'use strict'

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./lib/authentication');

// Routers
let publicRouter = express.Router();
let loginRouter = express.Router();
let apiRouter = express.Router();


mongoose.connect('mongodb://localhost/db');

// Create User Router
require('./routes/user-route')(publicRouter);

// Login User
require('./routes/login-route')(loginRouter);

// Gigs Router
require('./routes/gigs-route')(apiRouter);

app.use(bodyParser.json());

app.use('/public', publicRouter);
app.use('/login', loginRouter);
app.use('/api', auth, apiRouter);

app.listen(3000);
console.log('Server Listening on Port 3000');
