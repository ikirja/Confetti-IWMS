const { dictionary } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api').v1;
const logger = require(__basedir + '/server/lib/logger');
const ErrorData = require(__basedir + '/server/lib/error-handler').getErrorData();

module.exports = async (req, res) => {
  try {
    const { url, query } = req.body;
    if (!url || !query || typeof query !== 'object') return res.status(422).json({ error: [ { message: ErrorData.common.checkData } ] });

    const dictionaryResponse = await dictionary.get({ url, query });
    res.status(200).json(dictionaryResponse);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'MW0009',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: ErrorData.marketplace.wildberries.dictionary.find(data => data.code === "400").message,
      path: __filename
    });

    res.status(400).json({ error: [ { message: ErrorData.marketplace.wildberries.dictionary.find(data => data.code === "400").message } ] });
  }
}