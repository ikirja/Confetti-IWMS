const request = require('../request');

module.exports = async function getUnfulfilledOrders(options) {
  const response = await request('/v3/posting/fbs/unfulfilled/list', 'POST', options);
  if (response.status === 200) return response.json();
  return response;
}