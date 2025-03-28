const Warehouse = require(__basedir + '/server/models/warehouse');
const { warehouseList } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');

module.exports = async (req, res) => {
  try {
    const ozonWarehouses = await warehouseList();
    if (!ozonWarehouses.result || ozonWarehouses.result.length < 1) return res.status(404).json({ error: [ { message: 'Warehouses not found' } ] });

    res.status(200).json(ozonWarehouses.result);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'MO0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while getting warehouses from OZON Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while getting warehouses from OZON Seller API' } ] });
  }
}