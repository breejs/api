const test = require('ava');
const jwt = require('jsonwebtoken');

const config = require('../../config');

const utils = require('../utils');

test.before(async (t) => {
  await utils.setupApiServer(t);
  t.context.token = jwt.sign({}, config.jwt.secret);
});

test('fails when no creds are presented', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/test');
  t.is(401, res.status);
});

test('works with jwt auth', async (t) => {
  const { api, token } = t.context;
  const res = await api.get('/v1/test').auth(token, { type: 'bearer' });

  t.is(200, res.status);
});

test('has bree in context', async (t) => {
  const { api, token } = t.context;
  const res = await api.get('/v1/test').auth(token, { type: 'bearer' });

  t.is(200, res.status);
  t.is(Boolean(res.body.breeExists), true);
});
