module.exports = function validateProductPrices(products) {
  const validated = {
    products: [],
    errors: []
  }

  products.forEach(product => {
    let validatedProduct = true;

    if (!product.price || typeof product.price !== 'number' || product.quantity < 0) {
      validated.errors.push({ code: 1, message: 'Wildberries Seller API: Product price', product });
      validatedProduct = false;
    }

    if (!product.wildberries?.productId || typeof product.wildberries?.productId !== 'number') {
      validated.errors.push({ code: 2, message: 'Wildberries Seller API: Product ID', product });
      validatedProduct = false;
    }

    if (validatedProduct) validated.products.push(product);
  });

  return validated;
}