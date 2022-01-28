const logger = require(__basedir + '/server/lib/logger');

function clearMarketplaceData(products) {
  const validated = {
    products: [],
    errors: []
  }

  validated.products = products.map(product => {
    let clearedProduct = {
      product: product.product,
      quantity: product.quantity,
      price: product.price
    }

    product.discount ? clearedProduct.discount = product.discount : '';
    
    return clearedProduct;
  });

  return validated;
}

function ozonValidation(products) {
  const validated = {
    products: [],
    errors: []
  }

  products.forEach(product => {
    let validatedProduct = true;

    if (!product.ozon?.categoryId || typeof product.ozon?.categoryId !== 'number') {
      validated.errors.push({ code: 1, message: 'OZON Seller API: Не передана категория товара или категория не является числом', product });
      validatedProduct = false;
    }

    if (!product.ozon?.category || typeof product.ozon?.category !== 'object') {
      validated.errors.push({ code: 2, message: 'OZON Seller API: Не передан объект категории товара или данные не являются объектом', product });
      validatedProduct = false;
    }

    if (!product.ozon?.attributes || !Array.isArray(product.ozon?.attributes)) {
      validated.errors.push({ code: 3, message: 'OZON Seller API: Не переданы характеристики товаров или данные не являются массивом', product });
      validatedProduct = false;
    }

    if (validatedProduct) validated.products.push(product);
  });

  return validated;
}

module.exports = (products, warehouseConnection) => {
  if (!warehouseConnection || warehouseConnection === 'default') return clearMarketplaceData(products);
  if (warehouseConnection === 'ozon-seller-api') return ozonValidation(products);
}