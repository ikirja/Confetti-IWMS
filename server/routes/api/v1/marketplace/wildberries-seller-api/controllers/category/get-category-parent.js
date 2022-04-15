const { category } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');

module.exports = async (req, res) => {
  try {
    const response = await category.getParent();
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Error occured while getting parent category from Wildebrries Seller API' } ] });
  }
}