const test = require('ava');

const utils = require('../../utils');

test.before(async (t) => {
  await utils.setupApiServer(t, {}, { jwt: false });
});

test('works when no creds are presented', async (t) => {
  const { api } = t.context;
  const res = await api.get('/v1/test');

  t.is(res.status, 200);
});
