const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  orderId: {
    type: Number,
    required: true,
    unique: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  status: {
    type: Schema.Types.ObjectId,
    ref: 'OrderStatus',
    required: true
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  isCanceled: {
    type: Boolean,
    required: true,
    default: false
  },
  warehouse: {
    type: Schema.Types.ObjectId,
    ref: 'Warehouse',
    required: true
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
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      discount: {
        type: Schema.Types.ObjectId,
        ref: 'Discount'
      }
    }
  ]
});

module.exports = new model('Order', orderSchema);