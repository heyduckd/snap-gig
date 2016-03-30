'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const jwtAuth = require(__dirname + '/../lib/authentication');
const Gig = require(__dirname + '/../models/gigs-schema');
const Sub = require(__dirname + '/../models/submissions-schema');
const User = require(__dirname + '/../models/users-schema');
const AWS = require('aws-sdk');
let zlib = require('zlib');
let s3 = new AWS.S3();

var nodeMailer = require('nodemailer');
var mailer = require(__dirname + '/../customModules/email');

module.exports = (apiRouter) => {
  apiRouter.route('/gigs')
    .get((req, res) => {
      Gig.find({}).populate('owner').populate('submissions').exec((err, gigs) => {
        if(err) throw err;
        res.status(200).json({msg: gigs});
        res.end();
      });
    })
    .post((req, res) => {
      req.on('data', (data) => {
        let userInfo = req.user._id;
        req.body = JSON.parse(data);
        var newGig = new Gig(req.body);
        newGig.save((err, gig) => {
          if(err) throw err;
          User.findByIdAndUpdate(userInfo, { $push: {gigs: gig._id}}, (err, user) => {

          })
          mailer.gig(req.user.email, req.body.name, req.user.username, req.body.deadline, gig, (err, info) => {
            if (err) throw err;
            res.json({data: gig})
            res.end();
          })
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
    .put((req, res) => {
      let userInfo = req.user._id;
      Gig.findById(req.params.id, (err, gig) => {
        if (err) throw err;
        if (JSON.stringify(gig.owner[0]) == JSON.stringify(userInfo)) {
          gig.update(req.body, (err, data) => {
            if (err) throw err;
            res.status(200).json({msg: 'gig updated!'})
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
        if (JSON.stringify(gig.owner[0]) == JSON.stringify(userInfo)) {
          gig.remove((err, gig) => {
            res.status(200).json({msg: 'gig removed!!'})
          });
        } else {
          res.json({msg: 'you dont have permission to delete this user'});
        };
      });
  });

  apiRouter.route('/gigs/:id/submissions')
    .post((req, res) => {
      req.on('data', (data) => {
        console.log('REQUEST USER AFTER HITTING ROUTE : ', req.user);
        var newBody;
        req.body = JSON.parse(data);
        let newSub = new Sub(req.body);
        let globalSubmitId;

        newSub.save((err, submission) => {
          if (err) {
            res.json({error: err});
            res.end();
          }
          let submissionId = submission._id;
          let gigOwner;
          let gigUserEmail;
          let gigUserName;
          globalSubmitId = submission._id;
          Gig.findByIdAndUpdate(req.params.id, {$push: {submissions: submissionId}}, (err, gig) => {
            if (err) {
              res.status(404).json({msg: 'Invalid Submission when finding gig by id'});
              res.end();
            }
          });

          User.findByIdAndUpdate(req.user._id, {$push: {submissions: submissionId}}, (err, subId) => {
            if (err) {
              res.status(404).json({msg: 'Invalid Submission when finding user'});
              res.end();
            }
          })

          // mailer.submission(gigUserEmail, submission.name, req.user, (err, submission) => {
          //   if (err) throw err;
          //   res.json({data: submission})
          //   res.end();
          // })

          // let docBody = fs.createReadStream(__dirname + '/../img/picture.png');
          let docBody = fs.createReadStream(__dirname + submission.path);
          let s3obj = new AWS.S3({params: {Bucket: 'snap-gig-gig-bucket-dump', Key: req.body.name, ACL: 'public-read-write'}});
          s3obj.upload({Body: docBody})
          .on('httpUploadProgress', function(evt) {
            console.log('EVENT FROM UPLOAD', evt);
          })
          .send(function(err, data) {
            console.log('ERROR AND DATA FROM UPLAD', err, data);
          });
          res.status(200).json({sub: submission});
          res.end();

          s3.getSignedUrl('getObject', {Bucket: 'snap-gig-gig-bucket-dump', Key: req.body.name}, (err, url) => {
            if (err) throw err;
            Sub.findByIdAndUpdate(globalSubmitId, {$push: {files: url}}, (err, sub) => {
              if (err) {
                res.status(404).json({msg: 'File URL was not pushed to submission schema'});
                res.end();
              }
            });
          });
          // Still need to implement S3 save and grab of saved URL. Also grabbing "CHUNKS" of attachment data
        });
      });
    });
};
