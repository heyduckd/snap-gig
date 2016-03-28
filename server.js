'use strict'

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jwtAuth = require('jsonwebtoken');

// Routers
let publicRouter = express.Router();
let loginRouter = express.Router();


mongoose.connect('mongodb://localhost/db');

// Create User Router
require('./routes/user-route')(publicRouter);

// Login User
require('./routes/login-route')(loginRouter);

app.use(bodyParser.json());

app.use('/public', publicRouter);

app.listen(3000);
console.log('Server Listening on Port 3000');
