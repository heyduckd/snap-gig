'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwtAuth = require(__dirname + '/../lib/authentication');
const Gig = require(__dirname + '/../models/gigs-schema');
const Sub = require(__dirname + '/../models/submissions-schema');
const User = require(__dirname + '/../models/users-schema');
const AWS = require('aws-sdk');
let s3 = new AWS.S3();

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
          res.status(200).json({data: gig});
          res.end()
        })
      })
  })

  apiRouter.route('/gigs/:id')
    .get((req, res) => {
      Gig.findById(req.params.id, (err, gig) => {
        if (err) {
          res.status(400).json({msg: 'Couldn\'t find gig'});
        }
        res.status(200).json({data: gig});
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
      let readFileBody;
      req.on('data', (data) => {
        var newBody;
        req.body = JSON.parse(data);
        let newSub = new Sub(req.body);
        fs.readFile(__dirname + '/../userContent/testingFile.txt', (err, readFile) => {
          if (err) {
            res.status(400).json({msg: 'AWS error: ' + err});
          }
          readFileBody = readFile
        })

        let params = {
          Bucket: 'snap-gig-gig-bucket-dump',
          Key: req.body.name,
          ACL: 'public-read-write',
          Body: readFileBody
        }

        newSub.save((err, submission) => {
          if (err) {
            res.status(404).json({msg: 'Invalid Submission'});
            res.end();
          }
          console.log('REQUEST PARAMS ID : ' + submission);
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
          s3.putObject(params, (err, data) => {
            if (err) {
              res.status(400).json({msg: 'Can\'t save file due to err: ' + err});
            }
            // console.log('this is data: ', data);
          })
          res.status(200).json(submission);
          res.end();
          // Still need to implement S3 save and grab of saved URL. Also grabbing "CHUNKS" of attachment data
        })
      })
  })
}
