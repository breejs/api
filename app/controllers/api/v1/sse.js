async function connect(ctx) {
  if (ctx.sse) {
    // likely not the best way to do this
    // TODO: fork koa-sse and move this into the ping interval
    // runs every 60s
    const interval = setInterval(() => {
      const connected = ctx.sse.send({
        event: 'status',
        data: isActive(ctx)
      });

      console.log('connected');

      // clear the interval if the client is disconnected
      if (!connected) {
        clearInterval(interval);
      }
    }, 60_000);
    ctx.sse.send({
      event: 'status',
      data: isActive(ctx)
    });

    // send bree events over sse
    for (const event of ['worker created', 'worker deleted']) {
      ctx.bree.on(event, (name) => {
        ctx.sse.send({ event, data: name });
      });
    }

    ctx.bree.on('worker message', (data) => {
      ctx.sse.send({ event: 'worker message', data: JSON.stringify(data) });
    });

    ctx.bree.on('worker error', (data) => {
      ctx.sse.send({ event: 'worker error', data: JSON.stringify(data) });
    });

    ctx.sse.on('close', () => {
      ctx.logger.error('SSE closed');

      clearInterval(interval);
    });
  }
}

function isActive(ctx) {
  return Boolean(
    ctx.bree.workers.size > 0 ||
      ctx.bree.timeouts.size > 0 ||
      ctx.bree.intervals.size > 0
  );
}

module.exports = { connect };
