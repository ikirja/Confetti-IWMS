const Image = require(__basedir + '/server/models/image');
const Product = require(__basedir + '/server/models/product');
const sharp = require('sharp');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  const base64regex = /^([0-9a-zA-Z+/]{3})*(([0-9a-zA-Z+/]{3}==)|([0-9a-zA-Z+/]{3}=))?$/;
  if (!req.body.image) return res.status(422).json({ error: [ { message: 'Не удалось разобрать переданные данные' } ] });
  if (!req.body.type || typeof req.body.type !== 'string') return res.status(422).json({ error: [ { message: 'Не указан тип изображения' } ] });
  if (req.body.type === 'product' && !req.body.productId) return res.status(422).json({ error: [ { message: 'Для типа изображения "Товар" обязателен параметр идентификатора товара' } ] });

  try {
    let foundProduct = null;
    if (req.body.type === 'product') foundProduct = await Product.findOne({ _id: req.body.productId });
    if (req.body.type === 'product' && !foundProduct) return res.status(404).json({ error: [ { message: 'Товар не найден' } ] });

    const buf = new Buffer.from(req.body.image, 'base64');
    const fileName = (new Date).getTime();

    await sharp(buf).jpeg({ quality: 80 }).toFile(`server/public/upload/${fileName}.jpg`);
    await sharp(buf).webp().toFile(`server/public/upload/${fileName}.webp`);
    await sharp(buf).resize(1200, 1500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 }}).jpeg({ quality: 80 }).toFile(`server/public/upload/${fileName}-mp.jpg`);
    await sharp(buf).resize(1200, 1600, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 }}).jpeg({ quality: 80 }).toFile(`server/public/upload/${fileName}-wb.jpg`);

    const createdImage = await Image.create({ file: `${fileName}`, type: 'product' });

    if (foundProduct) {
      foundProduct.images.push(createdImage);
      if (!foundProduct.image) foundProduct.image = createdImage;
      foundProduct.save()
    }

    await imageRegistries.image('upload-image', createdImage);
        
    res.status(200).json(createdImage);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'I0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка загрузки изображения',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Ошибка загрузки изображения' } ] });
  }
}