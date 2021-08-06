const api = require('./api');
const proxy = require('./proxy');

const config = require('./config');

function plugin(opts, Bree) {
  opts = {
    port: config.port,
    ...opts
  };

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
  proxy,
  plugin
};
