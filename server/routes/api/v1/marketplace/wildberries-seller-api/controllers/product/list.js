const { product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');
const logger = require(__basedir + '/server/lib/logger');

module.exports = async (req, res) => {
  if (!req.body.limit) return res.status(422).json({ error: [ { message: 'Limit is required' } ] });

  try {
    const response = await product.list(req.body.limit);
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