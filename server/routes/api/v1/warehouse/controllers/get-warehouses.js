const Warehouse = require(__basedir + '/server/models/warehouse');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.status(200).json(warehouses);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0003',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения складов',
      path: __filename
    });

    res.status(500).json({ errors: [ { message: 'Произошла непредвиденная ошибка' } ] });
  }
}