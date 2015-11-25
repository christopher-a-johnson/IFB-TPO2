/**
 * Created by rkumar3 on 5/25/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('ReactivateAlertService', reactivateAlertService);
  function reactivateAlertService(Restangular) {
    return {
      resolvePromise: function (payload) {
        return Restangular.all('pipeline/loan/reactivatealert').post(payload);
      }
    };
  }
}());
