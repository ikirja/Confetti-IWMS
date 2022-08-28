const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/server/models/registry');
const { product } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api');
const logger = require(__basedir + '/server/lib/logger');
const sendProductPhotos = require('./send-product-photos');
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
    if (!foundProductInWarehouse.wildberries.productId) return res.status(422).json({ error: [ { message: 'Product has not been created in Wildberries Seller API' } ] });

    const wbProduct = await product.cardByImtId(foundProductInWarehouse.wildberries.productId);
    if (!wbProduct.result && !wbProduct.result.card) return res.status(404).json({ error: [ { message: 'Product has not been found in Wildberries Seller API' } ] });

    const WB_CARD = wbProduct.result.card;

    const filteredAddin = foundProductInWarehouse.wildberries.category.addin.filter(attribute => attribute.params && attribute.params.length > 0);
    const filteredNomenclatureVariationAddin = foundProductInWarehouse.wildberries.category.nomenclature.variation.addin.filter(attribute => attribute.params && attribute.params.length > 0);
    // TODO: Надо также добавить характеристики nomenclature.addin, но там надо добавлять ТОЛЬКО НОВЫЕ!

    const addin = getAddinArray(filteredAddin);
    const nomenclatureVariationAddin = getAddinArray(filteredNomenclatureVariationAddin);

    const foundNameAddinIndex = addin.findIndex(addin => addin.type === 'Наименование');
    if (foundNameAddinIndex === -1) {
      addin.push({
        type: 'Наименование',
        params: [
          {
            value: foundProductInWarehouse.product.title
          }
        ]
      })
    }

    const photos = await sendProductPhotos(foundProductInWarehouse);

    WB_CARD.object = foundProductInWarehouse.wildberries.category.name;
    WB_CARD.addin = addin;
    WB_CARD.nomenclatures[0].variations[0].addin = [
      {
        type: "Розничная цена",
        params: [
          {
            count: foundProductInWarehouse.price
          }
        ]
      },
      ...nomenclatureVariationAddin
    ];
    WB_CARD.nomenclatures[0].addin = [
      {
        type: "Фото",
        params: photos
      },
      {
        type: "Фото360",
        params: []
      },
      {
        type: "Видео",
        params: []
      }
    ];
    
    const productPayload = {
      id: '1',
      jsonrpc: "2.0",
      params: {
        card: WB_CARD
      }
    };

    const createdRegistryForId = await Registry.create({
      type: 'wildberries',
      title: 'product-update-id',
      fields: {
        product: foundProductInWarehouse.product.sku
      }
    });

    productPayload.id = createdRegistryForId._id.toString();

    const response = await product.update(productPayload);

    const createdRegistry = await Registry.create({
      type: 'wildberries',
      title: 'product-update',
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
      message: 'Error has occured while updating product in Wildberries Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while updating product in Wildberries Seller API' } ] });
  }
}