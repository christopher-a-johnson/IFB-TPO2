(function () {
  'use strict';

  module.exports = function () {
    var appDir = 'inputformbuilder';
    var app = './';
    var pathToRoot = '../../../../../../../';
    //Restful services wrapper
    var restWrapper = ['../shared/classes/RestfulServices.js',
      '../shared/classes/Storage.js',
      '../shared/classes/private-mode-detection.js',
      '../shared/classes/DetectPrivateBrowsing.js',
      '../shared/classes/SessionManagement.js',
      '../shared/classes/KendoInteraction.js',
      '../../../../../vendor/kendo/2014.3.1119/kendo.all.js',
      '../../../../../bower_components/jquery/dist/jquery.js',
      '../../../../../bower_components/restful.js/dist/restful.min.js'];

    var copyDir = 'lib/vendor';
    var cwd = process.cwd();
    var karmaConfigFile = cwd + '/karma.conf.js';
    var buildDir = app + 'builder_build/';
    //var buildDir = app;
    var tfsCheckoutDir = pathToRoot + 'gulp/tfs_checkout';
    if (cwd.indexOf(appDir) === -1) {
      //Calling from root
      var ifbDir = 'app/modules/admin/inputformbuilder/builder/';
      app = app + ifbDir;
      restWrapper = ['app/modules/admin/inputformbuilder/shared/classes/RestfulServices.js',
        'app/modules/admin/inputformbuilder/shared/classes/Storage.js',
        'app/modules/admin/inputformbuilder/shared/classes/private-mode-detection.js',
        'app/modules/admin/inputformbuilder/shared/classes/DetectPrivateBrowsing.js',
        'app/modules/admin/inputformbuilder/shared/classes/SessionManagement.js',
        'app/modules/admin/inputformbuilder/shared/classes/KendoInteraction.js',
        'vendor/kendo/2014.3.1119/kendo.all.js',
        'bower_components/jquery/dist/jquery.js',
        'bower_components/restful.js/dist/restful.min.js'];
      copyDir = app + 'lib/vendor';
      karmaConfigFile = cwd + '/' + ifbDir + '/karma.conf.js';
    }
    var jscscli = pathToRoot + 'node_modules/gulp-jscs/node_modules/jscs/lib/cli-config';
    var tmp = app + 'build_tmp/';
    var report = app + 'build_report/';
    var vendorScripts = app + 'lib/vendor/**';
    var pluginScripts = app + 'lib/plugins/**';
    var port = '3000';
    var config = {
      /* all javascripts to vet */
      alljs: [app + 'classes/*.js', app + 'lib/**/*.js', app + 'constants/*.js',
        app + 'config/**/*.js', '!' + vendorScripts,
        '!' + pluginScripts],
      app: app,
      allStyles: app + 'styles/**/*.{css,less}',
      /**
       * Bower and NPM locations
       */
      bower: {
        json: pathToRoot + 'bower.json',
        directory: pathToRoot + 'bower_components',
        ignorePath: '../..'
      },
      build: buildDir,
      cleanCopiedFiles: [copyDir + '/RestfulServices.js',
        copyDir + '/Storage.js',
        copyDir + '/private-mode-detection.js',
        copyDir + '/DetectPrivateBrowsing.js',
        copyDir + '/SessionManagement.js',
        copyDir + '/KendoInteraction.js',
        copyDir + '/kendo.all.js',
        copyDir + '/jquery.js',
        copyDir + '/restful.min.js'],
      copyDir: copyDir,
      css: tmp + 'builder.css',
      filesToCopy: restWrapper,
      index: app + 'index.html',
      images: app + 'images/**/*.*',
      jscscli: jscscli,
      jqueryuicss: [app + 'styles/jquery-ui.css'],
      karmaConfigFile: karmaConfigFile,
      kendocss: [
        app + 'styles/kendo/kendo.common.min.css',
        app + 'styles/kendo/kendo.default.min.css',
        app + 'styles/kendo/kendo.dataviz.min.css',
        app + 'styles/kendo/kendo.dataviz.default.min.css',
        app + 'styles/kendo/kendo.mobile.all.min.css'
      ],
      less: app + 'builder.less',
      orderedScripts: [
        app + '**/*jquery.inline*', app + '**/*jquery.panel*',
        app + '**/*gridster*', app + '**/*mousetrap*',
        app + '**/constants/*.js',
        app + '**/classes/*Utility*',
        app + '**/classes/*History*', app + '**/classes/*Property*',
        app + '**/classes/*Control*', app + '**/classes/*Workspace*',
        app + '**/classes/*Clipboard*', app + '**/classes/*Template*',
        app + 'lib/src/*.js', app + 'lib/src/json**/*.js',
        app + 'lib/src/layout/layout.propertyPanel.js',
        app + 'lib/src/layout/layout.layerPanel.js',
        app + 'lib/src/**/*.js', app + 'lib/controls/**/*.js',
        app + '**/properties/*.js'

      ],
      optimized: {
        app: 'app.js',
        lib: 'vendor.js'
      },
      port: port,
      report: report,
      scripts: [
        app + 'classes/**/*.js',
        app + 'lib/**/*.js',
        '!' + app + vendorScripts
      ],
      templates: [app + 'templates/*.html'],
      tfscheckout: tfsCheckoutDir,
      tmp: tmp,
      vendorScripts: [
        app + '**/config/builder-config*',
        '**/vendor/*DetectPrivate*', '**/vendor/*private-mode*',
        '**/vendor/jquery.js', '**/vendor/*jquery-ui*',
        '**/vendor/*kendo*', '**/vendor/*restful*',
        '**/vendor/*RestfulServices*', '**/vendor/*Storage*',
        '**/vendor/*Session*', '**/vendor/*KendoInteraction*','**/vendor/ace/src/ace.js'
      ]
    };

    config.karma = karmaOptions();

    config.getWiredepDefaultOptions = function () {
      var options = {
        bowerJson: config.bower.json,
        directory: config.bower.directory,
        ignorePath: config.bower.ignorePath
      };

      return options;
    };

    function karmaOptions() {

      var options = {
        exclude: [],
        coverage: {
          dir: report + 'coverage',
          reporters: [{
            type: 'html',
            subdir: 'report-html'
          }, {
            type: 'html'
          }]
        },
        preprocessors: {
          'classes/**/*.js': 'coverage',
          'lib/**/!(vendor|thirdparty)/**/*.js': 'coverage'
        }
      };
      return options;
    }

    return config;

  };

}());
