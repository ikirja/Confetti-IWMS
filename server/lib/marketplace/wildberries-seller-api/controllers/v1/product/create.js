const request = require('../request');

module.exports = async function create(productPayload) {
  const response = await request('/card/create', 'POST', productPayload);
  if (response.status === 200) return response.json();
  return response;
}