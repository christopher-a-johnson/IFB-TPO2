(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('DuplicateViewService', DuplicateViewService);

  function DuplicateViewService(Restangular, PipelineViewListData, PipelineDataStore) {
    return {
      resolvePromise : function (payload) {
        return Restangular.all('pipeline/view/duplicate').post(payload).then(function () {
          PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = null;
          PipelineViewListData.resolvePromise();
        });
      }
    };
  }
}());
