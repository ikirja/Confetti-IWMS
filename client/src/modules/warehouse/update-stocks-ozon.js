import request from '@/modules/request';

export default async function updateStocksOzon(productStocksPayload, token) {
  const json = await request('/api/v1/marketplace/ozon/product-stocks', 'POST', token, productStocksPayload);
  return json;
}