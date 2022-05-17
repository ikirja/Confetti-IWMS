const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/server/models/registry');
const { product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');
const validateProductStocks = require('./validate-product-stocks');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  if (!req.body.warehouseId) return res.status(422).json({ error: [ { message: 'Warehouse ID is required' } ] });
  if (!req.body.products || req.body.products.length === 0) return res.status(422).json({ error: [ { message: 'Products are required' } ] });

  const validated = validateProductStocks(req.body.products);
  if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse has not been found' } ] });
    if (foundWarehouse.connection !== 'wildberries-seller-api') return res.status(422).json({ error: [ { message: 'Warehouse connection is not wildberries-seller-api' } ] });
    if (foundWarehouse.connectionWarehouse.length === 0) return res.status(422).json({ error: [ { message: 'Warehouse connectionWarehouse is not set' } ] });

    let stocksUpdatePayload = [];

    validated.products.forEach(product => {
      if (!product.wildberries.productId) return;

      stocksUpdatePayload.push({
        barcode: product.product.barcode,
        stock: product.quantity,
        warehouseId: Number(foundWarehouse.connectionWarehouse)
      });
    });

    const response = await product.stocks(stocksUpdatePayload);

    const createdRegistry = await Registry.create({
      type: 'wildberries',
      title: 'stocks-update',
      fields: {
        taskId: response.id,
        status: 'done',
        warehouse: foundWarehouse._id,
        product: stocksUpdatePayload
      }
    });

    res.status(200).json(response);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'WB0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while updating stocks to Wildeberries Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while updating stocks to Wildeberries Seller API' } ] });
  }
}