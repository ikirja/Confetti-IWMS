const request = require('../request');

module.exports = async function getCategoryParent() {
  const response = await request('/api/v1/config/get/object/parent/list', 'GET');
  if (response.status === 200) return response.json();
  return response;
}