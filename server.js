'use strict'

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const jwtAuth = require('jsonwebtoken');

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/db');

app.listen(3000);
console.log('Server Listening on Port 3000');
