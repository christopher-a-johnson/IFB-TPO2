module.exports = function (gulp, plugins, config, utilities) {
  'use strict';

  var karma = require('karma').server;

  //Run test once and exit
  gulp.task('ifbuilder-unit-test', ['ifbuilder-build-dev'], function (done) {
    utilities.log('Input Form Builder: Start Unit Testing');
    karma.start({
      configFile:  config.karmaConfigFile,
      singleRun: true
    }, karmaCompleted);

    function karmaCompleted(karmaResult) {
      utilities.log('Input Form Builder: Karma completed !!');
      if (karmaResult === 1) {
        done('Input Form Builder: Karma tests failed with code ' + karmaResult);
      }else {
        done();
      }
    }
  });

};
