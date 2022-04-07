const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/sevrer/models/registry');
const { product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');
const { config } = require(__basedir + '/server/lib/marketplace/wildberries-seller-api');

module.exports = async (req, res) => {
  if (!req.body.warehouseId) return res.status(422).json({ error: [ { message: 'Warehouse ID is required' } ] });
  if (!req.body.product) return res.status(422).json({ error: [ { message: 'Product ID are required' } ] });

  const config = config.get();

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId }).populate({
      path: 'products.product',
      populate: [ 'image', 'images' ]
    });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse has not been found' } ] });

    const foundProductInWarehouse = foundWarehouse.products.find(productInWarehouse => productInWarehouse.product.image && productInWarehouse.product._id.toString() === req.body.product.toString());
    if (!foundProductInWarehouse) return res.status(404).json({ error: [ { message: 'Product has not been found in Warehouse' } ] });

    const productPayload = {
      "id": 1,
      "jsonrpc": "2.0",
      "params": {
        "card": {
          "addin": [
            {
              "params": [
                {
                  "count": 0,
                  "units": "string",
                  "value": "string"
                }
              ],
              "type": "string"
            }
          ],
          "countryProduction": "Россия",
          "createdAt": "",
          "id": "",
          "imtId": 0,
          "imtSupplierId": 0,
          "nomenclatures": [
            {
              "addin": [
                {
                  "params": [
                    {
                      "count": 0,
                      "units": "string",
                      "value": "string"
                    }
                  ],
                  "type": "string"
                }
              ],
              "concatVendorCode": "string",
              "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
              "isArchive": true,
              "nmId": 0,
              "variations": [
                {
                  "addin": [
                    {
                      "params": [
                        {
                          "count": 0,
                          "units": "string",
                          "value": "string"
                        }
                      ],
                      "type": "string"
                    }
                  ],
                  "barcode": foundProductInWarehouse.product.barcode,
                  "chrtId": 0,
                  "id": ""
                }
              ],
              "vendorCode": foundProductInWarehouse.product.sku
            }
          ],
          "object": "ЭТО КАТЕГОРИЯ!",
          "parent": "ЭТО РОДИТЕЛЬСКАЯ КАТЕГОРИЯ!",
          "supplierId": "",
          "supplierVendorCode": foundProductInWarehouse.product.barcode,
          "updatedAt": "",
          "uploadID": "",
          "userId": 0
        },
        "supplierID": ""
      }
    };

    const response = await product.create(productPayload);
    console.log(response);

    // записываем выгрузку в регистр сведений
    // if (false) {
    //   const createdRegistry = await Registry.create({
    //     type: 'wildberries',
    //     title: 'product-create',
    //     fields: {
    //       product: productPayload
    //     }
    //   });
    // }

    // возвращаем респонс?
    res.status(200).json(response);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'WB0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while import products to Wildberries Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while import products to Wildberries Seller API' } ] });
  }
}