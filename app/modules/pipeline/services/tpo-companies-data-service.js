(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('TPOCompaniesService', TPOCompaniesService);

  /* @ngInject */
  function TPOCompaniesService(Restangular, PipelineDataStore) {
    return {
      resolvePromise: function () {
        return Restangular.one('pipeline/view/externalorginfo').withHttpConfig({cache: true}).get().then(function (response) {
          if (typeof response !== 'undefined' && response !== null) {
            angular.copy(response.ExternalOrgInfoList, PipelineDataStore.TPOCompaniesData.items);
          }
        });
      }
    };
  }
}());
