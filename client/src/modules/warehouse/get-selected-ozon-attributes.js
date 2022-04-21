export default function getSelectedOzonAttributes(attributes) {
  let selectedAttributes = [];

  attributes.forEach(attribute => {
    if (attribute.inputValue.length > 0) {
      let selectedAttribute = {
        complex_id: 0,
        id: attribute.id,
        values: []
      }

      if (attribute.is_collection && attribute.selectedValue) {
        selectedAttribute.values.push({
          dictionary_value_id: attribute.selectedValue.id,
          value: attribute.selectedValue.value
        });
      } else {
        selectedAttribute.values.push({
          value: attribute.inputValue
        });
      }

      selectedAttributes.push(selectedAttribute);
    }
  });

  return selectedAttributes;
}