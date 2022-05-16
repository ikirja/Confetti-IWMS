import request from '@/modules/request';

export default async function setImtIdWildberries(payload, token) {
  if (!payload.warehouseId) return 'Warehouse ID обязательный параметр';
  if (!payload.wbProducts || payload.wbProducts.lenght === 0) return 'wbProducts обязательны';

  const URL = '/api/v1/marketplace/wildberries/product/set-imt-id';

  const jsonData = await request(URL, 'POST', token, payload);

  if (jsonData.error) return JSON.stringify(jsonData);
  return 'Успешно';
}