(function () {
  'use strict';

  angular.module('elli.encompass.web.admin', [
    'elli.encompass.web.admin.formbuilder'
  ]);

  angular.module('elli.encompass.web.admin').config(adminConfig);

  /* @ngInject */
  function adminConfig($stateProvider) {
    $stateProvider.state('admin', {
      url: '/admin?thick',
      templateUrl: 'modules/admin/views/admin.html'
    });

  }
}());
