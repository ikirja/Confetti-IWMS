const FormData = require('form-data');
const fetch = require('node-fetch');
const config = require('../../config');

module.exports = async function photo({ uuid, photoBinary }) {
  let formData = new FormData();
  formData._boundary = 'boundaryImage';
  formData.append('uploadfile', photoBinary, 'photo.jpg');

  let options = {
    method: 'POST',
    headers: {
      'Authorization': config.API_KEY,
      'X-File-Id': uuid
    },
    body: formData
  }

  const response = await fetch(config.API_URL + '/card/upload/file/multipart', options);
  
  if (response.status !== 200) return false;
  return true;
}