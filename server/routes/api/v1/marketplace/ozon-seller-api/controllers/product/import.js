const Warehouse = require(__basedir + '/server/models/warehouse');
const Registry = require(__basedir + '/server/models/registry');
const { productImport } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');
const { getConfig } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');

module.exports = async (req, res) => {
  if (!req.body.warehouseId) return res.status(422).json({ error: [ { message: 'Warehouse ID is required' } ] });
  if (!req.body.products || !Array.isArray(req.body.products)) return res.status(422).json({ error: [ { message: 'Products IDs are required' } ] });
  const config = getConfig();

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: req.body.warehouseId }).populate({
      path: 'products.product',
      populate: [ 'image', 'images' ]
    });
    if (!foundWarehouse) return res.status(404).json({ error: [ { message: 'Warehouse has not been found' } ] });

    const productsPayload = {
      items: []
    }

    foundWarehouse.products = foundWarehouse.products.filter(productInWarehouse => productInWarehouse.product.image && req.body.products.includes(productInWarehouse.product._id.toString()));

    productsPayload.items = foundWarehouse.products.map(productInWarehouse => {
      productInWarehouse.product.images = productInWarehouse.product.images.filter(image => image._id.toString() !== productInWarehouse.product.image._id.toString());

      return {
        barcode: productInWarehouse.product.barcode,
        category_id: productInWarehouse.ozon.categoryId,
        color_image: '',
        complex_attributes: [],
        width: productInWarehouse.product.dimensions.width,
        height: productInWarehouse.product.dimensions.height,
        depth: productInWarehouse.product.dimensions.depth,
        dimension_unit: 'mm',
        images: productInWarehouse.product.images.map(image => `${config.host}/upload/${image.file}-mp.jpg`),
        images360: [],
        name: productInWarehouse.product.title,
        offer_id: productInWarehouse.product.sku,
        pdf_list: [],
        old_price: '0',
        premium_price: '0',
        price: productInWarehouse.price.toString(),
        primary_image: `${config.host}/upload/${productInWarehouse.product.image.file}-mp.jpg`,
        vat: '0',
        weight: productInWarehouse.product.weight,
        weight_unit: 'g',
        attributes: productInWarehouse.ozon.attributes
      }
    });

    const response = await productImport(productsPayload);

    if (response.result?.task_id) {
      const createdRegistry = await Registry.create({
        type: 'ozon',
        title: 'product-import',
        fields: {
          taskId: response.result.task_id,
          status: 'created',
          warehouse: foundWarehouse._id,
          products: productsPayload.items
        }
      });
    }

    res.status(200).json(response.result);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while import products to OZON Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while import products to OZON Seller API' } ] });
  }
}