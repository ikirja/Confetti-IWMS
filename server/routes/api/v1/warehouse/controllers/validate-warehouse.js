module.exports = function validateWarehouse(warehouse) {
  let validated = { warehouse: {}, errors: [] };

  if (!warehouse.title || typeof warehouse.title !== 'string') validated.errors.push({ code: 1, message: 'Название склада', warehouse });
  if (validated.errors.length === 0) validated.warehouse = warehouse;

  return validated;
}