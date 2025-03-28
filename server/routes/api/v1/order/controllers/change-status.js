const Order = require(__basedir + '/server/models/order');
const OrderStatus = require(__basedir + '/server/models/order-status');
const logger = require(__basedir + '/server/lib/logger');
const orderRegistries = require('./registries');

module.exports = async (req, res) => {
  try {
    const foundStatus = await OrderStatus.findOne({ _id: req.body.statusId });
    if (!foundStatus) return res.status(404).json({ error: [ { message: 'Статус не найден' } ] });

    const foundOrder = await Order.findOne({ _id: req.body.orderId });
    if (!foundOrder) return res.status(404).json({ error: [ { message: 'Заказ не найден' } ] });

    foundOrder.status = foundStatus._id;
    foundOrder.save();
    await orderRegistries.order('change-status', foundOrder);

    res.status(200).json(foundOrder);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка изменения статуса заказа',
      path: __filename
    });

    return res.status(400).json({ error: [ { message: 'Ошибка изменения статуса заказа' } ] });
  }
}