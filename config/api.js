const sharedConfig = require('@ladjs/shared-config');
const jwt = require('koa-jwt');

const logger = require('../helpers/logger');
const routes = require('../routes');
const config = require('../config');

module.exports = {
  ...sharedConfig('API'),
  routes: routes.api,
  logger,
  hookBeforeRoutes(app) {
    app.use(jwt(config.jwt));
  }
};
