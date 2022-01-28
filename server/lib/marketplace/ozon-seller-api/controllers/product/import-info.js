const request = require('../request');

module.exports = async function productImportInfo(task_id) {
  const response = await request('/v1/product/import/info', 'POST', { task_id: task_id.toString() });
  if (response.status === 200) return response.json();
  return response;
}