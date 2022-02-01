const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/server/models/registry');
const { productStocks } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');
const validateProductStocks = require('./validate-product-stocks');

module.exports = async (req, res) => {
  if (!req.body.warehouseId) return res.status(422).json({ error: [ { message: 'Warehouse ID is required' } ] });
  if (!req.body.products || !Array.isArray(req.body.products)) return res.status(422).json({ error: [ { message: 'Products are required' } ] });

  const validated = validateProductStocks(req.body.products);
  if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse has not been found' } ] });
    if (foundWarehouse.connection !== 'ozon-seller-api') return res.status(422).json({ error: [ { message: 'Warehouse connection is not ozon-seller-api' } ] });

    const productStocksPayload = {
      stocks: []
    }

    productStocksPayload.stocks = validated.products.map(product => {
      return {
        offer_id: product.ozon.offerId,
        product_id: product.ozon.productId,
        stock: product.quantity,
        warehouse_id: foundWarehouse.connectionWarehouse
      }
    });

    const response = await productStocks(productStocksPayload);

    if (response.result) {
      const createdRegistry = await Registry.create({
        type: 'ozon',
        title: 'product-stocks',
        fields: {
          status: 'created',
          products: response.result
        }
      })
    }
    
    res.status(200).json(response.result);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while updating stocks to OZON Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while updating stocks to OZON Seller API' } ] });
  }
}