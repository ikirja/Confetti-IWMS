const Warehouse = require(__basedir + '/server/models/warehouse');
const { warehouseList } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');
const { getConfig } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');

module.exports = async (req, res) => {
  const config = getConfig();

  try {
    const ozonWarehouses = await warehouseList();
    res.status(200).json(ozonWarehouses);
  } catch (err) {
    console.log(err)
    res.status(400).json({ error: [ { message: 'Error has occured while getting warehouses from OZON Seller API' } ] });
  }
}