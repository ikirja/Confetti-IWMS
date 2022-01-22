const Product = require('./product');
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

imageSchema.pre('remove', async function (next) {
  const foundProduct = await Product.findOne({ images: this._id });
  if (!foundProduct) return next();
  
  foundProduct.images = foundProduct.images.filter(imageId => imageId.toString() !== this._id.toString());
  if (foundProduct.image.toString() === this._id.toString()) foundProduct.image = foundProduct.images[0]
  foundProduct.save();

  next();
});

module.exports = new model('Image', imageSchema);