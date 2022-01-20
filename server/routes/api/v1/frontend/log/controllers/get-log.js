const Log = require('../../../../../../models/log');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  const { logId } = req.params.id;

  try {
    const foundLog = await Log.findOne({ _id: logId });
    if (!foundLog) return res.status(404).json({ errors: [ { message: 'Событие не найдено' } ] });
    res.status(200).json(foundLog);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'L0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения сведения журнала',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Ошибка получения сведения журнала' } ] });
  }
}