import request from '@/modules/request';

export default async function updateStocksWildberries(updateStocksPayload, token) {
  const json = await request('/api/v1/marketplace/wildberries/product/stocks', 'POST', token, updateStocksPayload);
  return json;
}