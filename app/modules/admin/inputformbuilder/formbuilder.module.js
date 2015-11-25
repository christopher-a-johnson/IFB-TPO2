(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder', [
    'elli.encompass.web.admin.formbuilder.constant',
    'elli.encompass.web.admin.formbuilder.formlist',
    'elli.encompass.web.admin.formbuilder.assetlibrary'
  ]);

  angular.module('elli.encompass.web.admin.formbuilder').config(formBuilderConfig);

  /* @ngInject */
  function formBuilderConfig($stateProvider) {
    $stateProvider.state('admin.formbuilder', {
      /*jshint -W024 */
      abstract: true,
      url: '/formbuilder',
      template: '<ui-view>'
    });
  }

  //TODO: can we pass this id from template, instead of hard coding?
  var kndoInit = {
    gridObj: '#ngen-formbuilder-grid'
  };

  window.IFB_NAMESPACE.KendoInteraction.init(kndoInit);
}());
