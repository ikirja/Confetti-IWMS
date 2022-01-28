const Order = require(__basedir + '/server/models/order');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  try {
    const foundOrder = await Order.findOne({ _id: req.body.orderId });
    if (!foundOrder) return res.status(404).json({ error: [ { message: 'Заказ не найден' } ] });

    foundOrder.isCanceled = !foundOrder.isCanceled;
    foundOrder.save();

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