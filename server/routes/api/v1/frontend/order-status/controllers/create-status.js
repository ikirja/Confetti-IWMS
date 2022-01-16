const OrderStatus = require('../../../../../../models/order-status');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  try {
    if (!req.body.title || typeof req.body.title !== 'string') return res.status(422).json({ error: [ { message: 'Проверьте переданное название статуса'} ] });
    
    const createdStatus = await OrderStatus.create(req.body);
    res.status(200).json(createdStatus);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'OS0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка создания статуса',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Ошибка создания статуса'} ] });
  }
}