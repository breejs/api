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
    // hook error handler and message handler
    const oldErrorHandler = this.config.errorHandler;
    const oldWorkerMessageHandler = this.config.workerMessageHandler;

    this.config.errorHandler = function (error, data) {
      if (oldErrorHandler) {
        oldErrorHandler.call(this, error, data);
      }

      this.emit('worker error', {
        error,
        name: data?.name,
        data: data ? JSON.stringify(data) : undefined
      });
    };

    this.config.errorHandler = this.config.errorHandler.bind(this);

    this.config.workerMessageHandler = function (data) {
      if (oldWorkerMessageHandler) {
        oldWorkerMessageHandler.call(this, data);
      }

      this.emit('worker message', data);
    };

    this.config.workerMessageHandler =
      this.config.workerMessageHandler.bind(this);

    await oldInit.call(this);

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
