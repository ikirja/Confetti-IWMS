const Product = require(__basedir + '/server/models/product');
const Image = require(__basedir + '/server/models/image');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  if (!req.body.productId || typeof req.body.productId !== 'string') return res.status(422).json({ error: [ { message: 'Не передан идентификатор товара' } ] });
  if (!req.body.imageId || typeof req.body.imageId !== 'string') return res.status(422).json({ error: [ { message: 'Не передан идентификатор изображения' } ] });

  try {
    const foundImage = await Image.findOne({ _id: req.body.imageId });
    if (!foundImage) return res.status(404).json({ error: [ { message: 'Изображение не найдено' } ] });

    const foundProduct = await Product.findOne({ _id: req.body.productId });
    if (!foundProduct) return res.status(404).json({ error: [ { message: 'Товар не найден' } ] });
    if (!foundProduct.images.includes(foundImage._id)) return res.status(404).json({ error: [ { message: 'Изображение не привязано к данному товару' } ] });

    foundProduct.image = foundImage;
    await foundProduct.save();

    res.status(200).json(foundProduct);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0004',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка при изменении главного изображения товара',
      path: __filename
    });

    return res.status(400).json({ error: [ { message: 'Ошибка при изменении главного изображения товара' } ] });
  }
}