const { getCategoryTree } = require ('../../../../../../../../lib/marketplace/ozon-seller-api');

module.exports = async (req, res) => {
  try {
    const response = await getCategoryTree();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Произошла ошибка получения дерева категорий от OZON Seller API' } ] });
  }
}