const Warehouse = require('../../../../../../models/warehouse');
const validateProductsForWarehouse = require('./validate-products-for-warehouse');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  // NEED TO VALIDATE PRODUCTS! AFTER GOOGLE SHEETS INTEGRATION!!
  let addedProducts = [];
  let updatedProducts = [];
  let errors = [];

  try {
    let foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Склад не найден' } ] });
    if (!req.body.products || req.body.products.length === 0) return res.status(422).json({ errors: [ { message: 'Товары отсутствуют' } ] });

    const validated = await validateProductsForWarehouse(req.body.products);

    if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

    validated.products.forEach(product => {
      const index = foundWarehouse.products.findIndex(productInWarehouse => productInWarehouse.product.toString() == product.product.toString());

      if (index == -1) {
        foundWarehouse.products.push(product);
        addedProducts.push(product);
      } else {
        foundWarehouse.products[index].price = product.price;
        product.quantity ? foundWarehouse.products[index].quantity = foundWarehouse.products[index].quantity + product.quantity : '';
        product.discount ? foundWarehouse.products[index].discount = product.discount : '';
        
        updatedProducts.push(product);
      }
    });

    foundWarehouse.save();
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0005',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка добавления и/или обновления товара на складе',
      path: __filename
    });

    return res.status(400).json({ error: [ { message: 'Ошибка добавления и/или обновления товара на складе' } ] });
  }

  res.status(200).json({
    addedProducts,
    updatedProducts,
    error: errors
  });
}