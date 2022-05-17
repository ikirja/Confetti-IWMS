const archive = require('./controllers/archive');
const getProduct = require('./controllers/get-product');
const getProductBySku = require('./controllers/get-product-by-sku');
const getProducts = require('./controllers/get-products');
const setProducts = require('./controllers/set-products');
const setProductMainImage = require('./controllers/set-product-main-image');

module.exports = {
  archive,
  getProduct,
  getProductBySku,
  getProducts,
  setProducts,
  setProductMainImage
}