// Controllers
const authController = require('./auth');
const customerController = require('./customer');
const orderController = require('./order');
const productController = require('./product');
const warehouseController = require('./warehouse');
const orderStatusController = require('./order-status');

module.exports = {
  authController,
  customerController,
  orderController,
  productController,
  warehouseController,
  orderStatusController
}