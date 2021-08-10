const _ = require('lodash');

async function get(ctx) {
  const { bree } = ctx;

  let body = bree.config.jobs;

  body = body.map((j) => {
    j.status = 'done';

    if (bree.workers[j.name]) j.status = 'active';
    else if (bree.timeouts[j.name]) j.status = 'delayed';
    else if (bree.intervals[j.name]) j.status = 'waiting';

    return j;
  });

  body = _.filter(body, ctx.query);

  ctx.body = body;
}

module.exports = { get };
