const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/server/models/registry');
const { productPrices } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');
const validateProductPrices = require('./validate-product-prices');

module.exports = async (req, res) => {
  if (!req.body.warehouseId) return res.status(422).json({ error: [ { message: 'Warehouse ID is required' } ] });
  if (!req.body.products || !Array.isArray(req.body.products)) return res.status(422).json({ error: [ { message: 'Products are required' } ] });

  const validated = validateProductPrices(req.body.products);
  if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse has not been found' } ] });
    if (foundWarehouse.connection !== 'ozon-seller-api') return res.status(422).json({ error: [ { message: 'Warehouse connection is not ozon-seller-api' } ] });

    const productPricesPayload = {
      prices: []
    }

    productPricesPayload.prices = validated.products.map(product => {
      return {
        offer_id: product.ozon.offerId,
        product_id: product.ozon.productId,
        price: product.price.toString(),
        min_price: product.ozon.minPrice ? product.ozon.minPrice.toString() : product.price.toString(),
        old_price: product.ozon.oldPrice ? product.ozon.oldPrice.toString() : '0',
        premium_price: product.ozon.premiumPrice ? product.ozon.premiumPrice.toString() : '0'
      }
    });

    const response = await productPrices(productPricesPayload);

    if (response.result) {
      const createdRegistry = await Registry.create({
        type: 'ozon',
        title: 'product-prices',
        fields: {
          status: 'created',
          products: response.result
        }
      });
    }

    res.status(200).json(response.result);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while updating prices to OZON Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while updating prices to OZON Seller API' } ] });
  }
}