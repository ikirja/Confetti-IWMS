const { productImportInfo } = require (__basedir + '/server/lib/marketplace/ozon-seller-api');

module.exports = async (req, res) => {
  if (!req.body.taskId) return res.status(422).json({ error: [ { message: 'Task ID is required' } ] });

  try {
    const response = await productImportInfo(req.body.taskId);
    res.status(200).json(response);
  } catch (err) {
    logger.createLog({
      title: 'Ошибка',
      errorCode: 'P0001',
      data: JSON.stringify(err) ? JSON.stringify(err) : '',
      message: 'Error has occured while checking task_id through OZON Seller API',
      path: __filename
    });

    res.status(400).json({ error: [ { message: 'Error has occured while checking task_id through OZON Seller API' } ] });
  }
}