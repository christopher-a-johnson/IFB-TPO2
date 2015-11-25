(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline')
    .factory('SetDefaultViewData', SetDefaultViewData);
  function SetDefaultViewData(Restangular, PipelineViewListData) {
    return {
      resolvePromise : function (payload) {
        return Restangular.all('pipeline/view/setasdefault').post(payload).then(function () {
          PipelineViewListData.resolvePromise();
        });
      }
    };
  }
}());
