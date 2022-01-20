const User = require('../../../../../../models/user');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'U0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения пользователей',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Ошибка получения пользователей' } ] });
  }
}