const User = require('../../../../../../models/user');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  const { userId } = req.params.id;

  try {
    const foundUser = await User.findOne({ _id: logId });
    if (!foundUser) return res.status(404).json({ errors: [ { message: 'Пользователь не найден' } ] });
    res.status(200).json(foundUser);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'U0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения данных пользователя',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Ошибка получения данных пользователя' } ] });
  }
}