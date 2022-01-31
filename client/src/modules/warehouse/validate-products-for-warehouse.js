export default function validateProductsForWarehouse(products) {
  const validated = {
    products: [],
    error: []
  }

  products.forEach(product => {
    let validatedProduct = true;

    if (!product.product || typeof product.product === 'object') {
      validated.error.push({ code: 1, message: 'Передан объект вместо идентификатора товара в ключе product', product });
      validatedProduct = false;
    }

    if (!product.price) {
      validated.error.push({ code: 2, message: 'Цена товара', product });
      validatedProduct = false;
    }

    if (validatedProduct) validated.products.push(product);
  });
  
  return validated;
}