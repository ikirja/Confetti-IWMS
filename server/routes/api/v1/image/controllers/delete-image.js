const Image = require(__basedir + '/server/models/image');
const { unlinkSync } = require('fs');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  if (!req.body.image || typeof req.body.image !== 'string') return res.status(422).json({ error: [ { message: 'Не указано название файла изображения' } ] });
  if (!req.body.type || typeof req.body.type !== 'string') return res.status(422).json({ error: [ { message: 'Не указан тип изображения' } ] });

  try {
    const foundImage = await Image.findOne({ file: req.body.image, type: req.body.type });
    if (!foundImage) return res.status(404).json({ error: [ { message: 'Изображение не найдено' } ] });

    unlinkSync(`${__basedir}/server/public/upload/${foundImage.file}.jpg`);
    unlinkSync(`${__basedir}/server/public/upload/${foundImage.file}.webp`);
    unlinkSync(`${__basedir}/server/public/upload/${foundImage.file}-mp.jpg`);
    unlinkSync(`${__basedir}/server/public/upload/${foundImage.file}-wb.jpg`);

    foundImage.remove();

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