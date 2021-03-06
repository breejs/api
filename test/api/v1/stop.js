const path = require('path');
const test = require('ava');
const jwt = require('jsonwebtoken');
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

  await t.context.bree.start();

  await delay(200);
});

test.serial('successfully stop named job', async (t) => {
  const { api, bree } = t.context;

  t.truthy(bree.workers.has('active'));

  const res = await api.post(`${rootUrl}/active`).send({});

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.like(res.body[0], { name: 'active' });

  t.falsy(bree.workers.has('active'));
});

test.serial('successfully stop all jobs', async (t) => {
  const { bree, api } = t.context;

  t.not(bree.timeouts.size, 0);
  t.not(bree.intervals.size, 0);

  const res = await api.post(rootUrl).send({});

  t.is(res.status, 200);

  t.is(bree.workers.size, 0);
  t.is(bree.timeouts.size, 0);
  t.is(bree.intervals.size, 0);
});
