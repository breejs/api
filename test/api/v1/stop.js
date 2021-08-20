const test = require('ava');
const jwt = require('jsonwebtoken');
const path = require('path');
const delay = require('delay');

const config = require('../../../config');

const utils = require('../../utils');

const rootUrl = '/v1/stop';

test.before(async (t) => {
  await utils.setupApiServer(t, {
    jobs: [
      { name: 'done', path: path.join(utils.root, 'basic.js') },
      {
        name: 'delayed',
        path: path.join(utils.root, 'basic.js'),
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

  t.context.bree.start();
});

test.serial('successfully stop named job', async (t) => {
  const { api, bree } = t.context;

  const res = await api.post(`${rootUrl}/active`).send({});

  t.is(res.status, 200);

  await delay(200);

  t.falsy(bree.workers.active);
});

test.serial('successfully stop all jobs', async (t) => {
  const { bree, api } = t.context;

  t.not(bree.workers.length, 0);
  t.not(bree.timeouts.length, 0);
  t.not(bree.intervals.length, 0);

  const res = await api.post(rootUrl).send({});

  t.is(res.status, 200);

  t.is(bree.workers.length, 0);
  t.is(bree.timeouts.length, 0);
  t.is(bree.intervals.length, 0);
});
