const category = {
  getParent: require('./controllers/category/get-category-parent'),
  getByParent: require('./controllers/category/get-category-by-parent')
}

const config = {
  get: require('./controllers/config/get-config'),
  set: require('./controllers/config/set-config')
}

const dictionary = {
  get: require('./controllers/dictionary')
}

const prices = {
  info: require('./controllers/prices/info')
}

const warehouse = {
  list: require('./controllers/warehouse/list')
}

module.exports = {
  category,
  config,
  dictionary,
  prices,
  warehouse
}