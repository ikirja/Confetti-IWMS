export default function warehouseIsForMarketplace(warehouse) {
  let isForMarketplace = false;

    if (warehouse.connection === 'ozon-seller-api') isForMarketplace = true;
    if (warehouse.connection === 'wildberries-seller-api') isForMarketplace = true;

    return isForMarketplace;
}