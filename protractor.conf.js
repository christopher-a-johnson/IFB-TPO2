var gulpConfig = require('./gulp.config')();

exports.config = {
  specs: [gulpConfig.e2e + '**/*.js'],
  seleniumServerJar: 'node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  seleniumPort: 4444,
  baseUrl: 'http://localhost:9000/',
  capabilities: {
    'browserName': 'phantomjs',
    'phantomjs.binary.path': require('phantomjs').path,
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
  }
};
