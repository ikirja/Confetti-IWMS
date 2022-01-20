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
  connection: {
    type: String,
    required: true,
    default: 'default'
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
      },
      ozon: {
        categoryId: {
          type: Number,
          default: 0
        },
        category: {
          type: Object,
          default: {}
        },
        attributes: [
          {
            type: Object,
            default: {}
          }
        ]
      }
    }
  ],
});

module.exports = new model('Warehouse', warehouseSchema); 