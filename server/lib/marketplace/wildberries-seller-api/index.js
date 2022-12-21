const category = {
  getParent: require('./controllers/v1/category/get-category-parent'),
  getByParent: require('./controllers/v1/category/get-category-by-parent')
}

const config = {
  get: require('./controllers/v1/config/get-config'),
  set: require('./controllers/v1/config/set-config')
}

const dictionary = {
  get: require('./controllers/v1/dictionary')
}

const prices = {
  info: require('./controllers/v1/prices/info'),
  update: require('./controllers/v1/prices/update')
}

const product = {
  cardByImtId: require('./controllers/v1/product/card-by-imt-id'),
  create: require('./controllers/v1/product/create'),
  list: require('./controllers/v1/product/list'),
  photo: require('./controllers/v1/product/photo'),
  stocks: require('./controllers/v1/product/stocks'),
  update: require('./controllers/v1/product/update')
}

const warehouse = {
  list: require('./controllers/v1/warehouse/list')
}

module.exports = {
  category,
  config,
  dictionary,
  prices,
  product,
  warehouse
}