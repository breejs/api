async function get(ctx) {
  ctx.body = ctx.bree.config;
}

module.exports = { get };
