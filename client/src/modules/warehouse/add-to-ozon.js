export default async function addToOzon(productsPayload, token) {
  const response = await fetch('/api/v1/marketplace/ozon/product-import', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    body: JSON.stringify(productsPayload)
  });

  const jsonData = await response.json();
  return jsonData;
}