const test = require('ava');

const { json } = require('../../config/utilities');

test('returns JSON with 2 spaces', (t) => {
  t.snapshot(json({ ok: 'hey' }));
});
