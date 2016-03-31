'use strict';

var nodeMailer = require('nodemailer');

var mailer = {};

mailer.gig = (userEmail, fileName, userName, deadline, gig, cb) => {
  var transporter = nodeMailer.createTransport('smtps://snapgignotification@gmail.com:snapsnap@smtp.gmail.com');
  var mailOptions = {
    from: '"snapgig" <snapgignotification@gmail.com>',
    to: userEmail,
    subject: 'New Gig, ' + fileName + ' has been created',
    text: userName + ', your gig, ' + fileName + ', has been successfully submitted. The deadline for submissions is, ' + deadline
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return (error)
    }
      return gig
  })
}

mailer.submission = (gigEmail, submissionName, submissionUser, gigName, gigOwner, cb) => {
  var transporter = nodeMailer.createTransport('smtps://snapgignotification@gmail.com:snapsnap@smtp.gmail.com');
  var mailOptions = {
    from: '"snapgig" <snapgignotification@gmail.com>',
    to: gigEmail,
    subject: 'A new submission has been posted by ' + submissionUser,
    text: gigOwner + ', a submission nammed ' + submissionName + ', has been posted to your gig, ' + gigName
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return (error)
    }
      return info
  })
}
module.exports = mailer;
