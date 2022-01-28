const Registry = require(__basedir + '/server/models/registry');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  const { registryId } = req.params.id;

  try {
    const foundRegistry = await Registry.findOne({ _id: registryId });
    if (!foundRegistry) return res.status(404).json({ errors: [ { message: 'Регистр не найден' } ] });
    res.status(200).json(foundRegistry);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'R0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения регистра сведений',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Ошибка получения регистра сведений' } ] });
  }
}