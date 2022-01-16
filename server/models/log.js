const { Schema, model } = require('mongoose');

const logSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  errorCode: {
    type: String,
    required: true
  },
  data: String,
  message: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
});

module.exports = new model('Log', logSchema);