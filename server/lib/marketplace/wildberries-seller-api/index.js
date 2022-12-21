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
    cardByImtId: require('./controllers/v1/product/card-by-imt-id'),
    create: require('./controllers/v1/product/create'),
    list: require('./controllers/v1/product/list'),
    photo: require('./controllers/v1/product/photo'),
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