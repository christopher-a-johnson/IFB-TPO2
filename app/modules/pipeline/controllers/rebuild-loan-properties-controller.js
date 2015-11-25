/**
 * Created by APenmatcha on 4/8/2015.
 */
(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('RebuildLoanPropertiesController',
    RebuildLoanPropertiesController);
  /* @ngInject */
  function RebuildLoanPropertiesController(PipelineDataStore, encompass, PipelineConst,
                                           applicationLoggingService, modalWindowService, $timeout) {

    var vm = this;
    vm.rebuildLoanClick = rebuildLoanClick;
    vm.closeLoanProperties = closeLoanProperties;

    vm.loanProperties = PipelineDataStore.LoanPropertiesInfo;

    function rebuildLoanClick() {
      /* Rebuild Loan - Thick call */
      $timeout(function () {
        var rebuildLoanData = {
          'LoanFolder': vm.loanProperties.loanFolder,
          'LoanName': vm.loanProperties.loanName
        };
        var jsonParams = JSON.stringify(rebuildLoanData);
        encompass.rebuildLoan(jsonParams, vm.rebuildLoanCallback);
      }, 0, false);
    }

    vm.rebuildLoanCallback = function (resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.RebuildLoanCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    };

    function closeLoanProperties() {
      modalWindowService.closeRebuildLoanPropertiesWindow();
    }

    /* Initialization code */
    function initialize() {
    }

    initialize();
  }
}());
