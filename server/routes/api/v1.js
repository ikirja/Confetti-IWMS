const { Router } = require('express');
const router = Router();

// Controllers
const {
  authController,
  customerController,
  orderController,
  productController,
  warehouseController,
  orderStatusController
} = require('./v1/frontend');

//**************
// API V1 ROUTES
// FRONTEND
//**************
// AUTH
router.post('/auth/login', authController.authenticate);
router.post('/auth/register', authController.register);

// PRODUCT
router.get('/product', authController.middleware.isAdmin, productController.getProducts);
// Товары обновляем по _id, а не SKU. По SKU ищем в БД из гугл таблицы перед добавлением
router.post('/product', authController.middleware.isAdmin, productController.setProducts);

// WAREHOUSE
router.get('/warehouse', authController.middleware.isAdmin, warehouseController.getWarehouses);
router.post('/warehouse', authController.middleware.isAdmin, warehouseController.createWarehouse);
router.post('/warehouse/product', authController.middleware.isAdmin, warehouseController.setProductsToWarehouse);
router.post('/warehouse/set-default', authController.middleware.isAdmin, warehouseController.middleware.checkForDefaultWarehouse, warehouseController.setDefaultWarehouse);
router.post('/warehouse/unset-default', authController.middleware.isAdmin, warehouseController.unsetDefaultWarehouse);
router.post('/warehouse/move', authController.middleware.isAdmin, warehouseController.moveFromToWarehouse);
router.get('/warehouse/:warehouseId', authController.middleware.isAdmin, warehouseController.getWarehouse);

// ORDERS
router.post('/order', authController.middleware.isAdmin, orderController.createOrder);
router.get('/order', authController.middleware.isAdmin, orderController.getOrders);
router.post('/order/status', authController.middleware.isAdmin, orderController.changeStatus);
router.post('/order/product', authController.middleware.isAdmin, orderController.changeProducts);
router.post('/order/cancel', authController.middleware.isAdmin, orderController.cancelOrder);

// ORDER STATUSES
router.post('/order-status/create', authController.middleware.isAdmin, orderStatusController.createStatus);
router.post('/order-status/delete', authController.middleware.isAdmin, orderStatusController.deleteStatus);
router.get('/order-status', authController.middleware.isAdmin, orderStatusController.getStatuses);

// CUSTOMERS
router.get('/customer', authController.middleware.isAdmin, customerController.getCustomers);
router.post('/customer', authController.middleware.isAdmin, customerController.setCustomer);

module.exports = router;