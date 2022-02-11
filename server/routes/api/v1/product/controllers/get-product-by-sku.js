const Product = require(__basedir + '/server/models/product');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  if (!req.body.sku || typeof req.body.sku !== 'string') return res.status(422).json({ error: [ { error: 'SKU is required' } ] });

  try {
    const foundProduct = await Product.findOne({ sku: req.body.sku });
    if (!foundProduct) return res.status(404).json({ error: [ { message: 'Product not found' } ] });

    res.status(200).json(foundProduct);
  } catch (err) {
    logger.createLog({
      title: 'Error',
      errorCode: 'P0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error product findOne',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error product findOne' } ] });
  }
}