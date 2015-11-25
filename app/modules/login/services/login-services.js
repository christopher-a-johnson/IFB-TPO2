(function () {
  'use strict';

  angular.module('elli.encompass.web.login').factory('LoginService', createLoginService);

  /* @ngInject */
  function createLoginService(Restangular) {
    var service = {};

    var authUrl = Restangular.all('user/session');

    service.getLoginPromise = function (cred) {
      return authUrl.post(cred);
    };

    return service;
  }

})();
