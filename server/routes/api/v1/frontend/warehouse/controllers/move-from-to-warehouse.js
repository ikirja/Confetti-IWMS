const Warehouse = require('../../../../../../models/warehouse');
const validateProductsForWarehouse = require('./validate-products-for-warehouse');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  let addedProducts = [];
  let updatedProducts = [];
  let errors = [];

  const fromWarehouseId = req.body.fromWarehouseId;
  const toWarehouseId = req.body.toWarehouseId;

  if (!fromWarehouseId || !toWarehouseId) return res.status(422).json({ error: [ { message: 'Не найдены идентификаторы складов' } ] });
  if (fromWarehouseId == toWarehouseId) return res.status(400).json({ error: [ { message: 'Невозможно переместить товар на тот же склад, с которого происходит перемещение' } ] });

  try {
    let foundWarehouseFrom = await Warehouse.findOne({ _id: fromWarehouseId });
    let foundWarehouseTo = await Warehouse.findOne({ _id: toWarehouseId });

    if (!foundWarehouseFrom || !foundWarehouseTo) return res.status(404).json({ error: [ { message: 'Склад/ы не найдены' } ] });

    const validated = await validateProductsForWarehouse(req.body.products);

    if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });
    
    validated.products.forEach(product => {
      const indexInFoundWarehouseFrom = foundWarehouseFrom.products.findIndex(productInWarehouse => productInWarehouse.product.toString() == product.product.toString());
      const indexInFoundWarehouseTo = foundWarehouseTo.products.findIndex(productInWarehouse => productInWarehouse.product.toString() == product.product.toString());

      if (indexInFoundWarehouseFrom == -1) {
        errors.push({
          message: 'Товар не найден на складе, откуда требуется перемещение',
          product
        });
      } else {
        const quantityInWarehouseFrom = foundWarehouseFrom.products[indexInFoundWarehouseFrom].quantity;
        const quantityToMove = product.quantity;

        if (quantityInWarehouseFrom < quantityToMove) {
          errors.push({
            message: 'Товара на складе меньше чем перемещаемое количество, товар не будет перемещен',
            product
          });
        }
        
        if (quantityInWarehouseFrom >= quantityToMove) {
          foundWarehouseFrom.products[indexInFoundWarehouseFrom].quantity = foundWarehouseFrom.products[indexInFoundWarehouseFrom].quantity - product.quantity;

          if (indexInFoundWarehouseTo == -1) {
            foundWarehouseTo.products.push(product);
            addedProducts.push(product);
          } else {
            foundWarehouseTo.products[indexInFoundWarehouseTo].price = product.price;
            product.quantity ? foundWarehouseTo.products[indexInFoundWarehouseTo].quantity = foundWarehouseTo.products[indexInFoundWarehouseTo].quantity + product.quantity : '';
            product.discount ? foundWarehouseTo.products[indexInFoundWarehouseTo].discount = product.discount : '';

            updatedProducts.push(product);
          }
        }
      }
    });

    foundWarehouseFrom.save();
    foundWarehouseTo.save();
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0005',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка перемещения товаров между складами',
      path: __filename
    });

    return res.status(400).json({ errors: [ { message: 'Ошибка перемещения товаров между складами' } ] });
  }

  res.status(200).json({
    addedProducts,
    updatedProducts,
    errors
  });
}