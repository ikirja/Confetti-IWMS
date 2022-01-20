const { Schema, model } = require('mongoose');

const registrySchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true
  },
  title: String,
  fields: Object
});

module.exports = new model('Registry', registrySchema);