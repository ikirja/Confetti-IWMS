const Image = require('../../../../../../models/image');
const sharp = require('sharp');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  if (!req.body.image || !base64regex.test(req.body.image)) return res.status(422).json({ error: [ { message: 'Не удалось разобрать переданные данные' } ] });
  if (!req.body.type || typeof req.body.type !== 'string') return res.status(422).json({ error: [ { message: 'Не указан тип изображения' } ] });

  try {
    const buf = new Buffer.from(req.body.image, 'base64');
    const fileName = (new Date).getTime();

    await sharp(buf).jpeg({ quality: 80 }).toFile(`server/public/upload/${fileName}.jpg`);
    await sharp(buf).webp().toFile(`server/public/upload/${fileName}.webp`);
    await sharp(buf).resize(1200, 1500, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 }}).jpeg({ quality: 80 }).toFile(`server/public/upload/${fileName}-mp.jpg`);
    await sharp(buf).resize(1200, 1600, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 }}).jpeg({ quality: 80 }).toFile(`server/public/upload/${fileName}-wb.jpg`);

    const createdImage = await Image.create({ file: `${fileName}`, type: 'product' });
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