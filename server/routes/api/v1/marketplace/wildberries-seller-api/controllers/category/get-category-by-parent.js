const { category } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');

module.exports = async (req, res) => {
  const { parent } = req.body;
  if (!parent || typeof parent !== 'string' || parent.length === 0) return res.status(422).json({ error: [ { message: 'Parent <String> is required' } ] });
  
  try {
    const response = await category.getByParent(parent);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Error occured while getting category by parent from Wildebrries Seller API' } ] });
  }
}