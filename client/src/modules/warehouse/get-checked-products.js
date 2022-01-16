export default function getCheckedProducts(products) {
  products = products.filter(product => product.checked);
  return products;
}