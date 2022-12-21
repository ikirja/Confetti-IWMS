const request = require('../request');

module.exports = async function getCharacteristicsByCategory(objectName) {
  const response = await request(`/content/v1/object/characteristics/${objectName}`, 'GET');
  if (response.status === 200) return response.json();
  return response;
}