export default function getSelectedWildberriesAttributes(product) {
  let isSet = true;
  let addins = [];

  product.wildberries.category.addin.forEach(attribute => {
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

    if (attribute.inputValue.length > 0) attribute.params = [ { value: attribute.inputValue } ];

    if (attribute.required) {
      if (attribute.useOnlyDictionaryValues && !attribute.selectedValue) isSet = false;
      if (!attribute.useOnlyDictionaryValues && attribute.inputValue.length === 0) isSet = false;
    }

    addins.push(attribute);
  });

  return { isSet, addins };
}