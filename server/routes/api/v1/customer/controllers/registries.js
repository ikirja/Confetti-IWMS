const Registry = require(__basedir + '/server/models/registry');
const logger = require(__basedir + '/server/lib/logger');

module.exports = {
  setCustomer: async (customer) => {
    try {
      const createdRegistry = await Registry.create({
        type: 'customer',
        title: 'set-customer',
        fields: {
          customer
        }
      });
    } catch (err) {
      logger.createLog({
        title: 'Error',
        errorCode: 'C0002',
        data: JSON.stringify(err) ? JSON.stringify(err) : '',
        message: 'Error creating registry',
        path: __filename
      });
    }
  }
}