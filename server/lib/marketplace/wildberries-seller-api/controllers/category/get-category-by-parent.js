const request = require('../request');

module.exports = async function getCategoryParent(parent) {
  const response = await request(`/api/v1/config/object/byparent?parent=${parent}`, 'GET');
  if (response.status === 200) return response.json();
  return response;
}