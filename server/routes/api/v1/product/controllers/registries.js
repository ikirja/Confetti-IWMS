const Registry = require(__basedir + '/server/models/registry');
const logger = require(__basedir + '/server/lib/logger');

module.exports = {
  product: async (title, product) => {
    try {
      const createdRegistry = await Registry.create({
        type: 'product',
        title,
        fields: {
          product
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