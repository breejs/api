const path = require('path');
const { once } = require('events');
const test = require('ava');
const jwt = require('jsonwebtoken');
const delay = require('delay');

const config = require('../../../../config');

const utils = require('../../../utils');

const rootUrl = '/v1/jobs';

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

test.serial('successfully', async (t) => {
  const { api, bree } = t.context;

  // wait until the first worker finishes so our expect is correctly timed
  await once(bree, 'worker deleted');

  const res = await api.get(rootUrl);

  t.is(res.status, 200);

  t.deepEqual(
    res.body,
    bree.config.jobs.map((j) => {
      j.status = j.name;

      return j;
    })
  );
});

test('successfully filter by name', async (t) => {
  const { api, bree } = t.context;

  const res = await api.get(`${rootUrl}?name=done`);

  t.is(res.status, 200);

  t.deepEqual(
    res.body,
    bree.config.jobs.filter((j) => j.name === 'done')
  );
});

test.serial('successfully filter by status', async (t) => {
  const { api, bree } = t.context;

  await delay(200);

  const res = await api.get(`${rootUrl}?status=done`);

  t.is(res.status, 200);

  t.deepEqual(
    res.body,
    bree.config.jobs.filter((j) => j.name === 'done')
  );
});
