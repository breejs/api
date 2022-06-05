const Boom = require('@hapi/boom');

async function checkJobName(ctx, next) {
  const { jobName } = ctx.params;

  if (jobName && !ctx.bree.config.jobs.some((j) => j.name === jobName))
    return ctx.throw(Boom.badData('Job name does not exist'));

  return next();
}

async function start(ctx) {
  const { jobName } = ctx.params;

  ctx.bree.start(jobName);

  ctx.body = {};
}

async function stop(ctx) {
  const { jobName } = ctx.params;

  await ctx.bree.stop(jobName);

  ctx.body = {};
}

async function run(ctx) {
  const { jobName } = ctx.params;

  ctx.bree.run(jobName);

  ctx.body = {};
}

async function restart(ctx) {
  const { jobName } = ctx.params;

  await ctx.bree.stop(jobName);
  ctx.bree.start(jobName);

  ctx.body = {};
}

module.exports = { checkJobName, start, stop, run, restart };
