const Boom = require('@hapi/boom');

async function checkJobName(ctx, next) {
  const { jobName } = ctx.params;

  if (jobName && !ctx.bree.config.jobs.some((j) => j.name === jobName))
    return ctx.throw(Boom.badData('Job name does not exist'));

  return next();
}

async function addJobNameToQuery(ctx, next) {
  const { jobName } = ctx.params;

  ctx.query = { name: jobName };

  return next();
}

async function start(ctx, next) {
  const { jobName } = ctx.params;

  await ctx.bree.start(jobName);

  ctx.body = {};

  return next();
}

async function stop(ctx, next) {
  const { jobName } = ctx.params;

  await ctx.bree.stop(jobName);

  ctx.body = {};

  return next();
}

async function run(ctx, next) {
  const { jobName } = ctx.params;

  await ctx.bree.run(jobName);

  ctx.body = {};

  return next();
}

async function restart(ctx, next) {
  const { jobName } = ctx.params;

  await ctx.bree.stop(jobName);
  await ctx.bree.start(jobName);

  ctx.body = {};

  return next();
}

module.exports = { checkJobName, addJobNameToQuery, start, stop, run, restart };
