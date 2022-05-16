const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/server/models/registry');
const { prices, product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');
const validateProductPrices = require('./validate-product-prices');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  if (!req.body.warehouseId) return res.status(422).json({ error: [ { message: 'Warehouse ID is required' } ] });
  if (!req.body.products || req.body.products.length === 0) return res.status(422).json({ error: [ { message: 'Products IDs are required' } ] });

  const validated = validateProductPrices(req.body.products);
  if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });
  
  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse has not been found' } ] });
    if (foundWarehouse.connection !== 'wildberries-seller-api') return res.status(422).json({ error: [ { message: 'Warehouse connection is not wildberries-seller-api' } ] });

    let pricesUpdatePayload = [];

    for (let i = 0; i < validated.products.length; i++) {
      if (!validated.products[i].wildberries.productId) continue;

      const wbProduct = await product.cardByImtId(validated.products[i].wildberries.productId);
      if (!wbProduct || !wbProduct.result || !wbProduct.result.card) continue;

      pricesUpdatePayload.push({
        nmId: wbProduct.result.card.nomenclatures[0].nmId,
        price: validated.products[i].price
      });
    }
    
    const response = await prices.update(pricesUpdatePayload);

    const createdRegistry = await Registry.create({
      type: 'wildberries',
      title: 'prices-update',
      fields: {
        taskId: response.id,
        status: 'done',
        warehouse: foundWarehouse._id,
        product: pricesUpdatePayload
      }
    });

    res.status(200).json(response);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'WB0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while updating prices to Wildeberries Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while updating prices to Wildeberries Seller API' } ] });
  }
}