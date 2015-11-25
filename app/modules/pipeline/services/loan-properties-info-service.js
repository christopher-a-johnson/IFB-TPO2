/**
 * Created by APenmatcha on 4/1/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('LoanPropertiesInfoService', LoanPropertiesInfoService);

  function LoanPropertiesInfoService(Restangular, PipelineDataStore, _) {
    return {
      resolvePromise: function (payload) {
        return Restangular.all('pipeline/loan/getloanpropertiesinfo').post(payload).then(function (response) {
          PipelineDataStore.LoanPropertiesInfo.data = angular.copy(response.GetLoanPropertiesInfoResponse1.loanPropertiesInfoField);
          PipelineDataStore.LoanPropertiesInfo.size = PipelineDataStore.LoanPropertiesInfo.data.sizeField;
          PipelineDataStore.LoanPropertiesInfo.GUID = PipelineDataStore.LoanPropertiesInfo.data.identityField.guidField;
          PipelineDataStore.LoanPropertiesInfo.loanName = PipelineDataStore.LoanPropertiesInfo.data.identityField.loanNameField;
          PipelineDataStore.LoanPropertiesInfo.loanFolder = PipelineDataStore.LoanPropertiesInfo.data.identityField.loanFolderField;
        });
      }
    };
  }
}());
