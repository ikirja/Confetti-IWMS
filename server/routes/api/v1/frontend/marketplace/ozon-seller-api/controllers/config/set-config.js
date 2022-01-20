const { setConfig } = require ('../../../../../../../../lib/marketplace/ozon-seller-api');

function validateConfig(config) {
  const validated = {
    config: {},
    errors: []
  }

  let validatedConfig = true;

  if (!config.url || typeof config.url !== 'string') {
    validated.errors.push({ code: 1, message: 'OZON Seller API: url обязательный параметр', config });
    validatedConfig = false;
  }

  if (!config.clientId || typeof config.clientId !== 'string') {
    validated.errors.push({ code: 2, message: 'OZON Seller API: clientId обязательный параметр', config });
    validatedConfig = false;
  }

  if (!config.apiKey || typeof config.apiKey !== 'string') {
    validated.errors.push({ code: 3, message: 'OZON Seller API: apiKey обязателен', config });
    validatedConfig = false;
  }

  if (validatedConfig) validated.config = config;
  return validated;
}

module.exports = async (req, res) => {
  try {
    const validated = validateConfig(req.body);
    if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

    setConfig(validated.config);
    res.status(200).json(validated.config);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Произошла ошибка получения настроек маркетплейса OZON Seller API' } ] });
  }
}