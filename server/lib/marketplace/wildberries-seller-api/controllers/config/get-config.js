module.exports = function getConfig() {
  let config = require('../../config/index.json');
  config = {
    url: config.API_URL,
    apiKey: config.API_KEY,
    host: config.HOST
  }

  return config;
}