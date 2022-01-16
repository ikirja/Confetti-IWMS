const Product = require('../../../../../../models/product');
const logger = require('../../../../../../logger');

module.exports = async (products) => {
  const validated = {
    products: [],
    errors: []
  }

  for (let i = 0; i < products.length; i++) {
    let validatedProduct = true;
    let foundProduct;

    try {
      foundProduct = await Product.findOne({ _id: products[i].product });
    } catch (err) {
      logger.createLog({
        title: 'Ошибка',
        errorCode: 'W0007',
        data: JSON.stringify(err) ? JSON.stringify(err) : '',
        message: 'Ошибка получения товара',
        path: __filename
      });
      continue;
    }

    if (typeof products[i].product === 'object') {
      validated.errors.push({ code: 1, message: 'Передан объект вместо идентификатора товара в ключе product', product: products[i] });
      validatedProduct = false;
    }

    if (!foundProduct) {
      validated.errors.push({ code: 2, message: 'Товар не найден', product: products[i] });
      validatedProduct = false;
    }

    if (!products[i].price) {
      validated.errors.push({ code: 3, message: 'Цена товара', product: products[i] });
      validatedProduct = false;
    }

    if (!products[i].quantity) {
      validated.errors.push({ code: 4, message: 'Необходимо передавать количество товара', product: products[i] });
      validatedProduct = false;
    }

    if (validatedProduct) validated.products.push(products[i]);
  }
  
  return validated;
}