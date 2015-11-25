(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('LoanFolderDropdownData', LoanFolderDropdownData);

  /* @ngInject */
  function LoanFolderDropdownData(Restangular, _, PipelineDataStore) {
    return {
      resolvePromise: function () {
        var restangular = Restangular.withConfig(function (Configurer) {
          Configurer.setBaseUrl('/api/v1');
          Configurer.setRequestSuffix('.json');
        });
        return restangular.all('loanFolderDropdownData').getList().then(function (response) {
          angular.copy(response, PipelineDataStore.LoanFolderDropdownData.items);
        });
      }
    };
  }
}());
