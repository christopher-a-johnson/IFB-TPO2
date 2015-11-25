(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('DeletePipelineView', DeletePipelineView);
  function DeletePipelineView(Restangular, PipelineViewListData, PipelineDataStore) {
    return {
      resolvePromise : function (payload) {
        return Restangular.all('pipeline/view/deleteview').post(payload).then(function () {
          PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = null;
        });
      }
    };
  }
}());
