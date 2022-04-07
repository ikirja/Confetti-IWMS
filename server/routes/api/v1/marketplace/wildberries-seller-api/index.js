const prices = {
  info: require('./controllers/prices/info')
}

const config = {
  get: require('./controllers/config/get-config'),
  set: require('./controllers/config/set-config')
}

module.exports = {
  prices,
  config
}