const connection = require('./connection');
const ozonSellerApi = require('./ozon-seller-api');
const wildberriesSellerApi = require('./wildberries-seller-api').v1;

module.exports = {
  connection,
  ozonSellerApi,
  wildberriesSellerApi
}