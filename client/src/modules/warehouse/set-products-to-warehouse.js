import getCheckedProducts from './get-checked-products';
import validateProductsForWarehouse from './validate-products-for-warehouse';
import request from '@/modules/request';

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

  const json = await request('/api/v1/warehouse/product', 'POST', token, body);

  if (json.error?.length > 0) response.error = json.error;
  if (json.addedProducts?.length > 0) response.addedProducts = json.addedProducts;
  if (json.updatedProducts?.length > 0) response.updatedProducts = json.updatedProducts;

  return response;
}