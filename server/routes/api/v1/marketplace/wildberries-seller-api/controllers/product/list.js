const { product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  if (!req.body.limit) return res.status(422).json({ error: [ { message: 'Limit is required' } ] });

  try {
    const payload = {
      id: '1',
      jsonrpc: "2.0",
      params: {
        query: {
          limit: req.body.limit,
          offset: 0
        },
        withError: false
      }
    };

    const response = await product.list(payload);
    const wbProducts = response.result?.cards?.length > 0 ? response.result.cards : [];

    res.status(200).json(wbProducts);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'WB0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while getting list of products from Wildberries Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while getting list of products from Wildberries Seller API' } ] });
  }
}