const OrderStatus = require('../../../../../../models/order-status');
const Order = require('../../../../../../models/order');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  try {
    if (!req.body.statusId || typeof req.body.statusId !== 'string') return res.status(422).json({ error: [ { message: 'Проверьте переданный идентификатор статуса'} ] });
    
    const foundStatus = await OrderStatus.findOne({ _id: req.body.statusId });
    if (!foundStatus) return res.status(404).json({ error: [ { message: 'Статус не найден' } ] });

    const foundOrders = await Order.find({ status: foundStatus._id });
    if (foundOrders && foundOrders.length > 0) return res.status(403).json({ error: [ { message: 'Нельзя удалить статус, есть заказы с данным статусом' } ] });

    foundStatus.remove();

    res.status(200).json(foundStatus);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'OS0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка удаления статуса',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Ошибка удаления статуса'} ] });
  }
}