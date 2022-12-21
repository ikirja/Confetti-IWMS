const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/server/models/registry');
const { product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api').v1;
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  if (!req.body.warehouseId) return res.status(422).json({ error: [ { message: 'Warehouse ID is required' } ] });
  if (!req.body.wbProducts || req.body.wbProducts.length === 0) return res.status(422).json({ error: [ { message: 'wbProducts are required' } ] });

  const WarehouseID = req.body.warehouseId;
  const wbProducts = req.body.wbProducts;

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: WarehouseID }).populate({
      path: 'products.product'
    });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse has not been found' } ] });

    const productsInWarehouse = foundWarehouse.products;

    wbProducts.forEach(wbProduct => {
      const foundProductInWarehouse = productsInWarehouse.find(productInWarehouse => productInWarehouse.product.sku === wbProduct.supplierVendorCode);
      if (foundProductInWarehouse) foundProductInWarehouse.wildberries.productId = wbProduct.imtId;
    });

    foundWarehouse.save();

    const createdRegistry = await Registry.create({
      type: 'wildberries',
      title: 'product-set-imt-id',
      fields: {
        status: 'done',
        warehouse: foundWarehouse._id,
        products: productsInWarehouse
      }
    });

    res.status(200).json(foundWarehouse);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'WB0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while setting ImtID products from Wildberries Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while setting ImtID products from Wildberries Seller API' } ] });
  }
}