import request from '@/modules/request';

export default async function getWarehouseList(token) {
  const json = await request('/api/v1/marketplace/ozon/warehouse-list', 'POST', token, {});
  return json;
}