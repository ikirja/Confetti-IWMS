const request = require('../request');

module.exports = async function warehouseList(task_id) {
  const response = await request('/v1/warehouse/list', 'POST', {});
  if (response.status === 200) return response.json();
  return response;
}