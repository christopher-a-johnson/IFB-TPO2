(function () {
  'use strict';

  var fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'main-bower-files', 'event-stream', 'del', 'run-sequence']
    }),
    args = require('yargs').argv,
    config = require('./gulp.config')(),
    browserSync = require('browser-sync'),
    _ = require('lodash'),
    modRewrite = require('connect-modrewrite');

  // Input Form Builder Build
  //require('./app/modules/admin/inputformbuilder/builder/gulpfile.js');

  /* modular build for 15.2 release */
  if (!!args.pipeline) {
    config.templates.push('!' + config.adminScripts);
    config.preVendorFiles = config.preVendorFilesWithoutAdmin;
    /* generate temp module */
    gulp.src('app/app.module.js')
      .pipe($.preprocess({context: {BUILD_PIPELINE_ONLY: args.pipeline ? 'YES' : 'NO'}}))
      .pipe(gulp.dest('tmp'));
  }

  /* require all tasks here, so that we can split tasks in files under gulp folder */
  gulp.task('sprites', ['clean'], require('./gulp/sprites')(gulp, $, config));
  gulp.task('less', require('./gulp/less')(gulp, $, config, args));

  gulp.task('default', ['help']);
  gulp.task('help', $.taskListing.withFilters(function (task) {
    return !_.contains(['serve', 'serve-dev', 'build', 'test'], task);
  }));

  gulp.task('clean', function (done) {
    clean([config.build, config.tmp + '**/*', './npm-debug.log', './phantomjsdriver.log'], done);
  });

  gulp.task('templates', function () {
    log('Creating AngularJS $templateCache');
    return gulp.src(config.templates)
      /* jshint -W024 */
      .pipe($.if(args.verbose, $.print(function (path) {
        return 'templates : ' + path;
      })))
      /*.pipe($.minifyHtml({
        empty: true
      }))*/
      .pipe($.angularTemplatecache(
        config.templateCache.file,
        config.templateCache.options
      ))
      .pipe($.chmod(666))
      .pipe(gulp.dest(config.tmp));
  });

  gulp.task('images', function () {
    log('Optimizing Images');
    return gulp.src([config.images, '!' + config.spriteImages])
      /* jshint -W024 */
      .pipe($.if(args.verbose, $.print(function (path) {
        return 'images : ' + path;
      })))
      .pipe($.imagemin({
        optimizationLevel: 0
      }))
      .pipe($.chmod(666))
      .pipe(gulp.dest(config.build + 'images'));
  });

  gulp.task('fonts', function () {
    log('Copying fonts');
    return gulp.src(config.fonts)
      /* jshint -W024 */
      .pipe($.if(args.verbose, $.print(function (path) {
        return 'fonts : ' + path;
      })))
      .pipe($.chmod(666))
      .pipe(gulp.dest(config.build + 'fonts'));
  });

  gulp.task('inject', function () {

    var preVendorFiles = gulp.src(config.preVendorFiles, {
      read: false
    })
      .pipe($.order(config.preVendorFilesOrder))
      /* jshint -W024 */
      .pipe($.if(args.verbose, $.print(function (path) {
        return 'inject : preVendorFiles : ' + path;
      })));

    // Remove restful.min.js for 15.2 build
    var bowerFiles = $.mainBowerFiles();
    if (!!args.pipeline) {
      bowerFiles = $.mainBowerFiles('**/!(restful.min).js');
    }
    var vendorFiles = $.eventStream.merge(
      gulp.src(bowerFiles, {
        read: false
      }),
      gulp.src(config.vendorFiles, {
        read: false
      })
    )
      /*
       * Let's play safe by explicitly ordering vendor files
       * Tip: to avoid ordering here all vendor files should be
       * installed as local bower components
       */
      .pipe($.order(config.vendorFilesOrder))
      .pipe($.if(args.verbose, $.print(function (path) {
        return 'inject : vendorFiles : ' + path;
      })));

    /* modular build for 15.2 release */
    var conditionalAppFiles = [config.tmp + '**/*.js', '!' + config.preVendorFiles, '!' + config.ifbScripts];
    if (!!args.pipeline) {
      conditionalAppFiles.unshift('!' + config.adminScripts);
      conditionalAppFiles.unshift('!' + 'app/app.module.js');
    }
    conditionalAppFiles.unshift(config.scripts);
    var appFiles = $.eventStream.merge(
      gulp.src(conditionalAppFiles)
        .pipe($.angularFilesort()),
      gulp.src(config.tmp + '**/*.css', {read: false})
    )
      .pipe($.if(args.verbose, $.print(function (path) {
        return 'inject : appFiles : ' + path;
      })));

    var karmaTransform = function (filepath, file, i, length) {
      return '\'' + filepath + '\'' + (i + 1 < length ? ', ' : '');
    };

    var conditionalTestFiles = [config.app + '**/**_test.js'];
    if (!!args.pipeline) {
      conditionalTestFiles.push('!' + config.adminScripts);
    }
    fs.chmodSync('./karma.conf.js', '777');
    gulp.src('./karma.conf.js')
      .pipe($.inject(preVendorFiles, {
        relative: true,
        starttag: '\'prevendor-files\': [',
        endtag: ']',
        transform: karmaTransform
      }))
      .pipe($.inject(vendorFiles, {
        relative: true,
        starttag: '\'vendor-files\': [',
        endtag: ']',
        transform: karmaTransform
      }))
      .pipe($.inject(appFiles, {
        relative: true,
        starttag: '\'app-files\': [',
        endtag: ']',
        transform: karmaTransform
      }))
      .pipe($.inject(gulp.src(conditionalTestFiles), {
        relative: true,
        starttag: '\'test-files\': [',
        endtag: ']',
        transform: karmaTransform
      }))
      .pipe(gulp.dest('./'));

    fs.chmodSync(config.index, '777');
    return gulp.src(config.index)
      .pipe($.inject(gulp.src(config.ieDetectionFiles), {
        name: 'iedetection'
      }))
      .pipe($.inject(preVendorFiles, {
        name: 'prevendor'
      }))
      .pipe($.inject(vendorFiles, {
        name: 'vendor'
      }))
      .pipe($.inject(appFiles, {
        name: 'app'
      }))
      .pipe($.if(!!args.pipeline, $.replace('"/dev/"', '"/app/"'))) // build box somehow does not delete old index file
      .pipe($.if(!args.pipeline, $.replace('"/app/"', '"/dev/"')))
      .pipe(gulp.dest('app'));
  });

  gulp.task('optimize', ['inject'], function () {
    log('Optimizing the javascript, css, html');
    var assets = $.useref.assets({
      searchPath: './'
    });
    var cssFilter = $.filter('**/*.css');
    var jsVendorFilter = $.filter('**/vendor.js');
    var jsAppFilter = $.filter('**/app.js');

    return gulp.src(config.index)
      .pipe($.plumber())
      .pipe(assets)
      .pipe($.sourcemaps.init())
      .pipe(cssFilter)
      .pipe($.csso())
      .pipe($.sourcemaps.write('.'))
      .pipe(cssFilter.restore())
      .pipe(jsVendorFilter)
      .pipe($.uglify())
      .pipe($.sourcemaps.write('.'))
      .pipe(jsVendorFilter.restore())
      .pipe(jsAppFilter)
      .pipe($.preprocess({context: {BUILD_PIPELINE_ONLY: args.pipeline ? 'YES' : 'NO'}}))
      .pipe($.ngAnnotate())
      .pipe($.uglify())
      .pipe($.sourcemaps.write('.'))
      .pipe(jsAppFilter.restore())
      // .pipe($.rev())
      .pipe(assets.restore())
      .pipe($.useref())
      .pipe($.revReplace())
      .pipe($.chmod(666))
      .pipe(gulp.dest(config.build));
  });

  gulp.task('copy-files', function () {
    log('Copying files');
    return gulp.src(config.filesToCopy)
      .pipe(gulp.dest(config.build));
  });

  gulp.task('build', function (done) {
    log('Building everything');
    $.runSequence('clean', ['vet', 'less', 'templates', 'copy-files'], ['optimize', 'images', 'fonts'], done);
  });

  gulp.task('build-dev', function (done) {
    log('Building development files');
    $.runSequence('clean', [/*'vet-dev',*/ 'less', 'templates'], 'inject', done);
  });

  gulp.task('serve', function (done) {
    $.runSequence('build', 'server', done);
  });
  gulp.task('serve-dev', function (done) {
    $.runSequence('build-dev', 'server-dev', done);
  });

  gulp.task('server', function () {
    server(false /* isDev */);
  });
  gulp.task('server-dev', function () {
    server(true /* isDev */);
  });

  /* Analyze all javascript code using jscs and jshint */
  gulp.task('vet', function () {
    return vet(false /* isDev */);
  });
  gulp.task('vet-dev', function () {
    return vet(true /* isDev */);
  });

  gulp.task('test', [args.prod ? 'build' : 'build-dev'], function (done) {
    startTests(true /* singleRun */, done);
  });

  gulp.task('test-dev', function (done) {
    startTests(true /* singleRun */, done);
  });

  // jscs:disable
  gulp.task('webdriver-update', $.protractor.webdriver_update); // jshint ignore:line
  gulp.task('e2e-dev', ['serve-dev', 'webdriver-update'], startE2E);
  gulp.task('e2e', ['serve', 'webdriver-update'], startE2E);
  /* Utility Functions */
  function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('----------> File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
  }

  function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    $.del(path, done);
  }

  function log(msg) {
    if (typeof (msg) === 'object') {
      for (var item in msg) {
        if (msg.hasOwnProperty(item)) {
          $.util.log($.util.colors.blue(msg[item]));
        }
      }
    } else {
      $.util.log($.util.colors.blue(msg));
    }
  }

  function vet(isDev) {
    log('Analyzing source with JSHint and JSCS');
    $.cached.caches = {};
    return gulp.src(config.alljs)
      .pipe($.cached('vet', {optimizeMemory: true}))
      /* jshint -W024 */
      .pipe($.if(args.verbose, $.print(function (path) {
        return 'vetting : ' + path;
      })))
      .pipe($.jscs()).on('error', handlerError)
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'), {
        verbose: true
      })
      .pipe($.if(!isDev, $.jshint.reporter('fail')));

    function handlerError(error) {
      log(error.toString());
      if (!isDev) {
        /* jshint -W040 */
        this.emit('end');
      }
    }
  }

  function server(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
      return;
    }
    var port = 9000;
    log('Starting browser sync on port ' + port);

    /* setup common watches */
    gulp.watch(config.allStyles, ['less']).on('change', changeEvent);
    gulp.watch(config.templates, ['templates', browserSync.reload]).on('change', changeEvent);
    gulp.watch(config.alljs, ['vet-dev']).on('change', changeEvent);

    if (!isDev) {
      gulp.watch(config.tmp + '**/*.*', ['optimize', browserSync.reload]).on('change', changeEvent);
      gulp.watch(config.scripts, ['optimize', browserSync.reload]).on('change', changeEvent);
    }

    var options = {
      server: {
        baseDir: [config.build, '.'],
        middleware: [
          modRewrite([
            '^/app/modules/admin/inputformbuilder/builder - [L]',
            '^/tmp/ - [L]',
            '^/app /',
            '^/dev /',
            '!\\.\\w+$ /index.html [L]'
          ])
        ]
      },
      port: port,
      files: [config.build + '**/*.*'],
      ghostMode: {
        clicks: false,
        location: false,
        forms: false,
        scroll: true
      },
      injectChanges: true,
      logFileChanges: true,
      logLevel: args.verbose ? 'debug' : 'info',
      logPrefix: 'gulp-patterns',
      notify: false,
      online: false,
      open: false,
      reloadDelay: 0, // 0
      ui: false,
      codeSync: args.nowatch ? false : true
    };

    if (isDev) {
      options.server.baseDir = [config.app, '.'];
      options.files = [config.tmp + '**/*.{css,js}', config.app + '**/*.js', '!' + config.app + '**/*_test.js', '!' + config.images];
      options.notify = true;
    }
    if (specRunner) {
      options.startPath = config.specRunnerFile;
    }

    browserSync(options);
  }

  function startTests(singleRun, done) {
    var karma = require('karma').server;
    var karmaConfig = require('karma/lib/config').parseConfig(path.resolve(__dirname, 'karma.conf.js'), {});
    karmaConfig.singleRun = !!singleRun;
    karmaConfig.browsers = args.ci ? ['PhantomJS'] : ['PhantomJS'/*, 'Firefox'*/];
    if (args.prod) {
      karmaConfig.files = ['build/scripts/vendor.js', 'bower_components/angular-mocks/angular-mocks.js',
        'build/scripts/app.js', config.app + '**/**_test.js'];
    }

    karmaConfig.files.push({pattern: 'api/**/*.json', watched: true, served: true, included: false});

    log('Starting karma...');
    karma.start(karmaConfig, karmaCompleted);

    function karmaCompleted(karmaResult) {
      log('karma completed !!');
      if (karmaResult === 1) {
        done('karma: tests failed with code ' + karmaResult);
      } else {
        done();
      }
    }
  }

  function startE2E(done) {
    gulp.src(config.e2e + '**/*.js')
      .pipe($.protractor.protractor({
        configFile: __dirname + '/protractor.conf.js'
      }))
      .on('error', function (error) {
        throw error;
      })
      .on('end', function () {
        browserSync.exit();
        done();
      });
  }

}());
