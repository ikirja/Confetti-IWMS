const request = require('../request');

module.exports = async function stocks(stocksPayload) {
  const response = await request('/api/v2/stocks', 'POST', stocksPayload);
  if (response.status === 200) return response.json();
  return response;
}