const getCategoryTree = require('./controllers/category/get-category-tree');
const getCategoryAttribute = require('./controllers/category/get-category-attribute');
const getCategoryAttributeValues = require('./controllers/category/get-category-attribute-values');
const getConfig = require('./controllers/config/get-config');
const setConfig = require('./controllers/config/set-config');

module.exports = {
  getCategoryTree,
  getCategoryAttribute,
  getCategoryAttributeValues,
  getConfig,
  setConfig
}