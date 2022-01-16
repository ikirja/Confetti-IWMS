export default function validateProducts(products) {
  let validated = {
    products: [],
    errors: []
  }

  products.forEach(product => {
    let validatedProduct = true;

    if (!product.title || typeof product.title !== 'string') {
      validated.errors.push({ code: 1, message: 'Название товара', product });
      validatedProduct = false;
    }

    if (!product.sku || typeof product.sku !== 'string') {
      validated.errors.push({ code: 2, message: 'Артикул товара', product });
      validatedProduct = false;
    }

    if (!product.weight || typeof product.weight !== 'number') {
      validated.errors.push({ code: 3, message: 'Вес товара', product });
      validatedProduct = false;
    }

    if (
      !product.dimensions ||
      !product.dimensions.width ||
      typeof product.dimensions.width !== 'number' ||
      !product.dimensions.height ||
      typeof product.dimensions.height !== 'number' ||
      !product.dimensions.depth ||
      typeof product.dimensions.depth !== 'number'
    ) {
      validated.errors.push({ code: 4, message: 'Габариты товара товара', product });
      validatedProduct = false;
    }

    if (!product.barcode || typeof product.barcode !== 'string') {
      validated.errors.push({ code: 5, message: 'Штрихкод товара', product });
      validatedProduct = false;
    }

    if (!product.description || typeof product.description !== 'string') {
      validated.errors.push({ code: 6, message: 'Описание товара', product });
      validatedProduct = false;
    }

    if (!product.purchasePrice || typeof product.purchasePrice !== 'number') {
      validated.errors.push({ code: 7, message: 'Закупочная цена товара', product });
      validatedProduct = false;
    }

    if (validatedProduct) validated.products.push(product);
  });

  return validated;
}