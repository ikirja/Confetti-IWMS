const Customer = require('../../../../../../models/customer');
const validateCustomer = require('./validate-customer');
const logger = require('../../../../../../logger');

module.exports = async (req, res) => {
  const validated = validateCustomer(req.body);
  if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

  let createdCustomer = {};
  let updatedCustomer = {};

  try {
    const foundCustomer = await Customer.findOne({ phone: validated.customer.phone });
    
    if (!foundCustomer) {
      createdCustomer = await Customer.create(validated.customer);
    } else {
      foundCustomer.title = validated.customer.title;
      foundCustomer.fields = validated.customer.fields;
      updatedCustomer = validated.customer;

      foundCustomer.save();
    }
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'C0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка создания статуса',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Ошибка создания статуса'} ] });
  }

  res.status(200).json({ createdCustomer, updatedCustomer });
}