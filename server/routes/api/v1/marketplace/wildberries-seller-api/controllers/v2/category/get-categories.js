const { category } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api').v2;

module.exports = async (req, res) => {
  try {
    const response = await category.getCategories();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Error occured while getting category by parent from Wildebrries Seller API' } ] });
  }
}