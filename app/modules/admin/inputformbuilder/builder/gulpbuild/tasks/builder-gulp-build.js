module.exports = function (gulp, plugins, config, utilities) {
  'use strict';

  gulp.task('ifbuilder-build', function (done) {
    utilities.log('Input Form Builder: Building everything');
    plugins.runSequence('ifbuilder-clean', ['ifbuilder-vet', 'ifbuilder-templates'], ['ifbuilder-optimize', 'ifbuilder-images'],
                        'ifbuilder-jqueryuicss', 'ifbuilder-kendocss', done);
  });

  gulp.task('ifbuilder-jqueryuicss', function () {
    utilities.log('Input Form Builder:  Copying jquery ui css files');
    gulp.src(config.jqueryuicss)
      .pipe(gulp.dest(config.build + config.app + 'styles'));
  });

  gulp.task('ifbuilder-kendocss', function () {
    utilities.log('Input Form Builder:  Copying kendo css files');
    gulp.src(config.kendocss)
      .pipe(gulp.dest(config.build + config.app + 'styles/kendo'));
  });
};
