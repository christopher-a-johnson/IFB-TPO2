// Karma configuration

module.exports = function(config) {
  'use strict';

  var gulpConfig = require('./builder-gulp.config')();

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-jquery', 'jasmine', 'requirejs'],

    // list of files / patterns to load in the browser
    files: [
      'test/test-main.js',
      'test/fixture/indexfixture.html',
      {pattern: 'config/**/*.js', included: true},
      {pattern: 'constants/**/*.js', included: true},
      {pattern: 'classes/**/*.js', included: false},
      {pattern: 'lib/**/*.js', included: false},
      {pattern: 'test/**/*.spec.js', included: false}
    ],

    // list of files to exclude
    exclude: [
      'test/specs/lib/src/layout/layout.toolbar.spec.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: gulpConfig.karma.preprocessors,

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'html', 'coverage'],
    coverageReporter: {
      dir: gulpConfig.karma.coverage.dir,
      reporters: gulpConfig.karma.coverage.reporters
    },
    htmlReporter: {
      outputDir: gulpConfig.report + 'html'
    },
    // web server port
    port: 9879,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],
   //browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    client: {
      captureConsole: false
    },

    browserNoActivityTimeout: 60000 //default 10000
  });
};
