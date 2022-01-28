const getCategoryTree = require('./controllers/category/get-category-tree');
const getCategoryAttribute = require('./controllers/category/get-category-attribute');
const getCategoryAttributeValues = require('./controllers/category/get-category-attribute-values');
const getConfig = require('./controllers/config/get-config');
const setConfig = require('./controllers/config/set-config');
const productImport = require('./controllers/product/import');
const productImportInfo = require('./controllers/product/import-info');
const productStocks = require('./controllers/product/stocks');
const productPrices = require('./controllers/product/prices');

module.exports = {
  getCategoryTree,
  getCategoryAttribute,
  getCategoryAttributeValues,
  getConfig,
  setConfig,
  productImport,
  productImportInfo,
  productStocks,
  productPrices
}