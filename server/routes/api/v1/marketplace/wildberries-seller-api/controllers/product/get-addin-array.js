module.exports = function getAddinArray(filteredAddin) {
  if (!Array.isArray(filteredAddin)) return [];

  return filteredAddin.map(attribute => {
    return {
      type: attribute.type,
      params: attribute.params
    }
  });
}