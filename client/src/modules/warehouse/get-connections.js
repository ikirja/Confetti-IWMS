import request from '@/modules/request';

export default async function getConnections(token) {
  const json = await request('/api/v1/warehouse/connection', 'GET', token);
  return json;
}