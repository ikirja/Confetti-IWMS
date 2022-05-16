import request from '@/modules/request';

export default async function getProductList(limit, token) {
  const URL = '/api/v1/marketplace/wildberries/product/list';

  const jsonData = await request(URL, 'POST', token, { limit });

  return jsonData;
}