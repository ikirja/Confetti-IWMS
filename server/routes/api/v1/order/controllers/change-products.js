const Order = require(__basedir + '/server/models/order');
const Warehouse = require(__basedir + '/server/models/warehouse');
const validateProductsForWarehouse = require('../../warehouse/controllers/validate-products-for-warehouse');
const logger = require(__basedir + '/server/lib/logger');
const orderRegistries = require('./registries');

module.exports = async (req, res) => {
  try {
    const foundOrder = await Order.findOne({ _id: req.body.orderId });
    if (!foundOrder) return res.status(404).json({ error: [ { message: 'Заказ не найден' } ] });

    const foundWarehouse = await Warehouse.findOne({ _id: foundOrder.warehouse });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Склад не найден' } ] });

    const validatedProducts = await validateProductsForWarehouse(req.body.products);
    if (validatedProducts.errors.length > 0) return res.status(422).json({ error: validatedProducts.errors });

    const validatedProductsIds = validatedProducts.products.map(validatedProduct => validatedProduct.product);
    foundOrder.products = foundOrder.products.filter(productInOrder => validatedProductsIds.includes(productInOrder.product.toString()));

    let changedProductsQuantity = [];

    for (let i = 0; i < validatedProducts.products.length; i++) {
      const productInOrderIndex = foundOrder.products.findIndex(productInOrder => productInOrder.product.toString() == validatedProducts.products[i].product.toString());
      
      if (productInOrderIndex == -1) {
        foundOrder.products.push(validatedProducts.products[i]);
        continue;
      }

      changedProductsQuantity.push({
        productId: validatedProducts.products[i].product,
        changedQuantity: foundOrder.products[productInOrderIndex].quantity - validatedProducts.products[i].quantity
      });

      foundOrder.products[productInOrderIndex].price = validatedProducts.products[i].price;
      foundOrder.products[productInOrderIndex].quantity = validatedProducts.products[i].quantity;
    }

    for (let i = 0; i < foundOrder.products.length; i++) {
      const productInWarehouseIndex = foundWarehouse.products.findIndex(productInWarehouse => productInWarehouse.product.toString() == foundOrder.products[i].product.toString());
      if (productInWarehouseIndex == -1) return res.status(404).json({ error: [ { message: 'На данном складе нет заказываемого товара, невозможно оформить заказ' } ] });

      const foundProductInChangedQuantity = changedProductsQuantity.find(changedProduct => changedProduct.productId.toString() == foundWarehouse.products[productInWarehouseIndex].product.toString());

      if (foundProductInChangedQuantity) {
        foundWarehouse.products[productInWarehouseIndex].quantity = foundWarehouse.products[productInWarehouseIndex].quantity + foundProductInChangedQuantity.changedQuantity;
      } else {
        foundWarehouse.products[productInWarehouseIndex].quantity = foundWarehouse.products[productInWarehouseIndex].quantity - foundOrder.products[i].quantity;
      }
    }

    foundWarehouse.save();
    foundOrder.save();
    await orderRegistries.order('change-products', foundOrder);

    res.status(200).json(foundOrder);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка изменения состава заказа',
      path: __filename
    });

    return res.status(400).json({ error: [ { message: 'Ошибка изменения состава заказа' } ] });
  }
}