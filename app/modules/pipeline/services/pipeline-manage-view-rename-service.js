(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('RenameViewData', RenameViewData);
  function RenameViewData(Restangular, PipelineViewListData, PipelineDataStore, _) {
    return {
      resolvePromise: function (payload) {
        PipelineDataStore.PipelineViewListDataStore.newViewName = payload.Modified;
        return Restangular.all('pipeline/view/rename').post(payload).then(function () {
          PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0].ViewName =
            PipelineDataStore.PipelineViewListDataStore.newViewName;
          PipelineViewListData.resolvePromise().then(function () {
            //update the pipeline view dropdown with the renamed view
            if (PipelineDataStore.PipelineViewListDataStore.selectedItem.ViewName === payload.Name) {
              PipelineDataStore.PipelineViewListDataStore.selectedItem = _.findWhere(PipelineDataStore
                .PipelineViewListDataStore.items, {Name: PipelineDataStore.PipelineViewListDataStore.newViewName});
            }
          });
        });
      }
    };
  }
}());
