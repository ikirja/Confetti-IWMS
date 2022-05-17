const Product = require(__basedir + '/server/models/product');
const Warehouse = require(__basedir + '/server/models/warehouse');
const logger = require(__basedir + '/server/lib/logger');
const productRegistries = require('./registries');

module.exports = async (req, res) => {
  if (!req.body.productId || req.body.productId.length === 0) return res.status(422).json({ error: [ { message: 'Product ID is required' } ] });

  try {
    const foundProduct = await Product.findOne({ _id: req.body.productId });
    if (!foundProduct) return res.status(404).json({ error: [ { message: 'Product not found' } ] });

    const warehouses = await Warehouse.find();

    let allProductsInWarehouses = [];

    warehouses.forEach(warehouse => allProductsInWarehouses = [ ...allProductsInWarehouses, ...warehouse.products ]);

    const productIsInWarehouse = allProductsInWarehouses.some(product => product._id.toString() === foundProduct._id.toString());
    if (productIsInWarehouse) return res.status(403).json({ error: [ { message: 'Product can not be archived since it was placed in warehouse' } ] });

    foundProduct.archived = true;
    foundProduct.save();

    res.status(200).json(foundProduct);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0003',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error while archiving product',
      path: __filename
    });

    return res.status(400).json({ error: [ { message: 'Error while archiving product' } ] });
  }
}