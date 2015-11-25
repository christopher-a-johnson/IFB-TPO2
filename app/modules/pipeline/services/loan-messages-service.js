(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('LoanMessagesService', LoanMessagesService);

  /* @ngInject */
  function LoanMessagesService(Restangular, _, PipelineDataStore) {
    return {
      resolvePromise: function (payload) {
        return Restangular.all('pipeline/loan/getmessages').post(payload).then(function (response) {
          angular.copy(response.PipelineLoanMessages, PipelineDataStore.LoanMessagesData.items);
        });
      }
    };
  }
}());
