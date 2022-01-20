const Registry = require('../../../../../../models/registry');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  try {
    const registries = await Registry.find();
    res.status(200).json(registries);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'R0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения регистров сведений',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Ошибка получения регистров сведений' } ] });
  }
}