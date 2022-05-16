const request = require('../request');

module.exports = async function list(queryPayload) {
  const response = await request('/card/list', 'POST', queryPayload);
  if (response.status === 200) return response.json();
  return response;
}