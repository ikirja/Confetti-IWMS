const fetch = require('node-fetch');
const config = require('../config');

module.exports = function request(url, method, body) {
  let options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Client-Id': config.CLIENT_ID,
      'Api-Key': config.API_KEY
    }
  }

  if (body) options.body = JSON.stringify(body);

  return fetch(config.API_URL + url, options);
}