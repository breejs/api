const log = require('./log');
const users = require('./users');
const config = require('./config');

const test = (ctx) => {
  ctx.body = { breeExists: Boolean(ctx.bree) };
};

module.exports = { log, users, config, test };
