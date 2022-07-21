const path = require('path');
const test = require('ava');
const jwt = require('jsonwebtoken');
const delay = require('delay');

const config = require('../../../config');

const utils = require('../../utils');

const rootUrl = '/v1/restart';

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
});

test.serial('successfully restart all jobs', async (t) => {
  const { bree, api } = t.context;

  const res = await api.post(rootUrl).send({});

  t.is(res.status, 200);

  await delay(200);

  t.truthy(bree.workers.has('active'));
  t.truthy(bree.timeouts.has('delayed'));
  t.truthy(bree.intervals.has('waiting'));
});

test.serial('successfully restart active job', async (t) => {
  const { bree, api } = t.context;

  const res = await api.post(`${rootUrl}/active`).send({});

  t.is(res.status, 200);
  t.is(res.body.length, 1);
  t.like(res.body[0], { name: 'active' });

  await delay(200);

  t.truthy(bree.workers.has('active'));
});
