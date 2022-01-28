export default async function updateStocksOzon(productStocksPayload, token) {
  const response = await fetch('/api/v1/marketplace/ozon/product-prices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    body: JSON.stringify(productStocksPayload)
  });

  const jsonData = await response.json();
  return jsonData;
}