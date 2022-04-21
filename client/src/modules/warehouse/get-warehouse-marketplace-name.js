import warehouseIsForMarketplace from '@/modules/warehouse/warehouse-is-for-marketplace';

export default function getWarehouseMarketplaceName(warehouse) {
  if (!warehouseIsForMarketplace(warehouse)) return null;

  let marketplace = '';

  if (warehouse.connection === 'ozon-seller-api') marketplace = 'ozon';
  if (warehouse.connection === 'wildberries-seller-api') marketplace = 'wildberries';

  return marketplace;
}