const { Schema, model } = require('mongoose');

const productSchema = new Schema({
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
  sku: {
    type: String,
    required: true,
    unique: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
      min: 0
    },
    height: {
      type: Number,
      required: true,
      min: 0
    },
    depth: {
      type: Number,
      required: true,
      min: 0
    }
  },
  barcode: {
    type: String,
    required: true
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'Image'
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }
  ],
  description: {
    type: String,
    required: true,
    default: ''
  },
  purchasePrice: {
    type: Number,
    required: true,
    default: 0
  },
  archived: {
    type: Boolean,
    default: false
  }
});

module.exports = new model('Product', productSchema); 