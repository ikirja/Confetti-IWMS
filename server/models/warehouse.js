const { Schema, model } = require('mongoose');

const warehouseSchema = new Schema({
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
  defaultWarehouse: {
    type: Boolean,
    required: true,
    default: false
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 0
      },
      price: {
        type: Number,
        required: true,
        default: 0
      },
      discount: {
        type: Schema.Types.ObjectId,
        ref: 'Discount'
      }
    }
  ]
});

module.exports = new model('Warehouse', warehouseSchema); 