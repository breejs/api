const config = require('./config');
const jobs = require('./jobs');

const test = (ctx) => {
  ctx.body = { breeExists: Boolean(ctx.bree) };
};

module.exports = { config, test, jobs };
