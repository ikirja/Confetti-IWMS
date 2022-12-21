const { config } = require (__basedir + '/server/lib/marketplace/wildberries-seller-api').v1;

function validateConfig(config) {
  const validated = {
    config: {},
    errors: []
  }

  let validatedConfig = true;

  if (!config.url || typeof config.url !== 'string') {
    validated.errors.push({ code: 1, message: 'Wildberries Seller API: url is required', config });
    validatedConfig = false;
  }

  if (!config.apiKey || typeof config.apiKey !== 'string') {
    validated.errors.push({ code: 3, message: 'Wildberries Seller API: apiKey is required', config });
    validatedConfig = false;
  }

  if (!config.host || typeof config.host !== 'string') {
    validated.errors.push({ code: 4, message: 'Wildberries Seller API: host is required', config });
    validatedConfig = false;
  }

  if (validatedConfig) validated.config = config;
  return validated;
}

module.exports = async (req, res) => {
  try {
    const validated = validateConfig(req.body);
    if (validated.errors.length > 0) return res.status(422).json({ error: validated.errors });

    config.set(validated.config);
    res.status(200).json(validated.config);
  } catch (err) {
    res.status(400).json({ error: [ { message: 'Error occured while saving Wildberries Seller API config' } ] });
  }
}