// Necessary utils for testing
// Librarires required for testing
const path = require('path');
const request = require('supertest');
const getPort = require('get-port');
const EventSource = require('eventsource');

//
// setup utilities
//
exports.setupApiServer = async (t, config = {}, pluginConfig = {}) => {
  // Must require here in order to load changes made during setup
  const Bree = require('bree');
  const { plugin } = require('../');

  const port = await getPort();

  Bree.extend(plugin, { port, ...pluginConfig });

  const bree = new Bree({ ...baseConfig, ...config });

  t.context.api = request.agent(bree.api.server);
  t.context.bree = bree;
};

const root = path.join(__dirname, 'jobs');
exports.root = root;

const baseConfig = {
  root,
  timeout: 0,
  interval: 0,
  hasSeconds: false,
  defaultExtension: 'js',
  jobs: ['basic']
};
exports.baseConfig = baseConfig;

exports.setupEventSource = (t, endpoint) => {
  const { token, bree } = t.context;

  return new EventSource(
    `http://${bree.api.config.serverHost}:${bree.api.config.port}${endpoint}/${token}`
  );
};
