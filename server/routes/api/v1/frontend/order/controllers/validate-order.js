const Order = require('../../../../../../models/order');
const Customer = require('../../../../../../models/customer');
const OrderStatus = require('../../../../../../models/order-status');
const Warehouse = require('../../../../../../models/warehouse');
const validateProductsForWarehouse = require('../../warehouse/controllers/validate-products-for-warehouse');
const logger = require('../../../../../../logger');

module.exports = async function validateOrder(order) {
  let validated = {
    order: {},
    errors: []
  }

  let validatedOrder = true;

  try {
    const orderId = await getNextOrderId();
    validated.order.orderId = orderId;
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0002',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка получения следующего номера заказа',
      path: __filename
    });

    validated.errors.push({ code: 1, message: 'Ошибка получения следующего номера заказа', order });
    validatedOrder = false;
  }
  
  try {
    const foundCustomer = await Customer.findOne({ _id: order.customer });

    if (!foundCustomer) {
      validated.errors.push({ code: 2, message: 'Клиент не найден', order });
      validatedOrder = false;
    } else {
      validated.order.customer = foundCustomer._id;
    }
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0003',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка обработки клиента при оформлении заказа',
      path: __filename
    });

    validated.errors.push({ code: 3, message: 'Ошибка обработки клиента при оформлении заказа', order });
    validatedOrder = false;
  }

  try {
    const foundOrderStatus = await OrderStatus.findOne({ _id: order.status });

    if (!foundOrderStatus) {
      validated.errors.push({ code: 4, message: 'Переданный статус заказа не найден', order });
      validatedOrder = false;
    } else {
      validated.order.status = foundOrderStatus._id;
    }
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0004',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка обработки статуса при оформлении заказа',
      path: __filename
    });

    validated.errors.push({ code: 5, message: 'Ошибка обработки статуса при оформлении заказа', order });
    validatedOrder = false;
  }

  try {
    const foundWarehouse = await Warehouse.findOne({ _id: order.warehouse });

    if (!foundWarehouse) {
      validated.errors.push({ code: 6, message: 'Склад не найден', order });
      validatedOrder = false;
    } else {
      validated.order.warehouse = foundWarehouse._id;
    }
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0005',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка обработки склада при оформлении заказа',
      path: __filename
    });

    validated.errors.push({ code: 7, message: 'Ошибка обработки склада при оформлении заказа', order });
    validatedOrder = false;
  }

  try {
    const validatedProducts = await validateProductsForWarehouse(order.products);

    if (validatedProducts.errors.length > 0) {
      validate.errors.push(validatedProducts.errors);
      validatedOrder = false;
    } else {
      validated.order.products = validatedProducts.products;
    }
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'O0006',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Ошибка обработки товаров при оформлении заказа',
      path: __filename
    });

    validated.errors.push({ code: 8, message: 'Ошибка обработки товаров при оформлении заказа', order });
    validatedOrder = false;
  }

  if (!validatedOrder) validated.order = {}

  return validated;
}

async function getNextOrderId() {
  const lastOrder = await Order.findOne().sort('-orderId');
  if (!lastOrder) return 1;
  return lastOrder.orderId + 1;
}