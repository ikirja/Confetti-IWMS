const prices = {
  info: require('./controllers/prices/info')
}

const product = {
  create: require('./controllers/product/create')
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
  product,
  config,
  warehouse
}