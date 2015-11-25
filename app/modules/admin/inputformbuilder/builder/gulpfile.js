
(function () {
  'use strict';

  var ifbGulp = require('gulp');
  var ifbPlugins = require('gulp-load-plugins')({
      lazy:true,
      pattern: ['gulp-*', 'main-bower-files', 'event-stream', 'del', 'run-sequence']
    });
  var ifbConfig = require('./builder-gulp.config')();
  var ifbArgs = require('yargs').argv;
  var ifbUtilities = require('./gulpbuild/builder-utilities')(ifbPlugins);

  //Default is dev mode
  if (typeof ifbArgs.isDev === 'undefined'){
    ifbArgs.isDev=true;
  }

  //Task to clean tmp and build dir
  require('./gulpbuild/tasks/builder-gulp-clean')(ifbGulp, ifbPlugins, ifbConfig, ifbUtilities);

  //Task to compile less to CSS
  require('./gulpbuild/tasks/builder-gulp-less')(ifbGulp, ifbPlugins, ifbConfig, ifbUtilities);

  //Task to optimize images
  require('./gulpbuild/tasks/builder-gulp-images')(ifbGulp, ifbPlugins, ifbConfig,ifbArgs, ifbUtilities);

  //Task to optimize html templates
  require('./gulpbuild/tasks/builder-gulp-templates')(ifbGulp, ifbPlugins, ifbConfig,ifbArgs, ifbUtilities);


  //Task to run JSHint/JSCS
  require('./gulpbuild/tasks/builder-gulp-vet')(ifbGulp, ifbPlugins, ifbConfig,ifbArgs, ifbUtilities);

  //Task to inject bower components JS files
  require('./gulpbuild/tasks/builder-gulp-wiredep')(ifbGulp, ifbPlugins, ifbConfig,ifbArgs, ifbUtilities);

  //Task to wire up css and js
  require('./gulpbuild/tasks/builder-gulp-inject')(ifbGulp, ifbPlugins, ifbConfig,ifbArgs, ifbUtilities);

  //Task to run browser sync in local dev env
  require('./gulpbuild/tasks/builder-gulp-serve-dev')(ifbGulp, ifbPlugins, ifbConfig,ifbArgs, ifbUtilities);

  //Task to optimize css/js/html
  require('./gulpbuild/tasks/builder-gulp-optimize')(ifbGulp, ifbPlugins, ifbConfig,ifbArgs, ifbUtilities);

  //task to build everything
  require('./gulpbuild/tasks/builder-gulp-build')(ifbGulp, ifbPlugins, ifbConfig, ifbUtilities);

  //task to run the unit tests
  require('./gulpbuild/tasks/builder-gulp-unit-test')(ifbGulp, ifbPlugins, ifbConfig, ifbUtilities);

  //Default task is help
  ifbGulp.task('help', ifbPlugins.taskListing);
  ifbGulp.task('default', ['help']);

}());
