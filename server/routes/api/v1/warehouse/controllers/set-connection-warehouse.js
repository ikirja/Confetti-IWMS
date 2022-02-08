const Warehouse = require(__basedir + '/server/models/warehouse');
const logger = require(__basedir + '/server/lib/logger');
const warehouseRegistries = require('./registries');

module.exports = async (req, res) => {
  if (!req.body.warehouseId || !req.body.connectionWarehouseId) return res.status(422).json({ error: [ { message: 'Check data' } ] });

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse not found' } ] });
    if (foundWarehouse.connection === 'default') return res.status(403).json({ error: [ { message: 'Connection Warehouse can not be set for Default connection' } ] });

    foundWarehouse.connectionWarehouse = req.body.connectionWarehouseId;
    foundWarehouse.save();
    await warehouseRegistries.warehouse('set-connection-warehouse', foundWarehouse);

    res.status(200).json(foundWarehouse);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error saving connection-warehouse',
      path: __filename
    });

    res.status(500).json({ errors: [ { message: 'Error saving connection-warehouse' } ] });
  }
}