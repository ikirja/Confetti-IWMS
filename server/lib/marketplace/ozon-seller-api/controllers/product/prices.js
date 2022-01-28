const request = require('../request');

module.exports = async function productPrices({ prices }) {
  const response = await request('/v1/product/import/prices', 'POST', { prices });
  if (response.status === 200) return response.json();
  return response;
}