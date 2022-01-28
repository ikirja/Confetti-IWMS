module.exports = function validateProductStocks(products) {
  const validated = {
    products: [],
    errors: []
  }

  products.forEach(product => {
    let validatedProduct = true;

    if (!product.quantity || typeof product.quantity !== 'number' || product.quantity < 0) {
      validated.errors.push({ code: 1, message: 'OZON Seller API: Product quantity', product });
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