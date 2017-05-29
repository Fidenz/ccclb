'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChallengeSchema = new Schema({
  name: String
}, { collection: 'challenge' });

module.exports = mongoose.model('Challenge', ChallengeSchema);