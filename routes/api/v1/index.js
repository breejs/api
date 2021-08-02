const Router = require('@koa/router');

const policies = require('../../../helpers/policies');
const api = require('../../../app/controllers/api');
const config = require('../../../config');

const router = new Router({
  prefix: '/v1'
});

if (config.env === 'test') {
  router.get('/test', api.v1.test);
}

router.post('/log', api.v1.log.checkToken, api.v1.log.parseLog);
router.post('/account', api.v1.users.create);
router.get('/account', policies.ensureApiToken, api.v1.users.retrieve);
router.put('/account', policies.ensureApiToken, api.v1.users.update);

router.get('/config', api.v1.config.get);

module.exports = router;
