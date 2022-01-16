const { Schema, model } = require('mongoose');

const orderStatusSchema = new Schema({
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
  }
});

module.exports = new model('OrderStatus', orderStatusSchema);