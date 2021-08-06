async function get(ctx) {
  ctx.body = { breeExists: ctx.bree };
}

module.exports = { get };
