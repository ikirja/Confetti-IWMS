module.exports = function validateProductPrices(products) {
  const validated = {
    products: [],
    errors: []
  }

  products.forEach(product => {
    let validatedProduct = true;

    if (!product.price || typeof product.price !== 'number' || product.quantity < 0) {
      validated.errors.push({ code: 1, message: 'OZON Seller API: Product price', product });
      validatedProduct = false;
    }

    if (!product.ozon?.offerId || typeof product.ozon?.offerId !== 'string') {
      validated.errors.push({ code: 2, message: 'OZON Seller API: Offer ID', product });
      validatedProduct = false;
    }

    if (!product.ozon?.productId || typeof product.ozon?.productId !== 'number') {
      validated.errors.push({ code: 3, message: 'OZON Seller API: Product ID', product });
      validatedProduct = false;
    }

    if (validatedProduct) validated.products.push(product);
  });

  return validated;
}