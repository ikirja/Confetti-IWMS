module.exports = function validateProductStocks(products) {
  const validated = {
    products: [],
    errors: []
  }

  products.forEach(product => {
    let validatedProduct = true;

    if (typeof product.quantity !== 'number' || product.quantity < 0) {
      validated.errors.push({ code: 1, message: 'Wildberries Seller API: Product quantity', product });
      validatedProduct = false;
    }

    if (!product.wildberries?.productId || typeof product.wildberries?.productId !== 'number') {
      validated.errors.push({ code: 2, message: 'Wildberries Seller API: Product ID', product });
      validatedProduct = false;
    }

    if (!product.product.barcode || product.product.barcode.length < 3) {
      validated.errors.push({ code: 3, message: 'Wildberries Seller API: Product Barcode', product });
      validatedProduct = false;
    }

    if (validatedProduct) validated.products.push(product);
  });

  return validated;
}