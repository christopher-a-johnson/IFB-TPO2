(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('SnoozeAlertService', snoozeAlertService);

  /* @ngInject */
  function snoozeAlertService(Restangular) {
    return {
      resolvePromise: function (payload) {
        return Restangular.all('pipeline/loan/snoozealert').post(payload);
      }
    };
  }
}());
