const sharedConfig = require('@ladjs/shared-config');
const jwt = require('koa-jwt');
const sse = require('koa-sse-stream');

const logger = require('../helpers/logger');
const routes = require('../routes');
const config = require('../config');

module.exports = (opts = {}) => {
  const sseMiddleware = sse({ ...config.sse, ...opts.sse });
  const jwtMiddleware = jwt({
    ...config.jwt,
    ...opts.jwt,
    getToken(ctx, _) {
      // pull token off of url if it is the sse endpoint
      if (ctx.url.indexOf('/v1/sse') === 0) {
        const splitUrl = ctx.url.split('/');

        if (splitUrl.length === 4) {
          return splitUrl[3];
        }
      }

      return null;
    }
  });

  return {
    ...sharedConfig('API'),
    port: config.port,
    ...opts,
    routes: routes.api,
    logger,
    hookBeforeRoutes(app) {
      app.use((ctx, next) => {
        // return early if jwt is set to false
        if (!opts.jwt && typeof opts.jwt === 'boolean') {
          return next();
        }

        return jwtMiddleware(ctx, next);
      });

      app.use((ctx, next) => {
        // only do this on sse route
        if (ctx.url.indexOf('/v1/sse') === 0) {
          return sseMiddleware(ctx, next);
        }

        return next();
      });
    }
  };
};
