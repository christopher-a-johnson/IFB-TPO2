(function () {
  'use strict';

  module.exports = function () {
    var app = 'app/';
    var e2e = 'e2e/';
    var tmp = 'tmp/';
    var report = 'report/';
    var vendor = 'vendor/';
    var ifbScripts = app + 'modules/admin/inputformbuilder/builder/**';
    var adminScripts = app + 'modules/admin/**/*';
    var appErrorHtml = app + 'apperror.html';

    var config = {
      /* all javascripts to vet */
      alljs: ['./*.js', 'app/**/*.js', '!' + ifbScripts],
      app: app,
      e2e: e2e,
      build: 'build/',
      filesToCopy: [app + 'apperror.html'],
      fonts: 'bower_components/bootstrap/dist/fonts/**/*.*',
      ieDetectionFiles: [
        app + 'scripts/ie-version-detection.js'
      ],
      index: app + 'index.html',
      images: app + 'images/**/*.*',
      spriteImages: app + 'images/sprite/*.png',
      spriteTemplate: 'gulp/template.sprites.mustache',
      allStyles: app + '**/*.{css,less}',
      less: app + 'app.less',
      report: report,
      preVendorFiles: '{app,vendor}/{scripts,encompass,modules}/' +
      '{admin/**/shared/classes/*,config,root,kendo-ie-workaround,encompass.interaction}.js',
      preVendorFilesWithoutAdmin: '{app,vendor}/{scripts,encompass,modules}/' +
      '{config,root,kendo-ie-workaround,encompass.interaction}.js',
      preVendorFilesOrder: [
        '**/encompass*',
        '**/*config*',
        '**/*root*',
        '**/*DetectPrivate*',
        '**/*private-mode*',
        '**/*kendo*',
        '**/*Utility*',
        '**/*KendoInteraction*',
        '**/*Storage*',
        '**/*SessionManagement*'],
      scripts: app + '**/!(**test).js',
      scriptsWithoutAdmin: app + '**/!(**test).js',
      ifbScripts: ifbScripts,
      adminScripts: adminScripts,
      vendorFiles: vendor + '**/!(encompass.interaction).js',
      vendorFilesOrder: [
        '**/*jquery*', '**/*lodash*', '**/*mousetrap*', '**/angular.js',
        '**/*kendo*', '**/*angular*', '**/*bootstrap*', '**/*ngDraggable*',
        '**/*restful*'
      ],
      templates: [app + '**/!(index).html', '!' + ifbScripts, '!' + appErrorHtml],
      templateCache: {
        file: 'templates.js',
        options: {
          standalone: true,
          module: 'elli.encompass.web.templates'
        }
      },
      tmp: tmp
    };
    config.karma = karmaOptions();
    return config;

    function karmaOptions() {
      var options = {
        exclude: [],
        coverage: {
          dir: report + 'coverage',
          reporters: [{
            type: 'html',
            subdir: 'report-html'
          }, {
            type: 'text-summary'
          }]
        },
        preprocessors: {
          'app/**/!(**test)+(.js)': ['coverage']
        }
      };
      return options;
    }
  };

}());
