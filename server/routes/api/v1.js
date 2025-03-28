const { Router } = require('express');
const router = Router();

// Controllers
const {
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
} = require('./v1/index.js');

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
router.post('/product/archive', authController.middleware.isAdmin, productController.archive);
router.post('/product/set-main-image', authController.middleware.isAdmin, productController.setProductMainImage);
router.post('/product/sku', authController.middleware.isAdmin, productController.getProductBySku);
router.get('/product/:id', authController.middleware.isAdmin, productController.getProduct);

// WAREHOUSE
router.get('/warehouse', authController.middleware.isAdmin, warehouseController.getWarehouses);
router.post('/warehouse', authController.middleware.isAdmin, warehouseController.createWarehouse);
router.post('/warehouse/product', authController.middleware.isAdmin, warehouseController.setProductsToWarehouse);
router.post('/warehouse/set-default', authController.middleware.isAdmin, warehouseController.middleware.checkForDefaultWarehouse, warehouseController.setDefaultWarehouse);
router.post('/warehouse/unset-default', authController.middleware.isAdmin, warehouseController.unsetDefaultWarehouse);
router.post('/warehouse/move', authController.middleware.isAdmin, warehouseController.moveFromToWarehouse);
router.get('/warehouse/connection', authController.middleware.isAdmin, warehouseController.getConnections);
router.post('/warehouse/connection', authController.middleware.isAdmin, warehouseController.setConnection);
router.post('/warehouse/connection-warehouse', authController.middleware.isAdmin, warehouseController.setConnectionWarehouse);
router.get('/warehouse/:warehouseId', authController.middleware.isAdmin, warehouseController.getWarehouse);

// ORDERS
router.post('/order', authController.middleware.isAdmin, orderController.createOrder);
router.get('/order', authController.middleware.isAdmin, orderController.getOrders);
router.get('/order/:id', authController.middleware.isAdmin, orderController.getOrder);
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

// REGISTRIES
router.get('/registry', authController.middleware.isAdmin, registryController.getRegistries);
router.get('/registry/:id', authController.middleware.isAdmin, registryController.getRegistry);

// LOGS
router.get('/log', authController.middleware.isAdmin, logController.getLogs);
router.get('/log/:id', authController.middleware.isAdmin, logController.getLog);

// USERS
router.get('/user', authController.middleware.isAdmin, userController.getUsers);
router.get('/user/:id', authController.middleware.isAdmin, userController.getUser);
router.post('/user', authController.middleware.isAdmin, userController.setUserAdmin);

// IMAGES
router.post('/image', authController.middleware.isAdmin, imageController.uploadImage);
router.post('/image/delete', authController.middleware.isAdmin, imageController.deleteImage);

// MARKETPLACE
// Ozon Seller Api
router.get('/marketplace/ozon/get-category-tree', authController.middleware.isAdmin, marketplace.ozonSellerApi.getCategoryTree);
router.post('/marketplace/ozon/get-category-attribute', authController.middleware.isAdmin, marketplace.ozonSellerApi.getCategoryAttribute);
router.post('/marketplace/ozon/get-category-attribute-values', authController.middleware.isAdmin, marketplace.ozonSellerApi.getCategoryAttributeValues);
router.get('/marketplace/ozon/get-config', authController.middleware.isAdmin, marketplace.ozonSellerApi.getConfig);
router.post('/marketplace/ozon/set-config', authController.middleware.isAdmin, marketplace.ozonSellerApi.setConfig);
router.post('/marketplace/ozon/product-import', authController.middleware.isAdmin, marketplace.ozonSellerApi.productImport);
router.post('/marketplace/ozon/product-import-info', authController.middleware.isAdmin, marketplace.ozonSellerApi.productImportInfo);
router.post('/marketplace/ozon/product-stocks', authController.middleware.isAdmin, marketplace.ozonSellerApi.productStocks);
router.post('/marketplace/ozon/product-prices', authController.middleware.isAdmin, marketplace.ozonSellerApi.productPrices);
router.post('/marketplace/ozon/warehouse-list', authController.middleware.isAdmin, marketplace.ozonSellerApi.warehouseList);

// Wildberries Seller Api V1
router.get('/marketplace/wildberries/v1/get-category-parent', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.category.getParent);
router.post('/marketplace/wildberries/v1/get-category-by-parent', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.category.getByParent);
router.get('/marketplace/wildberries/v1/get-config', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.config.get);
router.post('/marketplace/wildberries/v1/set-config', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.config.set);
router.post('/marketplace/wildberries/v1/dictionary', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.dictionary.get);
router.get('/marketplace/wildberries/v1/prices/info', marketplace.wildberriesSellerApi.v1.prices.info);
router.post('/marketplace/wildberries/v1/prices/update', marketplace.wildberriesSellerApi.v1.prices.update);
router.post('/marketplace/wildberries/v1/product/create', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.product.create);
router.post('/marketplace/wildberries/v1/product/list', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.product.list);
router.post('/marketplace/wildberries/v1/product/set-imt-id', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.product.setImtId);
router.post('/marketplace/wildberries/v1/product/stocks', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.product.stocks);
router.post('/marketplace/wildberries/v1/product/update', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.product.update);
router.post('/marketplace/wildberries/v1/warehouse-list', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v1.warehouse.list);

// Wildberries Seller Api V2
router.get('/marketplace/wildberries/v2/category/get-categories', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v2.category.getCategories);
router.post('/marketplace/wildberries/v2/characteristics/get-characteristics-by-category', authController.middleware.isAdmin, marketplace.wildberriesSellerApi.v2.characteristics.getCharacteristicsByCategory);

module.exports = router;