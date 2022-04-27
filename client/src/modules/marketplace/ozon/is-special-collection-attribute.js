export default function isSpecialCollectionAttribute(attribute) {
  const ID = attribute.id;
  
  let isSpecial = false;
  
  if (
    ID === 31 ||
    ID === 4495 ||
    ID === 12121
  ) {
    isSpecial = true;
  }

  return isSpecial;
}