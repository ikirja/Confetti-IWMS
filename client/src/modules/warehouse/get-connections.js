export default async function getConnections(token) {
  const response = await fetch('/api/v1/warehouse/connection', { headers: { token } });
  if (response.status !== 200) return [];

  return response.json();
}