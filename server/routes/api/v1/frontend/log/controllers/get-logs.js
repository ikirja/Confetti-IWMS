const Log = require('../../../../../../models/log');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  try {
    const logs = await Log.find();
    res.status(200).json(logs);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'L0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения журнала событий',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Ошибка получения журнала событий' } ] });
  }
}