async function connect(ctx) {
  if (ctx.sse) {
    // send bree events over sse
    for (const event of ['worker created', 'worker deleted']) {
      ctx.bree.on(event, (name) => {
        ctx.sse.send({ event, data: name });
      });
    }

    ctx.sse.on('close', () => {
      ctx.logger.error('SSE closed');
    });
  }
}

module.exports = { connect };
