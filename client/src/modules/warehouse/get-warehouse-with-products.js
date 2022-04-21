import request from '@/modules/request';
import getOzonRRP from '@/modules/marketplace/ozon/get-ozon-rrp';
import getWildberriesRRP from '@/modules/marketplace/wildberries/get-wildberries-rrp';

export default async function getWarehouseWithProducts({ warehouse, token }) {
  const url = `/api/v1/warehouse/${warehouse._id}`;
  const jsonData = await request(url, 'GET', token);

  if (!jsonData.products || !Array.isArray(jsonData.products)) return [];

  jsonData.products.forEach(product => {
    product.checked = false;
    product.inStock = product.quantity;
    product.quantity = 0;

    if (warehouse.connection === 'ozon-seller-api') {
      product.ozon.showModal = false;
      product.ozon.rrp = getOzonRRP(product);
    }

    if (warehouse.connection === 'wildberries-seller-api') {
      product.wildberries.showModal = false;
      product.wildberries.rrp = getWildberriesRRP(product);
    }
  });

  return jsonData.products;
}