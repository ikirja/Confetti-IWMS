const Warehouse = require(__basedir + '/server/models/warehouse');
const validateWarehouse = require('./validate-warehouse');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  const validated = validateWarehouse(req.body);

  if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

  try {
    const createdWarehouse = await Warehouse.create(validated.warehouse);
    res.status(200).json(createdWarehouse);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'W0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка создания склада',
      path: __filename
    });

    res.status(500).json({ errors: [ { message: 'Произошла непредвиденная ошибка' } ] });
  }
}