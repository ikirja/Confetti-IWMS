const request = require('../request');

module.exports = async function warehouseList() {
  const response = await request('/api/v2/warehouses', 'GET');
  if (response.status === 200) return response.json();
  return response;
}