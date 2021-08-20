const test = require('ava');
const jwt = require('jsonwebtoken');
const path = require('path');
const delay = require('delay');

const config = require('../../../config');

const utils = require('../../utils');

const rootUrl = '/v1/start';

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

test.serial('successfully start all jobs', async (t) => {
  const { bree, api } = t.context;

  const res = await api.post(rootUrl).send({});

  t.is(res.status, 200);

  await delay(200);

  t.truthy(bree.workers.active);
  t.truthy(bree.timeouts.delayed);
  t.truthy(bree.intervals.waiting);
});

test.serial('successfully start named job', async (t) => {
  const { api, bree } = t.context;

  const jobs = [
    {
      name: 'immediate',
      path: path.join(utils.root, 'long.js')
    },
    {
      name: 'timeout',
      path: path.join(utils.root, 'long.js'),
      timeout: 2000
    }
  ];

  await api.post('/v1/jobs').send({
    jobs
  });

  const res = await api.post(`${rootUrl}/timeout`).send({});

  t.is(res.status, 200);

  await delay(200);

  t.falsy(bree.workers.immediate);
  t.truthy(bree.timeouts.timeout);
});
