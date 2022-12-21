const { characteristics } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api').v2;

module.exports = async (req, res) => {
  const { objectName } = req.body;
  if (!objectName || typeof objectName !== 'string') return res.status(422).json({ error: [ { message: 'objectName <String> is required' } ] });

  try {
    const response = await characteristics.getCharacteristicsByCategory(objectName);
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Error occured while getting characteristics by category from Wildebrries Seller API' } ] });
  }
}