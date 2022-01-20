const request = require('../request');

module.exports = async function getCategoryTree() {
  const response = await request('/v1/categories/tree', 'GET');
  if (response.status === 200) return response.json();
  return response;
}