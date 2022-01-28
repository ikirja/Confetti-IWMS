const Registry = require(__basedir + '/server/models/registry');
const { productImportInfo } = require(`${__basedir}/server/lib/marketplace/ozon-seller-api`);
const cron = require('node-cron');

async function getProductImportInfo() {
  try {
    const ozonProductImportRegs = await Registry.find({ type: 'ozon', title: 'product-import' });

    const requests = [];
    ozonProductImportRegs.forEach(registry => requests.push(productImportInfo(registry.fields.taskId)));

    const responses = await Promise.allSettled(requests);
    console.log(responses);
  } catch (err) {
    console.log(err);
  }
}

module.exports = cron.schedule('*/1 * * * *', getProductImportInfo, { scheduled: false });
