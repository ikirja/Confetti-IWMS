const Log = require(__basedir + '/server/models/log');

module.exports = async (log) => {
  try {
    await Log.create(log);
  } catch (err) {
    throw err;
  }
}