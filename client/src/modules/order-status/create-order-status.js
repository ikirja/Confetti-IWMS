import validateOrderStatus from "./validate-order-status";

export default async function createOrderStatus(orderStatus, token) {
  const response = {
    createdStatus: {},
    errors: []
  }

  const validated = validateOrderStatus(orderStatus);
  if (validated.errors.length > 0) {
    response.errors = validated.errors;
    return response;
  }

  const responseFromServer = await fetch('/api/v1/order-status/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    body: JSON.stringify(validated.orderStatus)
  });

  const jsonData = await responseFromServer.json();

  if (jsonData.error) {
    response.errors = jsonData.error;
    return response;
  }
  
  response.createdStatus = jsonData;
  return response;
}