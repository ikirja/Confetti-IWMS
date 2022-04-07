const { writeFileSync } = require('fs');

module.exports = function setConfig(config) {
  let newConfig = {
    API_URL: config.url,
    API_KEY: config.apiKey,
    HOST: config.host
  }
  
  writeFileSync(__basedir + '/server/lib/marketplace/wildberries-seller-api/config/index.json', JSON.stringify(newConfig, null, 2));
}