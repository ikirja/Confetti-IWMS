const request = require('../request');

module.exports = async function update(productPayload) {
  const response = await request('/card/update', 'POST', productPayload);
  if (response.status === 200) return response.json();
  return response;
}