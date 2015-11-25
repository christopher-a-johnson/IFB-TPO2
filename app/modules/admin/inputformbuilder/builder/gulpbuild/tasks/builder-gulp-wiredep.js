module.exports = function (gulp, plugins, config, args, utilities) {
  'use strict';

  var tfsCheckout = require(config.tfscheckout);

  gulp.task('ifbuilder-copy-files', function () {
    utilities.log('Input Form Builder: Copying files');
    utilities.log('Input Form Builder: Copied files: ' + config.filesToCopy);
    utilities.log('Input Form Builder: Copied dir: ' + config.copyDir);
    return gulp.src(config.filesToCopy)
      .pipe(gulp.dest(config.copyDir));
  });

  gulp.task('ifbuilder-wiredep', ['ifbuilder-copy-files'], function () {
      utilities.log('Input Form Builder: Wire up the bower js and app js into index.html ');

      //var options = config.getWiredepDefaultOptions();
      //var wiredep = require('wiredep').stream;

      return gulp.src(config.index)
        //.pipe(wiredep(options))
        .pipe(tfsCheckout())
        .pipe(plugins.inject(gulp.src(config.vendorScripts), {addRootSlash: false, read: false, name: 'vendor'}))
        .pipe(plugins.inject(gulp.src(config.orderedScripts), {addRootSlash: false}))
        .pipe(gulp.dest(config.app));
    }
  );
};
