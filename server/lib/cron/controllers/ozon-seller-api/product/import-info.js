const Registry = require(__basedir + '/server/models/registry');
const Warehouse = require(__basedir + '/server/models/warehouse');
const { productImportInfo } = require(`${__basedir}/server/lib/marketplace/ozon-seller-api`);
const cron = require('node-cron');

async function getProductImportInfo() {
  try {
    const ozonProductImportRegs = await Registry.find({ type: 'ozon', title: 'product-import', 'fields.status': 'created' });

    for (let i = 0; i < ozonProductImportRegs.length; i++) {
      let taskIsDone = true;

      const foundWarehouse = await Warehouse.findOne({ _id: ozonProductImportRegs[i].fields.warehouse }).populate('products.product');
      if (!foundWarehouse) continue;

      const taskInfo = await productImportInfo(ozonProductImportRegs[i].fields.taskId);
      if (!taskInfo.result) continue;

      taskInfo.result.items.forEach(item => {
        if (item.status !== 'imported') taskIsDone = false;
        if (item.offer_id && item.product_id) {
          const index = foundWarehouse.products.findIndex(productInWarehouse => productInWarehouse.product.sku === item.offer_id);
          if (index !== -1) {
            foundWarehouse.products[index].ozon.offerId = item.offer_id;
            foundWarehouse.products[index].ozon.productId = item.product_id;
          }
        }
      });

      await foundWarehouse.save();

      if (!taskIsDone) continue;
      await Registry.findOneAndUpdate({ _id: ozonProductImportRegs[i] }, { 'fields.status': 'done' });
    }
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'CRON0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'CRON: Error has occured while updating task_id info',
      path: __filename
    });
  }
}

module.exports = cron.schedule('*/1 * * * *', getProductImportInfo, { scheduled: false });
