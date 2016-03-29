'use strict';

let mongoose = require('mongoose');

let submissionSchema = new mongoose.Schema ({
  owner: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  name: {type: String},
  body: {type: String},
  // name: {type: String, required: true, unique: true},
  // body: {type: String, required: true},
  files: String,
  updated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Submission', submissionSchema);
