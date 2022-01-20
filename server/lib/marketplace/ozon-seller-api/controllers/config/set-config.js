const { writeFileSync } = require('fs');

module.exports = function setConfig(config) {
  let newConfig = {
    API_URL: config.url,
    API_KEY: config.apiKey,
    CLIENT_ID: config.clientId
  }
  
  writeFileSync(__basedir + '/server/lib/marketplace/ozon-seller-api/config/index.json', JSON.stringify(newConfig, null, 2));
}