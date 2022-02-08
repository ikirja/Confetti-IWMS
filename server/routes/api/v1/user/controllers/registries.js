const Registry = require(__basedir + '/server/models/registry');
const logger = require(__basedir + '/server/lib/logger');

module.exports = {
  user: async (title, user) => {
    try {
      const createdRegistry = await Registry.create({
        type: 'user',
        title,
        fields: {
          user
        }
      });
    } catch (err) {
      logger.createLog({
        title: 'Error',
        errorCode: 'I0002',
        data: JSON.stringify(err) ? JSON.stringify(err) : '',
        message: 'Error creating registry',
        path: __filename
      });
    }
  }
}