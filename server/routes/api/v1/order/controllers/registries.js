const Registry = require(__basedir + '/server/models/registry');
const logger = require(__basedir + '/server/lib/logger');

module.exports = {
  order: async (title, order) => {
    try {
      const createdRegistry = await Registry.create({
        type: 'order',
        title,
        fields: {
          order
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