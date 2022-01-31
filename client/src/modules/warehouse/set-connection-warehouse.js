export default async function setConnectionWarehouse({ warehouseId, connectionWarehouseId, token }) {
  const response = await fetch('/api/v1/warehouse/connection-warehouse', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      token
    },
    body: JSON.stringify({ warehouseId, connectionWarehouseId })
  });

  const jsonData = await response.json();
  return jsonData;
}