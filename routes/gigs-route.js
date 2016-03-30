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

module.exports = (apiRouter) => {
  apiRouter.route('/gigs')
    .get((req, res) => {
      Gig.find({}).populate('owner').populate('submissions').exec((err, gigs) => {
        if(err) throw err
        res.status(200).json({msg: 'getting all gigs'});
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
          })

          var transporter = nodeMailer.createTransport('smtps://snapgignotification@gmail.com:snapsnap@smtp.gmail.com');
          console.log('SENDING EMAIL :');
          var mailOptions = {
            from: '"snapgig" <snapgignotification@gmail.com>',
            to: req.user.email,
            subject: 'New Gig, ' + req.body.name + ' has been created',
            text: req.user.username + ', your gig has been successfully submitted. The deadline for submissions is, ' + req.body.deadline
          }
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              res.json({msg: 'Gig couldn\'t be posted'});
              res.end();
            }
            console.log('EMAIL HAS BEEN SEND', info);
            res.status(200).json({data: gig});
            res.end()
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
        var newBody;
        req.body = JSON.parse(data);
        let newSub = new Sub(req.body);

        newSub.save((err, submission) => {
          if (err) {
            res.json({error: err});
            res.end();
          }
          let submissionId = submission._id;
          Gig.findByIdAndUpdate(req.params.id, {$push: {submissions: submissionId}}, (err, subId) => {
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

          let docBody = fs.createReadStream(__dirname + '/../img/picture.png');
          let s3obj = new AWS.S3({params: {Bucket: 'snap-gig-gig-bucket-dump', Key: req.body.name, ACL: 'public-read-write'}});
          s3obj.upload({Body: docBody})
          .on('httpUploadProgress', function(evt) {
            console.log('EVENT FROM UPLOAD', evt);
          })
          .send(function(err, data) {
            console.log('ERROR AND DATA FROM UPLAD', err, data);
          })
          res.status(200).json({sub: submission});
          res.end();
          // Still need to implement S3 save and grab of saved URL. Also grabbing "CHUNKS" of attachment data
        })
      })
  })
}
