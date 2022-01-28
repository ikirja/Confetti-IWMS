const Registry = require(__basedir + '/server/models/registry');

module.exports = async (registry) => {
  try {
    await Log.create(registry);
  } catch (err) {
    throw err;
  }
}