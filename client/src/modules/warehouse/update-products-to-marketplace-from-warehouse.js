import updateStocksOzon from '@/modules/warehouse/update-stocks-ozon';
import updatePricesOzon from '@/modules/warehouse/update-prices-ozon';
import updateStocksWildberries from '@/modules/warehouse/update-stocks-wildberries';
import updatePricesWildberries from '@/modules/warehouse/update-prices-wildberries';

export default async function updateProductsToMarketplaceFromWarehouse(marketplaceName, warehouse, productsInWarehouse, type, token) {
  if (!marketplaceName) return 'Склад не привязан к маркетплейсу';

  const body = {
    warehouseId: warehouse._id,
    products: []
  }

  if (type === 'stocks') productsInWarehouse.forEach(productInWarehouse => productInWarehouse.quantity = productInWarehouse.inStock);

  body.products = productsInWarehouse.filter(productInWarehouse => productInWarehouse.checked);
  if (body.products.length === 0) return 'Не выбраны товары';

  let jsonData = { error: false };

  let message = 'Успешно';

  switch (marketplaceName) {
    case 'ozon':
      if (type === 'stocks') jsonData = await updateStocksOzon(body, token);
      if (type === 'prices') jsonData = await updatePricesOzon(body, token);
      break;
    case 'wildberries':
      if (type === 'stocks') jsonData = await updateStocksWildberries(body, token);
      if (type === 'prices') jsonData = await updatePricesWildberries(body, token);
      break;
    default:
      message = 'Маркетплейса не существует';
  }
  
  if (jsonData.error) return JSON.stringify(jsonData);
  return message;
}