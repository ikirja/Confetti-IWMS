const Order = require(__basedir + '/server/models/order');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  try {
    const foundOrder = await Order.findOne({ _id: req.params.id }).populate('customer').populate('status').populate('warehouse').populate('products.product');
    if (!foundOrder) return res.status(404).json({ error: [ { message: 'Order not found' } ] });

    res.status(200).json(foundOrder);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения заказа',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Get Order error'} ] });
  }
}