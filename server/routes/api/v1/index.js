// Controllers
const authController = require('./auth');
const customerController = require('./customer');
const imageController = require('./image');
const logController = require('./log');
const orderController = require('./order');
const productController = require('./product');
const registryController = require('./registry');
const userController = require('./user');
const warehouseController = require('./warehouse');
const orderStatusController = require('./order-status');

// Marketplace Controllers
const marketplace = require('./marketplace');

module.exports = {
  authController,
  customerController,
  imageController,
  logController,
  orderController,
  productController,
  registryController,
  userController,
  warehouseController,
  orderStatusController,
  marketplace
}