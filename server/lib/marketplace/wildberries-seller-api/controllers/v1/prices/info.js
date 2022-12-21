const request = require('../request');

module.exports = async function info(paramsString) {
  const response = await request('/public/api/v1/info?' + paramsString, 'GET');
  if (response.status === 200) return response.json();
  return response;
}