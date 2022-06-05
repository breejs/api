// Necessary utils for testing
// Librarires required for testing
const path = require('path');
const request = require('supertest');
const getPort = require('get-port');

//
// setup utilities
//
exports.setupApiServer = async (t, config = {}) => {
  // Must require here in order to load changes made during setup
  const Bree = require('bree');
  const { plugin } = require('../');

  const port = await getPort();

  Bree.extend(plugin, { port });

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
