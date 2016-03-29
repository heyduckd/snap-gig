'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const jwtAuth = require(__dirname + '/../lib/authentication');

const Gig = require(__dirname + '/../models/gigs-schema');

const User = require(__dirname + '/../models/users-schema');

module.exports = (apiRouter) => {
  apiRouter.route('/gigs')
  .get((req, res) => {
    Gig.find({}).populate('submissions').exec((err, gigs) => {
      if(err) throw err
      res.status(200).json(gigs)
      res.end()
    })
  })
  .post((req, res) => {
    req.on('data', (data) => {
      let userInfo = req.user._id;
      //push gig owner to gig owner field in gig schema!!!!
      console.log('data is: ' + data);
      console.log('req is: ' + req);
      req.body = JSON.parse(data)
      var newGig = new Gig(req.body)
      console.log('req body is: ' + req.body);
      newGig.save((err, gig) => {
        if(err) throw err;
        User.findByIdAndUpdate(userInfo, { $push: {gigs: gig._id}}, (err, user) => {
          console.log(gig._id + 'was pushed for user ' + userInfo);
        });
        res.status(200);
        console.log('Gig Added');
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
      console.log('Showing Specific Gig');
      res.end()
    })
  })
  .patch((req, res) => {
  let userInfo = req.user._id;
  Gig.findById(req.params.id, (err, gig) => {
    if (err) throw err;
    console.log('gig owner is: ' + gig);
    console.log('user info is: ' + userInfo);
    if (gig.owner === userInfo) {
      gig.update(req.body, (err, data) => {
        if (err) throw err;
        console.log('gig successfully updated');
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
    //creates new submission schema entry, pushed submission ID to submissions array for specific gig
    req.on('data', (data) => {
      req.body = JSON.parse(data);
      let newSub = new Sub(req.body);
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
        res.status(200).json(submission);
        res.end();
      })
    })
  })
}
