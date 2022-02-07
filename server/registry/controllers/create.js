const Registry = require(__basedir + '/server/models/registry');

module.exports = async (registry) => {
  try {
    await Registry.create(registry);
  } catch (err) {
    throw err;
  }
}