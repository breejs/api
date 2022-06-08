const Router = require('@koa/router');

const api = require('../../../app/controllers/api');
const config = require('../../../config');

const router = new Router({
  prefix: '/v1'
});

if (config.env === 'test') {
  router.get('/test', api.v1.test);
}

router.get('/config', api.v1.config.get);

router.get('/jobs', api.v1.jobs.get);
router.post('/jobs', api.v1.jobs.add);

router.use(api.v1.control.checkJobName);

router.post('/start', api.v1.control.start);
router.post('/start/:jobName', api.v1.control.start);

router.post('/stop', api.v1.control.stop);
router.post('/stop/:jobName', api.v1.control.stop);

router.post('/run/:jobName', api.v1.control.run);

router.post('/restart', api.v1.control.restart);
router.post('/restart/:jobName', api.v1.control.restart);

router.get('/sse/:token', api.v1.sse.connect);

module.exports = router;
