const { connection } = require('../../marketplace');

module.exports = async (req, res) => {
  const connections = connection.getConnections();
  res.status(200).json(connections);
}