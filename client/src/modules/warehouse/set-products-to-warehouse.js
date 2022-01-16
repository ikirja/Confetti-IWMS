import getCheckedProducts from './get-checked-products';
import validateProductsForWarehouse from './validate-products-for-warehouse';

export default async function setProductsToWarehouse(warehouse, products, token) {
  const response = {
    addedProducts: [],
    updatedProducts: [],
    error: []
  }

  const productsToSet = getCheckedProducts(products);

  if (productsToSet.length === 0) return null;

  const validated = validateProductsForWarehouse(productsToSet);

  if (validated.error.length > 0) {
    response.error = validated.error;
    return response;
  }

  const body = { warehouseId: warehouse._id, products: validated.products };

  const responseFromServer = await fetch('/api/v1/warehouse/product', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'token': token
    },
    body: JSON.stringify(body)
  });

  const jsonData = await responseFromServer.json();

  if (jsonData.error?.length > 0) response.error = jsonData.error;
  if (jsonData.addedProducts?.length > 0) response.addedProducts = jsonData.addedProducts;
  if (jsonData.updatedProducts?.length > 0) response.updatedProducts = jsonData.updatedProducts;

  return response;
}