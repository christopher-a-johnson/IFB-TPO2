module.exports = function (gulp, plugins, config, args, utilities) {
  'use strict';

  gulp.task('ifbuilder-templates', function () {
    utilities.log('Input Form Builder: Minifying Templates');
    return gulp.src(config.templates)
      /* jshint -W024 */
      .pipe(plugins.if(args.verbose, plugins.print(function (path) {
        return 'Form builder templates : ' + path;
      })))
      .pipe(plugins.minifyHtml({
        empty: true
      }))
      .pipe(plugins.chmod(666))
      .pipe(gulp.dest(config.build + 'templates'));
  });
};
