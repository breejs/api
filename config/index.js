const path = require('path');

const pkg = require('../package');
const env = require('./env');
const loggerConfig = require('./logger');

const config = {
  // package.json
  pkg,

  // server
  env: env.NODE_ENV,
  urls: {
    api: env.API_URL
  },

  // app
  supportRequestMaxLength: env.SUPPORT_REQUEST_MAX_LENGTH,
  logger: loggerConfig,
  appName: env.APP_NAME,
  appColor: env.APP_COLOR,
  twitter: env.TWITTER,
  port: 62_893,

  // build directory
  buildBase: 'build',

  // jwt options
  jwt: {
    secret: env.JWT_SECRET
  },

  // store IP address
  // <https://github.com/ladjs/store-ip-address>
  storeIPAddress: {
    ip: 'ip',
    lastIps: 'last_ips'
  },

  // field name for a user's last locale
  // (this gets re-used by email-templates and @ladjs/i18n; see below)
  lastLocaleField: 'last_locale'
};

// set build dir based off build base dir name
config.buildDir = path.join(__dirname, '..', config.buildBase);

module.exports = config;
