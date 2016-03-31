'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwtAuth = require(__dirname + '/../lib/authentication');
const Gig = require(__dirname + '/../models/gigs-schema');
const User = require(__dirname + '/../models/users-schema');

module.exports = adminRouter => {
  adminRouter.route('/users')
  .get((req, res) => {
    User.find({}).populate('Submission').populate('Gig').exec((err, users) => {
      if (err) throw err;
      res.status(200).json(users)
      res.end();
    });
  });
  adminRouter.route('/users/:id')
  .put((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data);
      User.update({_id: req.params.id}, req.body, (err, user) => {
        if (err) {
          res.status(404).json({msg: 'User not found'});
          res.end();
        }
        res.status(200);
        res.json(user);
        res.end();
      });
    });
  })
  .delete((req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (err) {
        res.status(404).json({msg: 'User not found'});
        res.end();
      }
      user.remove((err, user) => {
        if (err) {
          res.status(404).json({msg: 'User coundn\'t be deleted'});
          res.end();
        }
        res.status(200);
        res.json({msg: 'User ' + req.params.id + ' has been deleted.'});
        res.end();
      });
    });
  });
}
