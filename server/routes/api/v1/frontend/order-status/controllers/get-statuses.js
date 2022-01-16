const OrderStatus = require('../../../../../../models/order-status');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  try {
    const statuses = await OrderStatus.find();
    res.status(200).json(statuses);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'OS0003',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения статусов',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Ошибка получения статусов'} ] });
  }
}