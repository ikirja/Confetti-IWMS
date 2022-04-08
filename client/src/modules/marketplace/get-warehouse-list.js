import request from '@/modules/request';

export default {
  ozon: async function (token) {
    const json = await request('/api/v1/marketplace/ozon/warehouse-list', 'POST', token, {});
    return json;
  },
  wildberries: async function (token) {
    const json = await request('/api/v1/marketplace/wildberries/warehouse-list', 'POST', token, {});
    return json;
  }
}