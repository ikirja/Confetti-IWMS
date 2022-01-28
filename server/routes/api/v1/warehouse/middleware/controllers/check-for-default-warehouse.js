const Warehouse = require(__basedir + '/server/models/warehouse');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res, next) => {
  try {
    const foundDefaultWarehouse = await Warehouse.findOne({ defaultWarehouse: true });
    if (foundDefaultWarehouse) return res.status(400).json({ errors: [ { message: 'Основной склад может быть только один' } ] });
    next();
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0007',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения склада',
      path: __filename
    });

    res.status(500).json({ errors: [ { message: 'Произошла непредвиденная ошибка' } ] });
  }
}