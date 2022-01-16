export default function validateOrderStatus(orderStatus) {
  let validated = { orderStatus: {}, errors: [] };

  if (!orderStatus.title || typeof orderStatus.title !== 'string') validated.errors.push({ code: 1, message: 'Название статуса', orderStatus });
  if (validated.errors.length === 0) validated.orderStatus = orderStatus;

  return validated;
}