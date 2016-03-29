'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const jwtAuth = require(__dirname + '/../lib/authentication');

const Gig = require(__dirname + '/../models/gigs-schema');
const Sub = require(__dirname + '/../models/submissions-schema');
const User = require(__dirname + '/../models/users-schema');

module.exports = (apiRouter) => {
  apiRouter.route('/gigs')
  .get((req, res) => {
    Gig.find({}).populate('owner').populate('submissions').exec((err, gigs) => {
      if(err) throw err
      res.status(200).json(gigs)
      res.end()
    })
  })
  .post((req, res) => {
    req.on('data', (data) => {
      let userInfo = req.user._id;
      req.body = JSON.parse(data)
      var newGig = new Gig(req.body)
      newGig.save((err, gig) => {
        if(err) throw err;
        User.findByIdAndUpdate(userInfo, { $push: {gigs: gig._id}}, (err, user) => {
        });
        res.status(200);
        res.end()
      })
    })
  })

  apiRouter.route('/gigs/:id')
  .get((req, res) => {
    Gig.findById(req.params.id, (err, gig) => {
      if (err) throw err
      res.json(gig)
      res.status(200)
      res.end()
    })
  })
  .patch((req, res) => {
  let userInfo = req.user._id;
  Gig.findById(req.params.id, (err, gig) => {
    if (err) throw err;
    if (gig.owner === userInfo) {
      gig.update(req.body, (err, data) => {
        if (err) throw err;
      })
    } else {
      res.status(404).json({msg: 'You do not have permissions to patch this gig!'});
    };
  });
})
  .delete((req, res) => {
    let userInfo = req.user._id;
    Gig.findById(req.params.id, (err, gig) => {
      if (err) throw err;
      if (gig.owner === userInfo) {
        gig.remove((err, gig) => {
          res.json({msg: 'gig removed!!'})
        });
      } else {
        res.json({msg: 'you dont have permission to delete this user'});
      };
    });
  });

  apiRouter.route('/gigs/:id/submissions')
  .post((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data);
      let newSub = new Sub(req.body);
      console.log('REQEST ID FOR SUBMISSION USER : ', req.user._id);
      console.log(req.body);
      newSub.save((err, submission) => {
        if (err) {
          res.status(404).json({msg: 'Invalid Submission'});
          res.end();
        }
        let submissionId = submission._id;
        Gig.findByIdAndUpdate(req.params.id, {$push: {submissions: submissionId}}, (err, subId) => {
          if (err) {
            res.status(404).json({msg: 'Invalid Submission'});
            res.end();
          }
        })
        User.findByIdAndUpdate(req.user._id, {$push: {submissions: submissionId}}, (err, subId) => {
          if (err) {
            res.status(404).json({msg: 'Invalid Submission'});
            res.end();
          }
        })
        res.status(200).json(submission);
        res.end();
        // Still need to implement S3 save and grab of saved URL. Also grabbing "CHUNKS" of attachment data
      })
    })
  })
}
