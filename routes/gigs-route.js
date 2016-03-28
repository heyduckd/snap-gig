'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const jwtAuth = require(__dirname + '/../lib/authentication');

const Gig = require(__dirname + '/../models/gigs-schema');

module.exports = (apiRouter) => {
  apiRouter.route('/gigs');
  
}
