import request from '@/modules/request';

export default async function addToWildberries(productsPayload, token) {
  const URL = '/api/v1/marketplace/wildberries/product/create';

  const responses = [];

  for (let i = 0; i < productsPayload.products.length; i++) {
    responses.push(await request(URL, 'POST', token, {
      warehouseId: productsPayload.warehouseId,
      product: productsPayload.products[i]
    }));
  }
  
  return responses;
}