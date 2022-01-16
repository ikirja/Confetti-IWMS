const User = require('../../../../../../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const validateUser = require('./validate-user');
const jwtSecret = require('./jwt-secret');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  const { user, password, errors } = validateUser(req.body);
  if (errors.length > 0 || !password) return res.status(422).json({ error: errors });

  const newUser = new User(user);

  User.register(newUser, password, (err, user) => {
    if (err) {
      logger.createLog({
        title: 'Ошибка',
        errorCode: 'A0001',
        data: JSON.stringify(err) ? JSON.stringify(err) : '',
        message: 'Ошибка регистрации пользователя',
        path: __filename
      });

      return res.status(400).json({ error: [ { message: 'Ошибка регистрации пользователя' } ] });
    }

    passport.authenticate('local', { session: false })(req, res, () => {
      const token = jwt.sign(req.user.toObject(), jwtSecret, { expiresIn: 603800 });

      res.status(200).json({ accessToken: token });
    });
  });
}