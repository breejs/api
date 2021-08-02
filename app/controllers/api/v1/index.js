const log = require('./log');
const users = require('./users');
const config = require('./config');

const test = (ctx) => {
  console.log('jungle');
  console.log(ctx);
  ctx.body = 'it worked';
};

module.exports = { log, users, config, test };
