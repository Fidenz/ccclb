'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: String,
  // existing: Boolean,
  picture: String
  // points: Number,
  // pointsRecent: Number,
  // projects: Number,
  // projectsRecent: Number,
  // challenges: Number,
  // challengesRecent: Number,
  // algorithms: Number,
  // algorithmsRecent: Number,
  // total: Number,
  // totalRecent: Number,
  // community: Number,
  // communityRecent: Number,
  // lastUpdate: Date,
  // following: [String]
}, { collection: 'user' });

module.exports = mongoose.model('User', UserSchema);