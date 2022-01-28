const { getCategoryAttribute } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');

module.exports = async (req, res) => {
  try {
    const response = await getCategoryAttribute(req.body.categoryId);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Произошла ошибка получения характеристик категории OZON Seller API' } ] });
  }
}