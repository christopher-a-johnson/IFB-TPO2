(function () {
  'use strict';
  module.exports = function (config) {
    var gulpConfig = require('./gulp.config')();

    /* jscs: disable */
    var filesForKarma = {
      'prevendor-files': [],
      'vendor-files': [],
      'app-files': [],
      'test-files': [],
      'bower-dev-deps': ['bower_components/angular-mocks/angular-mocks.js']
    };
    /* jscs: enable */

    config.set({
      basePath: '',
      frameworks: ['jasmine'],
      exclude: gulpConfig.karma.exclude,
      preprocessors: gulpConfig.karma.preprocessors,
      reporters: ['progress', 'html', 'coverage'],
      coverageReporter: {
        dir: gulpConfig.karma.coverage.dir,
        reporters: gulpConfig.karma.coverage.reporters
      },
      htmlReporter: {
        outputDir: gulpConfig.report + 'html'
      },
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      singleRun: false,
      client: {
        captureConsole: false
      },
      files: [].concat(
        filesForKarma['prevendor-files'],
        filesForKarma['vendor-files'],
        filesForKarma['bower-dev-deps'],
        filesForKarma['app-files'],
        'e2e/test_overrides.js',
        filesForKarma['test-files']
      )
    });
  };
})();
