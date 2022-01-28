const Order = require(__basedir + '/server/models/order');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения заказов',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Ошибка получения заказов'} ] });
  }
}