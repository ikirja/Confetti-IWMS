const Product = require(__basedir + '/server/models/product');
const validateProducts = require('./validate-products.js');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  const validated = validateProducts(req.body);

  if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

  let toBeCreatedProducts = [];
  let updatedProducts = [];
  let createdProducts = [];
  let errors = [];

  for (let i = 0; i < validated.products.length; i++) {
    try {
      let foundProduct = await Product.findOne({ sku: validated.products[i].sku });

      if (foundProduct) {
        foundProduct.updatedAt = Date.now();
        validated.products[i].title ? foundProduct.title = validated.products[i].title : '';
        validated.products[i].weight ? foundProduct.weight = validated.products[i].weight : '';
        validated.products[i].dimensions ? foundProduct.dimensions = validated.products[i].dimensions : '';
        validated.products[i].barcode ? foundProduct.barcode = validated.products[i].barcode : '';
        validated.products[i].image ? foundProduct.image = validated.products[i].image : '';
        validated.products[i].images ? foundProduct.images = validated.products[i].images : '';
        validated.products[i].description ? foundProduct.description = validated.products[i].description : '';
        validated.products[i].purchasePrice ? foundProduct.purchasePrice = validated.products[i].purchasePrice : '';
        foundProduct.save();

        updatedProducts.push(validated.products[i]);
      } else {
        toBeCreatedProducts.push(validated.products[i]);
      }
    } catch (err) {
      logger.createLog({
        title: 'Ошибка',
        errorCode: 'P0002',
        data: JSON.stringify(err) ? JSON.stringify(err) : '',
        message: 'Ошибка при обновлении товара',
        path: __filename
      });

      errors.push({
        product: {
          title: req.body[i].title,
          sku: req.body[i].sku
        },
        message: 'Ошибка обновления товара'
      });
    }
  }

  try {
    createdProducts = await Product.insertMany(toBeCreatedProducts);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0003',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка при создании товаров',
      path: __filename
    });

    return res.status(400).json({ error: [ { message: 'Ошибка при создании товаров' } ] });
  }

  res.status(200).json({
    createdProducts,
    updatedProducts,
    error: errors
  });
}