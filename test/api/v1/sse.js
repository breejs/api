const path = require('path');
const { once } = require('events');
const test = require('ava');
const jwt = require('jsonwebtoken');

const config = require('../../../config');

const utils = require('../../utils');

const rootUrl = '/v1/sse';

test.before(async (t) => {
  await utils.setupApiServer(t, {
    jobs: [
      {
        name: 'delayed',
        path: path.join(utils.root, 'basic.js'),
        interval: 1000
      }
    ]
  });
  t.context.token = jwt.sign({}, config.jwt.secret);

  t.context.api = t.context.api.auth(t.context.token, { type: 'bearer' });

  await t.context.bree.start();
});

test('successfully connect to sse', async (t) => {
  const es = utils.setupEventSource(t, rootUrl);

  await once(es, 'open');

  t.pass();
});

const eventsMacro = test.macro({
  async exec(t, event) {
    const es = utils.setupEventSource(t, rootUrl);

    const [res] = await once(es, event);

    t.is(res.type, event);
    t.is(res.data, 'delayed');
  },
  title(_, event) {
    return `successfully listen to "${event}" messages`;
  }
});

test(eventsMacro, 'worker created');
test(eventsMacro, 'worker deleted');
