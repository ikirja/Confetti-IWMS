const Registry = require(__basedir + '/server/models/registry');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  try {
    const currentDate = new Date();
 
    const registries = await Registry.find({ createdAt: { $gte: currentDate.setDate(currentDate.getDate() - 30) }}).sort('-createdAt');
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