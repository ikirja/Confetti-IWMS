const request = require('../request');

module.exports = async function getCategoryTree(categoryId) {
  const response = await request('/v3/category/attribute', 'POST', {
    category_id: [ Number(categoryId) ]
  });
  if (response.status === 200) return response.json();
  return response;
}