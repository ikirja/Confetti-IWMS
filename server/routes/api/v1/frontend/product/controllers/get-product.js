const Product = require('../../../../../../models/product');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const foundProduct = await Product.findOne({ _id: id }).populate('image').populate('images');
    if (!foundProduct) return res.status(404).json({ error: [ { message: 'Товар не найден' } ] });

    res.status(200).json(foundProduct);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения товара',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Ошибка получения товара' } ] });
  }
}