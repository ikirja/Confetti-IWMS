const Image = require(__basedir + '/server/models/image');
const Product = require(__basedir + '/server/models/product');
const { unlinkSync } = require('fs');
const logger = require(__basedir + '/server/lib/logger');
const imageRegistries = require('./registries.js');

module.exports = async (req, res) => {
  if (!req.body.image || typeof req.body.image !== 'string') return res.status(422).json({ error: [ { message: 'Не указано название файла изображения' } ] });
  if (!req.body.type || typeof req.body.type !== 'string') return res.status(422).json({ error: [ { message: 'Не указан тип изображения' } ] });
  if (req.body.type === 'product' && !req.body.productId) return res.status(422).json({ error: [ { message: 'Для типа изображения "Товар" обязателен параметр идентификатора товара' } ] });

  try {
    const foundImage = await Image.findOne({ file: req.body.image, type: req.body.type });
    if (!foundImage) return res.status(404).json({ error: [ { message: 'Изображение не найдено' } ] });

    let foundProduct = null;
    if (req.body.type === 'product') foundProduct = await Product.findOne({ _id: req.body.productId });
    if (req.body.type === 'product' && !foundProduct) return res.status(404).json({ error: [ { message: 'Товар не найден' } ] });

    if (!foundProduct.images.includes(foundImage._id)) return res.status(404).json({ error: [ { message: 'Image not found in this product' } ] });
    foundProduct.images.splice(foundProduct.images.indexOf(foundImage._id), 1);
    if (foundProduct.image.toString() === foundImage._id.toString()) foundProduct.image = foundProduct.images[0];

    unlinkSync(`${__basedir}/server/public/upload/${foundImage.file}.jpg`);
    unlinkSync(`${__basedir}/server/public/upload/${foundImage.file}.webp`);
    unlinkSync(`${__basedir}/server/public/upload/${foundImage.file}-mp.jpg`);
    unlinkSync(`${__basedir}/server/public/upload/${foundImage.file}-wb.jpg`);

    foundImage.remove();
    foundProduct.save();
    await imageRegistries.image('delete-image', foundImage);

    res.status(200).json(foundImage);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'I0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка удаления изображения',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Ошибка удаления изображения' } ] });
  }
}