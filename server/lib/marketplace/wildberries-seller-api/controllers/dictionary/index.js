const queryString = require('querystring');
const request = require('../request');

module.exports = async function getDictionary(options) {
  const { url, top, pattern } = options;
  const requestParams = queryString.stringify({ top, pattern });

  const response = await request(`/api/v1/directory${url}?${requestParams}`, 'GET');
  if (response.status === 200) return response.json();
  return response;
}