const test = require('ava');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const config = require('../../../config');

const utils = require('../../utils');

const rootUrl = '/v1/config';

test.before(async (t) => {
  await utils.setupApiServer(t);
  t.context.token = jwt.sign({}, config.jwt.secret);

  t.context.api = t.context.api.auth(t.context.token, { type: 'bearer' });
});

test('GET > successfully', async (t) => {
  const { api, bree } = t.context;

  const res = await api.get(rootUrl);

  t.is(res.status, 200);
  t.like(res.body, _.omit(bree.config, 'logger'));
});
