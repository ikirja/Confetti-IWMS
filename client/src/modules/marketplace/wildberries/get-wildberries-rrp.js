export default function getWildberriesRRP(product) {
  const PURCHASE_PRICE = product.purchasePrice ? product.purchasePrice : product.product.purchasePrice;
  const TAXES = 0.26;
  const COMMISSION_BY_PRODUCT = 65;
  
  return ((PURCHASE_PRICE + COMMISSION_BY_PRODUCT) / (1 - TAXES)).toFixed(2);
}