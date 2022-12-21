const request = require('../request');

module.exports = async function getCategories() {
  const response = await request(`/content/v1/object/all?top=100000`, 'GET');
  if (response.status === 200) return response.json();
  return response;
}