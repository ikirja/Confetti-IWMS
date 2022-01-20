const { getConfig } = require ('../../../../../../../../lib/marketplace/ozon-seller-api');

module.exports = async (req, res) => {
  try {
    let config = getConfig();
    res.status(200).json(config);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Произошла ошибка получения настроек маркетплейса OZON Seller API' } ] });
  }
}