const test = require('ava');
const Bree = require('bree');

const { plugin } = require('../..');
const { baseConfig } = require('../utils');

test('can modify options', (t) => {
  t.not(plugin.$i, true);

  Bree.extend(plugin, {
    port: 3000,
    jwt: { secret: 'thisisasecret' },
    sse: { maxClients: 100 }
  });

  const bree = new Bree(baseConfig);

  t.is(bree.api.config.port, 3000);
  t.is(bree.api.config.jwt.secret, 'thisisasecret');
  t.is(bree.api.config.sse.maxClients, 100);
});
