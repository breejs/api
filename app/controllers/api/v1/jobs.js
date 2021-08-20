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

  if (body.copy) {
    if (!_.isArray(body.jobs)) body.jobs = [body.jobs];

    const newJobs = [];

    for (const job of body.jobs) {
      const origJob = bree.config.jobs.find((j) => j.name === job.name);

      if (!origJob)
        return ctx.throw(Boom.badData('Name does not exist in jobs'));

      const newJob = _.clone(origJob);
      newJob.name = origJob.name + '(1)';

      if (origJob.name.endsWith(')')) {
        newJob.name = origJob.name.replace(
          /(^.*)(\((\d+)\))(?=$)/i,
          (_match, subName, _p2, num) =>
            `${subName}(${Number.parseInt(num, 10) + 1})`
        );
      }

      newJobs.push(newJob);
    }

    body.jobs = newJobs;
  }

  let jobs;

  try {
    jobs = bree.add(body.jobs);
  } catch (err) {
    return ctx.throw(Boom.badData(err));
  }

  if (body.start) {
    for (const job of jobs) {
      bree.start(job.name);
    }
  }

  ctx.body = { jobs };
}

module.exports = { get, add };
