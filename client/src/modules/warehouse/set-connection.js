export default async function setConnection({ warehouseId, connection, token }) {
  const response = await fetch('/api/v1/warehouse/connection', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      token
    },
    body: JSON.stringify({ warehouseId, connection})
  });

  const jsonData = await response.json();
  return jsonData;
}