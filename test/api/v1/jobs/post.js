const test = require('ava');
const jwt = require('jsonwebtoken');
const path = require('path');
const delay = require('delay');

const config = require('../../../../config');

const utils = require('../../../utils');

const rootUrl = '/v1/jobs';

test.before(async (t) => {
  await utils.setupApiServer(t, {
    jobs: [{ name: 'done', path: path.join(utils.root, 'basic.js') }]
  });
  t.context.token = jwt.sign({}, config.jwt.secret);

  t.context.api = t.context.api.auth(t.context.token, { type: 'bearer' });

  t.context.bree.start();
});

test('successfully add one job', async (t) => {
  const { bree, api } = t.context;

  const jobs = {
    name: 'successfulOne',
    path: path.join(utils.root, 'long.js')
  };

  const res = await api.post(rootUrl).send({
    jobs
  });

  t.is(res.status, 200);

  t.truthy(bree.config.jobs.find((j) => j.name === 'successfulOne'));
  // ensure job hasn't been started
  t.falsy(bree.workers.successfulOne);
});

test('successfully add multiple jobs', async (t) => {
  const { bree, api } = t.context;

  const jobs = [
    {
      name: 'array1',
      path: path.join(utils.root, 'long.js')
    },
    {
      name: 'array2',
      path: path.join(utils.root, 'long.js')
    },
    {
      name: 'array3',
      path: path.join(utils.root, 'long.js')
    }
  ];

  const res = await api.post(rootUrl).send({
    jobs
  });

  t.is(res.status, 200);

  t.truthy(bree.config.jobs.find((j) => j.name === 'array1'));
  t.truthy(bree.config.jobs.find((j) => j.name === 'array2'));
  t.truthy(bree.config.jobs.find((j) => j.name === 'array3'));
  // ensure job hasn't been started
  t.falsy(bree.workers.array1);
  t.falsy(bree.workers.array2);
  t.falsy(bree.workers.array3);
});

test('fails if data is bad', async (t) => {
  const { api } = t.context;

  const jobs = {};

  const res = await api.post(rootUrl).send({
    jobs
  });

  t.is(res.status, 422);
});
