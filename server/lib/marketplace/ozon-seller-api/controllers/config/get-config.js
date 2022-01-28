module.exports = function getConfig() {
  let config = require('../../config/index.json');
  config = {
    url: config.API_URL,
    clientId: config.CLIENT_ID,
    apiKey: config.API_KEY,
    host: config.HOST
  }

  return config;
}