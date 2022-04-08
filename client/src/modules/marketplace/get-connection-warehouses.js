import getWarehouseList from '@/modules/marketplace/get-warehouse-list';

export default async function getConnectionWarehouses(warehouse, token) {
  let warehouses = [];

  switch (warehouse.connection) {
    case 'ozon-seller-api':
      warehouses = await getWarehouseList.ozon(token);
      break;
    case 'wildberries-seller-api':
      warehouses = await getWarehouseList.wildberries(token);

      warehouses = warehouses.map(warehouse => {
        return {
          warehouse_id: warehouse.id,
          name: warehouse.name
        }
      });

      break;
    default:
      warehouses = [];
      break;
  }

  return warehouses;
}