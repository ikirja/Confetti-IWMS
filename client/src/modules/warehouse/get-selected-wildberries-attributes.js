export default function getSelectedWildberriesAttributes(product, attributes, attributesNomenclatureVariation, attributesNomenclature) {
  let selectedAttributes = {
    attributes: {
      isSet: true,
      addins: []
    },
    attributesNomenclatureVariation: {
      isSet: true,
      addins: []
    },
    attributesNomenclature: {
      isSet: true,
      addins: []
    }
  }

  selectedAttributes.attributes = getSelectedAttributes(product, attributes);
  selectedAttributes.attributesNomenclatureVariation = getSelectedAttributes(product, attributesNomenclatureVariation);
  selectedAttributes.attributesNomenclature = getSelectedAttributes(product, attributesNomenclature);

  return selectedAttributes;
}

function getSelectedAttributes(product, attributes) {
  let isSet = true;
  let addins = [];

  attributes.forEach(attribute => {
    if (attribute.type === 'Наименование') {
      attribute.params = [ { value: product.product.title }];
      addins.push(attribute);
      return;
    }

    if (attribute.type === 'Описание') {
      attribute.params = [ { value: product.product.description }];
      addins.push(attribute);
      return;
    }

    if (attribute.isNumber && attribute.inputValue > 0) attribute.params = [ { count: Number(attribute.inputValue) } ];
    if (!attribute.isNumber && attribute.inputValue?.length > 0) attribute.params = [ { value: attribute.inputValue } ];
    if (!attribute.useOnlyDictionaryValues && attribute.inputValue?.length === 0) delete attribute.params;

    if (attribute.required) {
      if (attribute.useOnlyDictionaryValues && (!attribute.params || attribute.params.length === 0)) isSet = false;
      if (!attribute.useOnlyDictionaryValues && (!attribute.params || attribute.params.length === 0)) isSet = false;

      // HACK FOR ADDITIONAL COLOR ATTRIBUTE (THERE'S NOT /tech-sizes request in wildberries!)
      if (attribute.useOnlyDictionaryValues && attribute.dictionary === '/tech-sizes' && attribute.inputValue.length > 0) isSet = true;
    }

    addins.push(attribute);
  });

  return { isSet, addins };
}