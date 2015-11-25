module.exports = function (gulp, plugins, config, args, utilities) {
  'use strict';

  gulp.task('ifbuilder-images', ['ifbuilder-clean-images'], function () {
      utilities.log('Input Form Builder: Optimizing Images -- copy and compress images');
      return gulp.src([config.images])
        /* jshint -W024 */
        .pipe(plugins.if(args.verbose, plugins.print(function (path) {
          return 'images : ' + path;
        })))
        .pipe(plugins.imagemin({
          optimizationLevel: 4
        }))
        .pipe(plugins.chmod(666))
        .pipe(gulp.dest(config.build + 'images'));
  }
  );

  gulp.task('ifbuilder-clean-images', function (done){
    utilities.log('Input Form Builder:: Cleaning Image Files');
    utilities.clean(utilities.log, config.build + 'images', done);
  });
};

