import request from '@/modules/request';

export default async function setConnection({ warehouseId, connection, token }) {
  const json = await request('/api/v1/warehouse/connection', 'POST', token, { warehouseId, connection });
  return json;
}