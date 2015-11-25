module.exports = function (gulp, plugins, config, args, utilities) {
  'use strict';

  gulp.task('ifbuilder-optimize', ['ifbuilder-inject'], function () {
    utilities.log('Input Form Builder:  Optimizing the javascript, css, html');
    var assets = plugins.useref.assets({
      searchPath: './'
    });
    var cssFilter = plugins.filter('**/*.css');
    var jsVendorFilter = plugins.filter('**/' + config.optimized.lib);
    var jsAppFilter = plugins.filter('**/' + config.optimized.app);

    return gulp.src(config.index)
      .pipe(plugins.plumber())
      .pipe(assets)
      .pipe(plugins.sourcemaps.init())
      .pipe(cssFilter)
      .pipe(plugins.csso())
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(cssFilter.restore())
      .pipe(jsVendorFilter)
      .pipe(plugins.uglify())
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(jsVendorFilter.restore())
      .pipe(jsAppFilter)
      .pipe(plugins.uglify())
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(jsAppFilter.restore())
      .pipe(assets.restore())
      .pipe(plugins.useref())
      .pipe(plugins.revReplace())
      .pipe(plugins.chmod(666))
      .pipe(gulp.dest(config.build));
  });

};
