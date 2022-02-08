const Warehouse = require(__basedir + '/server/models/warehouse');
const { getConnections } = require('../../marketplace').connection;
const logger = require(__basedir + '/server/lib/logger');
const warehouseRegistries = require('./registries');

module.exports = async (req, res) => {
  if (!req.body.warehouseId || !req.body.connection) return res.status(422).json({ error: [ { message: 'Проверьте переданные данные' } ] });

  const connections = getConnections();
  if (!connections.includes(req.body.connection)) return res.status(404).json({ error: [ { message: 'Связь не найдена'} ] });

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Склад не найден' } ] });

    foundWarehouse.connection = req.body.connection;
    foundWarehouse.save();
    await warehouseRegistries.warehouse('set-connection', foundWarehouse);

    res.status(200).json(foundWarehouse);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка создания связи для склада',
      path: __filename
    });

    res.status(500).json({ errors: [ { message: 'Ошибка создания связи для склада' } ] });
  }
}