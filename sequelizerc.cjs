const path = require('path');

module.exports = {
  config: path.resolve('config', 'config.mjs'),
  'models-path': path.resolve('src, models'),
  'seeders-path': path.resolve('seeders'),
  'migrations-path': path.resolve('migrations'),
};
