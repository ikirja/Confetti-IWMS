export default function getOzonRRP(product) {
  const PURCHASE_PRICE = product.purchasePrice ? product.purchasePrice : product.product.purchasePrice;
  const PRODUCT_WEIGHT = product.weight ? product.weight : product.product.weight;
  const TAXES = 0.514;

  let WEIGHT_COMMISSION = (19 * PRODUCT_WEIGHT) / 1000;
  if (WEIGHT_COMMISSION < 50) WEIGHT_COMMISSION = 50;
  if (WEIGHT_COMMISSION > 500) WEIGHT_COMMISSION = 500;
  
  return ((PURCHASE_PRICE + WEIGHT_COMMISSION) / (1 - TAXES)).toFixed(2);
}