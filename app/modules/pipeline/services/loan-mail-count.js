(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').factory('PipelineLoanMailCount', PipelineLoanMailCount);

  function PipelineLoanMailCount(Restangular, PipelineDataStore) {
    return {
      resolvePromise: function () {
        return Restangular.one('pipeline/loan/getPipelineLoanMailboxMsgsCount').get().then(function (response) {
          angular.copy(response, PipelineDataStore.PipelineLoanMailStore.data);
          PipelineDataStore.PipelineLoanMailStore.data.mailCount = Number(PipelineDataStore.PipelineLoanMailStore
            .data[0]);
        });
      }
    };
  }
})();
