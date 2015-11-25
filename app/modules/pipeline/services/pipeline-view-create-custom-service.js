(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('CreateCustomView', CreateCustomView);
  /* @ngInject */
  function CreateCustomView(Restangular, PipelineDataStore, PipelineViewListData, applicationLoggingService, _) {
    return {
      resolvePromise: function (payload) {
        //console.log('Create new View payload', payload);
        return Restangular.all('pipeline/view/createcustompipelineview').post(payload).then(
          function () {
            PipelineViewListData.resolvePromise().then(function () {
              //selected newly created custom view in pipeline view dropdown list
              PipelineDataStore.PipelineViewListDataStore.selectedItem = _.findWhere(PipelineDataStore
                .PipelineViewListDataStore.items, {Name: payload.CustomPipelineView.Name});
            });
            PipelineDataStore.saveButtonDisabled = true;
            PipelineDataStore.resetButtonDisabled = true;
          },
          function (errorResponse) {
            applicationLoggingService.error('CreateCustomPipelineView failed:' + errorResponse.status + ' ' +
              errorResponse.statusText);
          });
      }
    };
  }
}());
