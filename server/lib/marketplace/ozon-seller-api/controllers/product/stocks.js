const request = require('../request');

module.exports = async function productStocks({ stocks }) {
  const response = await request('/v2/products/stocks', 'POST', { stocks });
  if (response.status === 200) return response.json();
  return response;
}