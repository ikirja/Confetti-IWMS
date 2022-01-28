const Order = require(__basedir + '/server/models/order');
const Warehouse = require(__basedir + '/server/models/warehouse');
const validateOrder = require('./validate-order');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  let order;

  try {
    const validated = await validateOrder(req.body);
    if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });
    order = validated.order;
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка проверки данных заказа',
      path: __filename
    });

    return res.status(400).json({ error: [ { message: 'Ошибка проверки данных заказа' } ] });
  }

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: order.warehouse });

    for (let i = 0; i < order.products.length; i++) {
      const productInWarehouseIndex = foundWarehouse.products.findIndex(productInWarehouse => productInWarehouse.product.toString() == order.products[i].product.toString());
      if (productInWarehouseIndex == -1) return res.status(404).json({ error: [ { message: 'На данном складе нет заказываемого товара, невозможно оформить заказ' } ] });

      foundWarehouse.products[productInWarehouseIndex].quantity = foundWarehouse.products[productInWarehouseIndex].quantity - order.products[i].quantity;
    }

    foundWarehouse.save();

    const createdOrder = await Order.create(order);
    res.status(200).json(createdOrder);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка создания заказа',
      path: __filename
    });

    return res.status(400).json({ error: [ { message: 'Ошибка создания заказа' } ] });
  }
}