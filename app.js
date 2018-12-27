const express = require('express');
const bodyParser = require('body-parser');
const makeRouter = require('./routes');
const makeTokenAuth = require('./tokenauth');
const { MemoryStore, serverInfo } = require('./models');

function makeApp(config = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(bodyParser.raw({
    inflate: true,
    limit: '1Mb',
    type: 'application/json',
  }));
  const store = Object.create(MemoryStore);
  app.use(makeTokenAuth(config.token));
  app.use(makeRouter(store, serverInfo));

  return app;
}

module.exports = { makeApp };
