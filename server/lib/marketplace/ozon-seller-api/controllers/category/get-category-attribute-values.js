const request = require('../request');

module.exports = async function getCategoryAttributeValues({ categoryId, attributeId, lastValueId, limit }) {
  const response = await request('/v2/category/attribute/values', 'POST', {
    attribute_id: Number(attributeId),
    category_id: Number(categoryId),
    last_value_id: Number(lastValueId),
    limit: Number(limit) 
  });
  if (response.status === 200) return response.json();
  return response;
}