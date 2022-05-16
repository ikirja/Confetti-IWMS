import request from '@/modules/request';

export default async function updatePricesWildberries(updatePricesPayload, token) {
  const json = await request('/api/v1/marketplace/wildberries/prices/update', 'POST', token, updatePricesPayload);
  return json;
}