(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('SaveViews', SaveViews);
  /* @ngInject */
  function SaveViews(Restangular, PipelineDataStore, applicationLoggingService, PipelineViewListData) {
    return {
      resolvePromise: function (payload) {
        //console.log('Update view payload', payload);
        return Restangular.all('pipeline/view/saveviews').post(payload).then(
          function () {
            PipelineViewListData.resolvePromise();
            PipelineDataStore.saveButtonDisabled = true;
            PipelineDataStore.resetButtonDisabled = true;
          },
          function (errorResponse) {
            applicationLoggingService.error('SaveViews API failed:' + errorResponse.status + ' ' +
              errorResponse.statusText);
          });
      }
    };
  }
}());
