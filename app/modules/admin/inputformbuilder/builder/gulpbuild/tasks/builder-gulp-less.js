module.exports = function (gulp, plugins, config, utilities) {
  'use strict';

  gulp.task('ifbuilder-less', ['ifbuilder-clean-styles'], function () {
      utilities.log('Input Form Builder:: Compiling LESS ---> CSS');
      var CleanCssPlugin = require('less-plugin-clean-css');
      var cleancss = new CleanCssPlugin({advanced: true});
      return gulp.src(config.less)
        .pipe(plugins.plumber())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.less({plugins: [cleancss]}))
        .pipe(plugins.autoprefixer({browser:['last 2 version']}))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest(config.tmp));
    });

  gulp.task('ifbuilder-clean-styles', function(done){
    utilities.log('Input Form Builder:: Cleaning CSS Files');
    utilities.clean(utilities.log, config.tmp, done);

  });

};

