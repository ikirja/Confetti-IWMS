import addToOzon from '@/modules/warehouse/add-to-ozon';
import addToWildberries from '@/modules/warehouse/add-to-wildberries';
import updateToWildberries from '@/modules/warehouse/update-to-wildberries';

export default async function addToMarketplaceFromWarehouse(marketplaceName, warehouse, productsInWarehouse, token) {
  if (!marketplaceName) return 'Склад не привязан к маркетплейсу';

  if (marketplaceName === 'ozon') {
    const body = {
      warehouseId: warehouse._id,
      products: []
    }

    productsInWarehouse.forEach(productInWarehouse => productInWarehouse.checked ? body.products.push(productInWarehouse.product._id) : '');
    if (body.products.length === 0) return 'Не выбраны товары';

    const jsonData = await addToOzon(body, token);
    if (jsonData.error) return JSON.stringify(jsonData);
  }

  if (marketplaceName === 'wildberries') {
    let productsToAdd = [];
    let productsToUpdate = [];

    let error = {
      status: false,
      data: []
    }

    productsInWarehouse.forEach(productInWarehouse => {
      productInWarehouse.checked && !productInWarehouse.wildberries.productId ? productsToAdd.push(productInWarehouse.product._id) : '';
      productInWarehouse.checked && productInWarehouse.wildberries.productId ? productsToUpdate.push(productInWarehouse.product._id) : '';
    });

    if (productsToAdd.length > 0) {
      const responses = await addToWildberries({
        warehouseId: warehouse._id,
        products: productsToAdd
      }, token);

      responses.forEach(res => {
        if (res.error) {
          error.status = true;
          error.data.push(res)
        }
      });
    }

    if (productsToUpdate.length > 0) {
      const responses = await updateToWildberries({
        warehouseId: warehouse._id,
        products: productsToUpdate
      }, token);

      responses.forEach(res => {
        if (res.error) {
          error.status = true;
          error.data.push(res)
        }
      });
    }

    if (error.status) return JSON.stringify(error);
  }

  return 'Успешно';
}