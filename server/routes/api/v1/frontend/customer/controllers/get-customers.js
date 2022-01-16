const Customer = require('../../../../../../models/customer');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'C0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения клиентов',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Ошибка получения клиентов'} ] });
  }
}