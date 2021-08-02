const test = require('ava');

const config = require('../../config');
const phrases = require('../../config/phrases');

const utils = require('../utils');

test.beforeEach(async (t) => {
  await utils.setupApiServer(t);
  t.context.token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVGF5bG9yIFNjaGxleSIsImlhdCI6MTYyNzY4MDY1OCwiZXhwIjoxNjI3Njg0MjU4fQ.CA0sTEhWSSiJLHxNy8geWXf8b16mYDLb4kKI_tiI6fU';
});

test('fails when no creds are presented', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/test');
  t.is(401, res.status);
});

test('works with jwt auth', async (t) => {
  const { api, token } = t.context;
  const res = await api.get('/v1/test').auth(token, { type: 'bearer' });

  t.log(res);
  t.is(200, res.status);
});
