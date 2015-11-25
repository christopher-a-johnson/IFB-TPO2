module.exports = function(gulp, plugins, config, args) {
  'use strict';
  return function() {
    var CleanCssPlugin = require('less-plugin-clean-css');
    var cleancss = new CleanCssPlugin({advanced: true});
    return gulp.src(config.less)
      .pipe(plugins.preprocess({context: {BUILD_PIPELINE_ONLY: args.pipeline ? 'YES' : 'NO'}}))
      //.pipe(plugins.cache('less'))
      .pipe(plugins.plumber())
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.less({plugins: [cleancss]}))
      .pipe(plugins.sourcemaps.write('.'))
      .pipe(plugins.chmod(666))
      .pipe(gulp.dest(config.tmp));
  };
};
