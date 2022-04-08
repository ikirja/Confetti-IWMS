const prices = {
  info: require('./controllers/prices/info')
}

const config = {
  get: require('./controllers/config/get-config'),
  set: require('./controllers/config/set-config')
}

const warehouse = {
  list: require('./controllers/warehouse/list')
}

module.exports = {
  prices,
  config,
  warehouse
}