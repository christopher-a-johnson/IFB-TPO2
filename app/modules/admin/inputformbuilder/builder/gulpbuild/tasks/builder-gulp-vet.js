module.exports = function (gulp, plugins, config, args, utilities) {
  'use strict';

  gulp.task('ifbuilder-vet', function () {
      utilities.log('Input Form Builder: Analyzing source with JSHint and JSCS');
      plugins.cached.caches = {};
      gulp.src(config.alljs)
        //.pipe(plugins.cached('ifbuilder-vet', {optimizeMemory: true}))
        /* jshint -W024 */
        .pipe(plugins.if(args.verbose, plugins.print(function (path) {
          return 'vetting : ' + path;
        })))
        .pipe(plugins.jscs(require(config.jscscli).load())).on('error', handlerError)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'), {
          verbose: true
        })
        .pipe(plugins.if(!args.isDev, plugins.jshint.reporter('fail')));

      function handlerError(error) {
        utilities.log('Input Form Builder: Error --'+error.toString());
        if (!args.isDev) {
          /* jshint -W040 */
          this.emit('end');
        }
      }
    }
  );
};

