const config = require('./config');
const jobs = require('./jobs');
const control = require('./control');
const sse = require('./sse');

const test = (ctx) => {
  ctx.body = { breeExists: Boolean(ctx.bree) };
};

module.exports = { config, test, jobs, control, sse };
