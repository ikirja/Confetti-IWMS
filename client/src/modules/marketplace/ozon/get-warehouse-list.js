export default async function getWarehouseList(token) {
  const response = await fetch('/api/v1/marketplace/ozon/warehouse-list', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      token
    },
    body: JSON.stringify({})
  });

  const jsonData = await response.json();
  return jsonData;
}