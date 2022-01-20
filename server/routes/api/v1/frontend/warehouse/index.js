const getWarehouses = require('./controllers/get-warehouses');
const createWarehouse = require('./controllers/create-warehouse');
const setProductsToWarehouse = require('./controllers/set-products-to-warehouse');
const setDefaultWarehouse = require('./controllers/set-default-warehouse');
const unsetDefaultWarehouse = require('./controllers/unset-default-warehouse');
const moveFromToWarehouse = require('./controllers/move-from-to-warehouse');
const getWarehouse = require('./controllers/get-warehouse');
const setConnection = require('./controllers/set-connection');
const getConnections = require('./controllers/get-connections');

const middleware = require('./middleware')

module.exports = {
  getWarehouses,
  createWarehouse,
  setProductsToWarehouse,
  setDefaultWarehouse,
  unsetDefaultWarehouse,
  moveFromToWarehouse,
  getWarehouse,
  setConnection,
  getConnections,
  middleware
}