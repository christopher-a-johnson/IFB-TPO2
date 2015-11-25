/**
 * Created by apenmatcha on 3/20/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('DeletePipelineLoan', DeletePipelineLoan);
  function DeletePipelineLoan(Restangular) {
    return {
      resolvePromise: function (payload) {
        return Restangular.all('pipeline/loan/deleteloan').post(payload);
      }
    };
  }
}());
