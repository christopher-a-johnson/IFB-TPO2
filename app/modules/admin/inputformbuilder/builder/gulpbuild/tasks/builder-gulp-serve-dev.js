module.exports = function(gulp, plugins, config, args, utilities) {
  'use strict';

  var browserSync = require('browser-sync');

  gulp.task('ifbuilder-serve-dev', ['ifbuilder-build-dev'], function(done) {
    startBrowserSync();
  });

  gulp.task('ifbuilder-build-dev', function(done) {
    utilities.log('Input Form Builder: Building development files');
    plugins.runSequence('ifbuilder-clean', ['ifbuilder-vet'], 'ifbuilder-inject', done);
  });

  /* Utility Functions */
  function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    utilities.log('----------> File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
  }

  function startBrowserSync() {
    //Do nothing if browserSync is running
    if (args.nosync || browserSync.active) {
      return;
    }

    utilities.log('Input Form Builder: Starting browser sync on port ' + config.port);

    /* setup common watches */
    gulp.watch(config.allStyles, ['ifbuilder-less']).on('change', changeEvent);
    gulp.watch(config.templates, ['ifbuilder-templates', browserSync.reload]).on('change', changeEvent);
    gulp.watch(config.alljs, ['ifbuilder-vet']).on('change', changeEvent);

    var options = {
      server: {
        baseDir: [config.build, '.', '../../../../../']
      },
      // proxy: 'localhost:'+config.port,
      port: config.port,
      files: [config.build + '**/*.*'],
      ghostMode: {
        clicks: true,
        location: false,
        forms: true,
        scroll: true
      },
      injectChanges: true,
      logFileChanges: true,
      logLevel: args.verbose ? 'debug' : 'info',
      logPrefix: 'gulp-patterns',
      notify: true,
      online: false,
      open: false,
      reloadDelay: 100, //0
      ui: false,
      codeSync: args.nowatch ? false : true
    };

    browserSync(options);
  }


};
