const cancelOrder = require('./controllers/cancel-order');
const changeProducts = require('./controllers/change-products');
const changeStatus = require('./controllers/change-status');
const createOrder = require('./controllers/create-order');
const getOrders = require('./controllers/get-orders');

module.exports = {
  cancelOrder,
  changeProducts,
  changeStatus,
  createOrder,
  getOrders
}