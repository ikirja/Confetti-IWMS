const crypto = require('crypto');
const fs = require('fs');
const { product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');

module.exports = async function sendProductPhotos(productInWarehouse) {
  const mainImage = productInWarehouse.product.image;
  const images = productInWarehouse.product.images.filter(image => image._id.toString() !== mainImage._id.toString());
  let imagesPayloads = [];
  let uploadedImages = [];

  const mainImagePayload = {
    uuid: crypto.randomUUID(),
    photoBinary: fs.readFileSync(__basedir + '/server/public/upload/' + mainImage.file + '-wb.jpg')
  }

  images.forEach(image => {
    imagesPayloads.push({
      uuid: crypto.randomUUID(),
      photoBinary: fs.readFileSync(__basedir + '/server/public/upload/' + image.file + '-wb.jpg')
    });
  });

  const uploadedMainImage = await product.photo(mainImagePayload);
  if (uploadedMainImage) uploadedImages.push({ value: mainImagePayload.uuid, units: 'images/jpeg' });

  for (let i = 0; i < imagesPayloads.length; i++) {
    const uploadedImage = await product.photo(imagesPayloads[i]);
    if (uploadedImage) uploadedImages.push({ value: imagesPayloads[i].uuid, units: 'images/jpeg' });
  }

  return uploadedImages;
}