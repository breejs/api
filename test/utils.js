// Necessary utils for testing
// Librarires required for testing
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const { factory, MongooseAdapter } = require('factory-girl');
const getPort = require('get-port');

factory.setAdapter(new MongooseAdapter());

// Models and server
const config = require('../config');
const { Users } = require('../app/models');

let mongod;

//
// setup utilities
//
exports.setupMongoose = async () => {
  mongod = await MongoMemoryServer.create();

  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri);
};

exports.setupWebServer = async (t) => {
  // Must require here in order to load changes made during setup
  const { app } = require('../web');
  const port = await getPort();
  t.context.web = request.agent(app.listen(port));
};

exports.setupApiServer = async (t) => {
  // Must require here in order to load changes made during setup
  const { app } = require('../api');
  const port = await getPort();
  t.context.api = request.agent(app.listen(port));
};

// Make sure to load the web server first using setupWebServer
exports.loginUser = async (t) => {
  const { web, user, password } = t.context;

  await web.post('/en/login').send({
    email: user.email,
    password
  });
};

//
// teardown utilities
//
exports.teardownMongoose = async () => {
  await mongoose.disconnect();
  mongod.stop();
};

//
// factory definitions
// <https://github.com/simonexmachina/factory-girl>
//
exports.defineUserFactory = async () => {
  factory.define('user', Users, (buildOptions) => {
    const user = {
      email: factory.sequence('Users.email', (n) => `test${n}@example.com`),
      password: buildOptions.password ? buildOptions.password : '!@K#NLK!#N'
    };

    if (buildOptions.resetToken) {
      user[config.userFields.resetToken] = buildOptions.resetToken;
      user[config.userFields.resetTokenExpiresAt] = new Date(
        Date.now() + 10000
      );
    }

    return user;
  });
};
