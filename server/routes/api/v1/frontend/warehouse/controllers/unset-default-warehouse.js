const Warehouse = require('../../../../../../models/warehouse');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId });
    if (!foundWarehouse) return res.status(404).json({ errors: [ { message: 'Склад не найден' } ] });

    foundWarehouse.defaultWarehouse = false;
    foundWarehouse.save();
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0006',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения склада',
      path: __filename
    });

    return res.status(500).json({ errors: [ { message: 'Произошла непредвиденная ошибка' } ] });
  }

  res.status(200).json({ warehouseId: req.body.warehouseId });
}