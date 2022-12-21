const { prices } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api').v1;

module.exports = async (req, res) => {
  try {
    const response = await prices.info('quantity=0');

    if (response.status && response.status !== 200) return res.status(response.status).json({ error: [ { message: 'Error' } ] });
    res.status(200).json(response);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'WB0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while checking prices info through Wildeberries Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while checking prices info through Wildeberries Seller API' } ] });
  }
}