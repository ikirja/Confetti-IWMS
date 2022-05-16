const request = require('../request');

module.exports = async function create(payload) {
  const response = await request('/public/api/v1/prices', 'POST', payload);
  if (response.status === 200) return response.json();
  return response;
}