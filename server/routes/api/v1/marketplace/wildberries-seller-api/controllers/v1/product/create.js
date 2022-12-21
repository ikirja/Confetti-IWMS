const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/server/models/registry');
const { product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api').v1;
const logger = require(__basedir + '/server/lib/logger');
const getAddinArray = require('./get-addin-array');

module.exports = async (req, res) => {
  if (!req.body.warehouseId) return res.status(422).json({ error: [ { message: 'Warehouse ID is required' } ] });
  if (!req.body.product) return res.status(422).json({ error: [ { message: 'Product ID is required' } ] });

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId }).populate({
      path: 'products.product',
      populate: [ 'image', 'images' ]
    });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse has not been found' } ] });

    const foundProductInWarehouse = foundWarehouse.products.find(productInWarehouse => productInWarehouse.product.image && productInWarehouse.product._id.toString() === req.body.product.toString());
    if (!foundProductInWarehouse) return res.status(404).json({ error: [ { message: 'Product has not been found in Warehouse' } ] });

    const filteredAddin = foundProductInWarehouse.wildberries.category.addin.filter(attribute => attribute.params && attribute.params.length > 0);
    const filteredNomenclatureVariationAddin = foundProductInWarehouse.wildberries.category.nomenclature.variation.addin.filter(attribute => attribute.params && attribute.params.length > 0);
    const filteredNomenclatureAddin = foundProductInWarehouse.wildberries.category.nomenclature.addin.filter(attribute => attribute.params && attribute.params.length > 0);

    const addin = getAddinArray(filteredAddin);
    const nomenclatureVariationAddin = getAddinArray(filteredNomenclatureVariationAddin);
    const nomenclatureAddin = getAddinArray(filteredNomenclatureAddin);

    const productPayload = {
      id: '1',
      jsonrpc: "2.0",
      params: {
        card: {
          countryProduction: "Россия",
          object: foundProductInWarehouse.wildberries.category.name,
          supplierVendorCode: foundProductInWarehouse.product.sku,
          addin: addin,
          nomenclatures: [
            {
              vendorCode: foundProductInWarehouse.product.sku,
              variations: [
                {
                  barcode: foundProductInWarehouse.product.barcode,
                  addin: [
                    {
                      type: "Розничная цена",
                      params: [
                        {
                          count: foundProductInWarehouse.price
                        }
                      ]
                    },
                    ...nomenclatureVariationAddin
                  ],
                }
              ],
              addin: [
                {
                  type: "Фото",
                  params: []
                },
                {
                  type: "Фото360",
                  params: []
                },
                {
                  type: "Видео",
                  params: []
                },
                ...nomenclatureAddin
              ]
            }
          ]
        }
      }
    };

    const createdRegistryForId = await Registry.create({
      type: 'wildberries',
      title: 'product-create-id',
      fields: {
        product: foundProductInWarehouse.product.sku
      }
    });

    productPayload.id = createdRegistryForId._id.toString();

    const response = await product.create(productPayload);

    const createdRegistry = await Registry.create({
      type: 'wildberries',
      title: 'product-create',
      fields: {
        taskId: response.id,
        status: 'created',
        warehouse: foundWarehouse._id,
        product: productPayload
      }
    });

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