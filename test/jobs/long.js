const { parentPort } = require('worker_threads');

setTimeout(() => {
  console.log('hello');
}, 10000);

if (parentPort) {
  parentPort.on('message', (message) => {
    if (message === 'error') throw new Error('oops');
    if (message === 'cancel') {
      parentPort.postMessage('cancelled');
      return;
    }

    parentPort.postMessage(message);
    process.exit(0);
  });
}
