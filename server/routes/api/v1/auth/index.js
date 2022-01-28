const authenticate = require('./controllers/authenticate');
const register = require('./controllers/register');
const middleware = require('./middleware');

module.exports = {
  authenticate,
  register,
  middleware
}