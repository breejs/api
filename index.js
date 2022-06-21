const API = require('@ladjs/api');

const api = require('./api');
const apiConfig = require('./config/api');

const config = require('./config');

function plugin(opts, Bree) {
  opts = {
    port: config.port,
    jwt: config.jwt,
    sse: config.sse,
    ...opts
  };

  const api = new API(apiConfig(opts));

  const oldInit = Bree.prototype.init;

  Bree.prototype.init = async function () {
    await oldInit.bind(this)();

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
