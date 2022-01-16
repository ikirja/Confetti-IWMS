const { Schema, model } = require('mongoose');

const customerSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  fields: {
    type: Array,
    required: true,
    default: {}
  }
});

module.exports = new model('Customer', customerSchema);