const { config } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api').v1;

module.exports = async (req, res) => {
  try {
    let foundConfig = config.get();
    res.status(200).json(foundConfig);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Error getting Wildberries Seller API config data' } ] });
  }
}