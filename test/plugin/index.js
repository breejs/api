const test = require('ava');

const { baseConfig } = require('../utils');

test.beforeEach((t) => {
  t.context.Bree = require('bree');
  t.context.plugin = require('../..').plugin;
});

test('api does not exist on bree constructor', (t) => {
  const { Bree, plugin } = t.context;

  Bree.extend(plugin);

  t.is(typeof Bree.api, 'undefined');
});

test('api does exist on bree instance', (t) => {
  const { Bree, plugin } = t.context;

  Bree.extend(plugin);

  const bree = new Bree(baseConfig);

  t.log(bree);
  // just to make sure this works correctly
  t.is(typeof bree.start, 'function');
  t.log(bree.api);
  t.is(typeof bree.api, 'object');
});
