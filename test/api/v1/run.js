const path = require('path');
const test = require('ava');
const jwt = require('jsonwebtoken');
const delay = require('delay');

const config = require('../../../config');

const utils = require('../../utils');

const rootUrl = '/v1/run';

test.before(async (t) => {
  await utils.setupApiServer(t, {
    jobs: [
      { name: 'done', path: path.join(utils.root, 'basic.js') },
      {
        name: 'delayed',
        path: path.join(utils.root, 'long.js'),
        timeout: 1000
      },
      {
        name: 'waiting',
        path: path.join(utils.root, 'basic.js'),
        interval: 1000
      },
      {
        name: 'active',
        path: path.join(utils.root, 'long.js')
      }
    ]
  });
  t.context.token = jwt.sign({}, config.jwt.secret);

  t.context.api = t.context.api.auth(t.context.token, { type: 'bearer' });
});

test('successfully run named job', async (t) => {
  const { api, bree } = t.context;

  const res = await api.post(`${rootUrl}/delayed`).send({});

  t.is(res.status, 200);

  await delay(200);

  t.falsy(bree.workers.has('active'));
  t.falsy(bree.intervals.has('waiting'));
  t.falsy(bree.timeouts.has('delayed'));
  t.truthy(bree.workers.has('delayed'));
});
