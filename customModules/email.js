'use strict';

var nodeMailer = require('nodemailer');

// needed
// req.user.email
// req.body.name
// req.user.username

var mailer = {};

mailer.gig = (userEmail, fileName, userName, deadline, gig, cb) => {
  var transporter = nodeMailer.createTransport('smtps://snapgignotification@gmail.com:snapsnap@smtp.gmail.com');
  console.log('SENDING EMAIL :');
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
    console.log('EMAIL HAS BEEN SEND', info);
      return gig
  })
}
// mailer(req.user.email, req.body.name, req.user.username, req.body.deadline, gig, (err, info) => {
//   if (err) throw err;
//   res.json({data: gig})
//   res.end();
// })

mailer.submission = (gigUserEmail, submissionName, submissionUser, cb) => {
  var transporter = nodeMailer.createTransport('smtps://snapgignotification@gmail.com:snapsnap@smtp.gmail.com');
  console.log('SENDING EMAIL :');
  var mailOptions = {
    from: '"snapgig" <snapgignotification@gmail.com>',
    to: gigUserEmail,
    subject: 'New submission, ' + submissionName + ' has been posted by ' + submissionUser,
    text: submissionUser + ', a submission, ' + submissionName + ', has been successfully submitted to your gig'
  }
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return (error)
    }
    console.log('EMAIL HAS BEEN SEND', info)
      return submission
  })
}
module.exports = mailer;
