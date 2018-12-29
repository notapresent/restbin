/* eslint import/no-extraneous-dependencies: 0, no-console:0 */
require('dotenv').config();
const { makeApp } = require('./app');
const config = require('./config');


makeApp(config).then((app) => {
  app.listen(config.port, config.host, () => {
    console.log(`Listening on port ${config.host}:${config.port}`);
  });
});
