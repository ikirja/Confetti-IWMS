const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtSecret = require('./jwt-secret');

module.exports = async (req, res) => {
  passport.authenticate('local', { session: false })(req, res, () => {
    const token = jwt.sign(req.user.toObject(), jwtSecret, { expiresIn: 604800 });

    res.status(200).json({ accessToken: token });
  });
}