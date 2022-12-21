const Warehouse = require(__basedir + '/server/models/warehouse');
const { warehouse } = require(__basedir + '/server/lib/marketplace/wildberries-seller-api').v1;

module.exports = async (req, res) => {
  try {
    const wildberriesWarehouses = await warehouse.list();
    if (wildberriesWarehouses.length < 1) return res.status(404).json({ error: [ { message: 'Warehouses not found' } ] });

    res.status(200).json(wildberriesWarehouses);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'MW0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while getting warehouses from Wildberries Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while getting warehouses from Wildberries Seller API' } ] });
  }
}