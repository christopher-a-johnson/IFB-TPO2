(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary', [
    'elli.encompass.web.admin.formbuilder.assetlibrary.imagesconstant',
    'elli.encompass.web.admin.formbuilder.assetlibrary.scriptsconstant',
    'elli.encompass.web.admin.formbuilder.assetlibrary.stylesconstant'
  ]);

  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary').config(assetLibraryConfig);

  /* @ngInject */
  function assetLibraryConfig($stateProvider, ImagesConst, ScriptsConst, StylesConst) {
    $stateProvider.state(ImagesConst.IMAGES_STATE, {
      url: '/images',
      templateUrl: 'modules/admin/inputformbuilder/shared/views/formbuilder-main.html'
    });

    $stateProvider.state(ScriptsConst.SCRIPTS_STATE, {
      url: '/scripts',
      templateUrl: 'modules/admin/inputformbuilder/shared/views/formbuilder-main.html'
    });

    $stateProvider.state(StylesConst.STYLES_STATE, {
      url: '/styles',
      templateUrl: 'modules/admin/inputformbuilder/shared/views/formbuilder-main.html'
    });

    $stateProvider.state(ScriptsConst.EDIT_SCRIPTS_STATE, {
      url: '/editscripts',
      templateUrl: 'modules/admin/inputformbuilder/library/views/formbuilder-edit-js-css-images.html',
      controllerAs:'vm',
      controller: 'FormBuilderEditJsCssCtrl'
    });

    $stateProvider.state(ImagesConst.EDIT_IMAGES_STATE, {
      url: '/editimages',
      templateUrl: 'modules/admin/inputformbuilder/library/views/formbuilder-edit-js-css-images.html',
      controllerAs:'vm',
      controller: 'FormBuilderEditJsCssCtrl'
    });

    $stateProvider.state(StylesConst.EDIT_STYLES_STATE, {
      url: '/editstyles',
      templateUrl: 'modules/admin/inputformbuilder/library/views/formbuilder-edit-js-css-images.html',
      controllerAs:'vm',
      controller: 'FormBuilderEditJsCssCtrl'
    });
  }
}());
