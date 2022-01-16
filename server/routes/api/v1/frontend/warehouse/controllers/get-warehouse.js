const Warehouse = require('../../../../../../models/warehouse');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  const { warehouseId } = req.params;

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: warehouseId }).populate('products.product');
    if (!foundWarehouse) return res.status(404).json({ errors: [ { message: 'Склад не найден' } ] });
    res.status(200).json(foundWarehouse);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения склада',
      path: __filename
    });

    res.status(500).json({ errors: [ { message: 'Произошла непредвиденная ошибка' } ] });
  }
}