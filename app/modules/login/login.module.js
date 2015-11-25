(function () {
  'use strict';

  angular.module('elli.encompass.web.login', []);
  angular.module('elli.encompass.web.login').config(loginConfig);

  /* @ngInject */
  function loginConfig($stateProvider) {
    // State Configuration
    $stateProvider.state('login', {
      url: '/login?thick&next',
      templateUrl: 'modules/login/views/login.html'
    });
  }
}());
