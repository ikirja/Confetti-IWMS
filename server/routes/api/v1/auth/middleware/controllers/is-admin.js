const User = require(__basedir + '/server/models/user');
const passport = require('passport');

module.exports = async (req, res, next) => {
  passport.authenticate('jwt', { session: false })(req, res, async () => {
    const foundUser = await User.findOne({ _id: req.user._id });
    
    if (!foundUser) return res.status(401).json({ error: [ { message: 'Пользователь не аутентифицирован' } ] });
    if (foundUser.isAdmin) return next();
    return res.status(403).json({ error: [ { message: 'Недостаточно прав доступа' } ] });
  });
}