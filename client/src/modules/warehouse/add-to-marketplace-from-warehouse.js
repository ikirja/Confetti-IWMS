import addToOzon from '@/modules/warehouse/add-to-ozon';

export default async function addToMarketplaceFromWarehouse(marketplaceName, warehouse, productsInWarehouse, token) {
  if (!marketplaceName) return 'Склад не привязан к маркетплейсу';

  const body = {
    warehouseId: warehouse._id,
    products: []
  }

  productsInWarehouse.forEach(productInWarehouse => productInWarehouse.checked ? body.products.push(productInWarehouse.product._id) : '');
  if (body.products.length === 0) return 'Не выбраны товары';

  if (marketplaceName === 'ozon-seller-api') {
    const jsonData = await addToOzon(body, token);
    if (jsonData.error) return JSON.stringify(jsonData);
  }

  if (marketplaceName === 'wildberries-seller-api') {
    return 'Функционал в разработке';
    // const jsonData = await addToOzon(body, store.state.token);
    // if (jsonData.error) return alert(JSON.stringify(jsonData));
  }

  return 'Успешно';
}