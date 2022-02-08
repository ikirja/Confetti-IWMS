const User = require(__basedir + '/server/models/user');
const logger = require(__basedir + '/server/lib/logger');
const userRegistries = require('./registries');

module.exports = async (req, res) => {
  if (!req.body.userId) return res.status(422).json({ error: [ { message: 'User ID is required' } ] });

  try {
    const foundUser = await User.findOne({ _id: req.body.userId });
    if (!foundUser) return res.status(404).json({ errors: [ { message: 'User not found' } ] });

    foundUser.isAdmin = !foundUser.isAdmin;
    foundUser.save();
    await userRegistries.user('set-user-admin', foundUser);

    res.status(200).json(foundUser);
  } catch (err) {
    logger.createLog({
      title: 'Error',
      errorCode: 'U0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error setting user as administrator',
      path: __filename
    });

    res.status(400).json({ errors: [ { message: 'Error setting user as administrator' } ] });
  }
}