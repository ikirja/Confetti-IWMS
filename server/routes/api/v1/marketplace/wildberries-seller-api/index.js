const v1 = {
  category: {
    getParent: require('./controllers/v1/category/get-category-parent'),
    getByParent: require('./controllers/v1/category/get-category-by-parent')
  },
  config: {
    get: require('./controllers/v1/config/get-config'),
    set: require('./controllers/v1/config/set-config')
  },
  dictionary: {
    get: require('./controllers/v1/dictionary')
  },
  prices: {
    info: require('./controllers/v1/prices/info'),
    update: require('./controllers/v1/prices/update')
  },
  product: {
    create: require('./controllers/v1/product/create'),
    list: require('./controllers/v1/product/list'),
    setImtId: require('./controllers/v1/product/set-imt-id'),
    stocks: require('./controllers/v1/product/stocks'),
    update: require('./controllers/v1/product/update')
  },
  warehouse: {
    list: require('./controllers/v1/warehouse/list')
  }
}

const v2 = {
  category: {
    getCategories: require('./controllers/v2/category/get-categories')
  }
}

module.exports = {
  v1,
  v2
}