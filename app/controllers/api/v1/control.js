const Boom = require('@hapi/boom');

async function checkJobName(ctx, next) {
  const { jobName } = ctx.params;

  if (jobName && !ctx.bree.config.jobs.some((j) => j.name === jobName))
    return Boom.badData('Job name does not exist');

  return next();
}

async function start(ctx) {
  const { jobName } = ctx.params;

  ctx.bree.start(jobName);

  ctx.body = {};
}

module.exports = { checkJobName, start };
