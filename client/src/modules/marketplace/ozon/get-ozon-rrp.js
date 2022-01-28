export default function getOzonRRP(product) {
  const purchasePrice = product.purchasePrice;
  const taxes = 0.486;

  let weightCommission = (19 * product.weight) / 1000;
  if (weightCommission < 50) weightCommission = 50;
  if (weightCommission > 500) weightCommission = 500;
  
  return ((purchasePrice + weightCommission) / taxes).toFixed(2);
}