const { getCategoryAttributeValues } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');

module.exports = async (req, res) => {
  try {
    const response = await getCategoryAttributeValues({
      categoryId: req.body.categoryId,
      attributeId: req.body.attributeId,
      lastValueId: req.body.lastValueId,
      limit: req.body.limit
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Произошла ошибка получения значений характеристики OZON Seller API' } ] });
  }
}