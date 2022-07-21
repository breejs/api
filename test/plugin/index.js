const test = require('ava');

const { baseConfig } = require('../utils');

test.before((t) => {
  t.context.Bree = require('bree');
  t.context.plugin = require('../..').plugin;

  t.context.Bree.extend(t.context.plugin);
});

test('api does not exist on bree constructor', (t) => {
  const { Bree } = t.context;

  t.is(typeof Bree.api, 'undefined');
});

test('api does exist on bree instance', async (t) => {
  const { Bree } = t.context;

  const bree = new Bree(baseConfig);
  await bree.init();

  t.log(bree);
  // just to make sure this works correctly
  t.is(typeof bree.start, 'function');
  t.log(bree.api);
  t.is(typeof bree.api, 'object');

  // options is set correctly by default
  t.is(bree.api.config.port, 62_893);
  t.is(bree.api.config.jwt.secret, 'secret');
});
