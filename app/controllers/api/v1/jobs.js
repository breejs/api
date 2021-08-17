const _ = require('lodash');
const Boom = require('@hapi/boom');

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

async function add(ctx) {
  const { bree } = ctx;
  const { body } = ctx.request;

  // initial job length for return
  const origLength = bree.config.jobs.length;

  try {
    bree.add(body.jobs);
  } catch (err) {
    return ctx.throw(Boom.badData(err));
  }

  const jobs = bree.config.jobs.slice(origLength - 1);

  if (body.start) {
    for (const job of jobs) {
      bree.start(job.name);
    }
  }

  ctx.body = { jobs };
}

module.exports = { get, add };
