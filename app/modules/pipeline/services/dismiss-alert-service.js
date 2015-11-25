/**
 * Created by pkinikar on 4/6/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('DismissAlertService', dismissAlertService);

  /* @ngInject */
  function dismissAlertService(Restangular) {
    return {
      resolvePromise: function (payload) {
        return Restangular.all('pipeline/loan/dismissalert').post(payload);
      }
    };
  }
}());
