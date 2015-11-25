module.exports = function (gulp, plugins, config, utilities) {
  'use strict';

  gulp.task('ifbuilder-clean', function (done) {
    utilities.log('Input Form Builder: Cleaning tmp and build dir!');
    var delconfig = [].concat(config.tmp, config.build, config.cleanCopiedFiles);
    utilities.log('Cleaning: '+ plugins.util.colors.blue(delconfig));
    plugins.del(delconfig, done);
  });

};

