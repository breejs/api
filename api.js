// eslint-disable-next-line import/no-unassigned-import
require('./config/env');

const API = require('@ladjs/api');
const Graceful = require('@ladjs/graceful');
const ip = require('ip');

const logger = require('./helpers/logger');
const apiConfig = require('./config/api');

const api = new API(apiConfig);

if (!module.parent) {
  const graceful = new Graceful({
    servers: [api],
    redisClients: [api.client],
    logger
  });
  graceful.listen();

  (async () => {
    try {
      await api.listen(api.config.port);
      if (process.send) process.send('ready');
      const { port } = api.server.address();
      logger.info(
        `Lad API server listening on ${port} (LAN: ${ip.address()}:${port})`
      );
    } catch (error) {
      logger.error(error);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }
  })();
}

module.exports = api;
