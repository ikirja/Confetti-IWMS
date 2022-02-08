import request from '@/modules/request';

export default async function updatePricesOzon(productPricesPayload, token) {
  const json = await request('/api/v1/marketplace/ozon/product-prices', 'POST', token, productPricesPayload);
  return json;
}