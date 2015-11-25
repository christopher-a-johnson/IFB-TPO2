/**
 * Created by APenmatcha on 3/10/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('MovePipelineLoan', MovePipelineLoan);
  function MovePipelineLoan(Restangular) {
    return {
      resolvePromise: function (payload) {
        return Restangular.all('pipeline/loan/MoveToFolder').post(payload);
      }
    };
  }
}());
