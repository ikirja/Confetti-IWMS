const request = require('../request');

module.exports = async function productImport(productsPayload) {
  const response = await request('/v2/product/import', 'POST', productsPayload);
  if (response.status === 200) return response.json();
  return response;
}