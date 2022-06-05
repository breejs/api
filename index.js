const API = require('@ladjs/api');
const jwt = require('koa-jwt');

const api = require('./api');
const apiConfig = require('./config/api');

const config = require('./config');

function plugin(opts, Bree) {
  opts = {
    port: config.port,
    jwt: config.jwt,
    ...opts
  };

  const api = new API({
    ...apiConfig,
    port: opts.port,
    jwt: opts.jwt,
    hookBeforeRoutes(app) {
      app.use(jwt(opts.jwt));
    }
  });

  const oldInit = Bree.prototype.init;

  Bree.prototype.init = function () {
    oldInit.bind(this)();

    // assign bree to the context
    api.app.context.bree = this;

    this.api = api;

    this.api.listen(opts.port).catch((err) => {
      throw err;
    });
  };
}

module.exports = {
  api,
  plugin
};
