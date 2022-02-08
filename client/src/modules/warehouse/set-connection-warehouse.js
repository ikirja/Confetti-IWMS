import request from '@/modules/request';

export default async function setConnectionWarehouse({ warehouseId, connectionWarehouseId, token }) {
  const json = await request('/api/v1/warehouse/connection-warehouse', 'POST', token, { warehouseId, connectionWarehouseId });
  return json;
}