const Product = require(__basedir + '/server/models/product');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  try {
    const products = await Product.find().populate('image');
    res.status(200).json(products);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения товаров',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Произошла непредвиденная ошибка' } ] });
  }
}