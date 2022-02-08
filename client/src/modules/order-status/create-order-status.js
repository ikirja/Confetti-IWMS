import validateOrderStatus from "./validate-order-status";
import request from '@/modules/request';

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

  const json = await request('/api/v1/order-status/create', 'POST', token, validated.orderStatus);

  if (json.error) {
    response.errors = json.error;
    return response;
  }
  
  response.createdStatus = json;
  return response;
}