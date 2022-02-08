import request from '@/modules/request';

export default async function addToOzon(productsPayload, token) {
  const json = await request('/api/v1/marketplace/ozon/product-import', 'POST', token, productsPayload);
  return json;
}