module.exports = function (gulp, plugins, config, args, utilities) {
  'use strict';
  var tfsCheckout = require(config.tfscheckout);
  gulp.task('ifbuilder-inject',['ifbuilder-wiredep','ifbuilder-less'], function () {
      utilities.log('Input Form Builder:: Wire up the app css into index.html, and call wiredep ');
      return gulp.src(config.index)
        .pipe(tfsCheckout())
        .pipe(plugins.inject(gulp.src(config.jqueryuicss), {addRootSlash: false, read: false, name: 'jqueryui'}))
        .pipe(plugins.inject(gulp.src(config.kendocss), {addRootSlash: false, read: false, name: 'kendo'}))
        .pipe(plugins.inject(gulp.src(config.css),{addRootSlash: false}))
        .pipe(gulp.dest(config.app));
    }
  );
};
