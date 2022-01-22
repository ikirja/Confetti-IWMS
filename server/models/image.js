const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  file: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

module.exports = new model('Image', imageSchema);