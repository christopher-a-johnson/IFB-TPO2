(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PipelineAutoRefresh', PipelineAutoRefresh);
  /* @ngInject */
  function PipelineAutoRefresh(PipelineDataStore, Restangular, $q) {
    return {
      resolvePromise: function () {
        var defer = $q.defer();
        if (PipelineDataStore.PersonaAccess.LoanMgmt &&
          PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_PipelineAutoRefresh) {
          var payload = {
            Category: 'Pipeline',
            Setting: 'RefreshInterval'
          };
          return Restangular.all('user/getusersettings').post(payload).then(function (response) {
            PipelineDataStore.AutoRefreshInterval = parseInt(response.SettingsField[0].Value, 10);
            PipelineDataStore.AutoRefreshIntervalLoaded = true;
          });
        } else {
          defer.resolve();
          return defer.promise;
        }
      }
    };
  }
}());
