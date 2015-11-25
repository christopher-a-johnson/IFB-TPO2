(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('ModalDuplicateLoanController', ModalDuplicateLoanController);

  /* @ngInject */
  function ModalDuplicateLoanController(PipelineDataStore, modalWindowService, encompass, applicationLoggingService, PipelineConst,
                                        LoanDuplicationTemplate, _) {
    var vm = this;
    vm.dataStore = PipelineDataStore;
    vm.loanFolderDropdownOptions = {
      dataSource: _.without(PipelineDataStore.LoanFolderDropdownData.items, PipelineConst.AllFolder, PipelineConst.TrashFolder)
    };
    vm.loanTemplateDropdownOptions = {
      dataSource: PipelineDataStore.LoanDuplicationTemplates.items
    };

    function duplicateLoanCallBack(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        applicationLoggingService.error(PipelineConst.DuplicateLoan + param.ErrorCode + '; Message:' + param.ErrorMessage);
      }
    }

    vm.okClick = function () {
      if (vm.selectedLoan && vm.selectedLoan !== '') {
        vm.cancelClick();
        encompass.duplicateLoan(JSON.stringify({
          IsSecond: vm.loanDuplicateOption === '2',
          IsPiggyback: vm.loanDuplicateOption === '3',
          DestinationFolder: (vm.selectedLoan.substring(0, 1) === '<' ?
            vm.selectedLoan.substring(1, vm.selectedLoan.length - 1) : vm.selectedLoan),
          TemplateToUse: (vm.loanDuplicateOption === '2' || vm.loanDuplicateOption === '3' ||
          vm.selectedTemplate === null ? '' : vm.selectedTemplate.trim())
        }), duplicateLoanCallBack);
      } else {
        applicationLoggingService.error(PipelineConst.DuplicateLoan + 'n/a; Message: Loan Folder is empty/not selected!');
      }
    };

    vm.cancelClick = function () {
      modalWindowService.modalDuplicateLoan.close();
    };

    /* Initialization code */
    function initialize() {
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem &&
        PipelineDataStore.LoanFolderDropdownData.selectedItem !== PipelineConst.AllFolder) {
        vm.selectedLoan = PipelineDataStore.LoanFolderDropdownData.selectedItem;
      } else {
        vm.selectedLoan = PipelineDataStore.LoanFolderDropdownData.items.length > 0 ?
          _.findWhere(PipelineDataStore.LoanFolderDropdownData.items, PipelineDataStore.PipelineGridData.selected[0].Loan$LoanFolder) : '';
      }
      vm.selectedTemplate = null;
      vm.duplicateSelectedLoanDisabled = false;
      vm.duplicateSecondLienDisabled = false;
      LoanDuplicationTemplate.resolvePromise();
      if (typeof PipelineDataStore.PersonaAccess.LoanMgmt !== 'undefined') {
        vm.mustUseTemplate = PipelineDataStore.PersonaAccess.LoanMgmt[PipelineConst.DuplicateBlankLoanPerosnaPropName];
        vm.duplicateSelectedLoanDisabled = !PipelineDataStore.PersonaAccess.LoanMgmt[PipelineConst.DuplicateLoanPerosnaPropName];
        vm.duplicateSecondLienDisabled = !PipelineDataStore.PersonaAccess.LoanMgmt[PipelineConst.DuplicateSecondLoanPerosnaPropName];
      }
      vm.loanDuplicateOption = vm.duplicateSelectedLoanDisabled ? (vm.duplicateSecondLienDisabled ? '3' : '2') : '1';
    }

    initialize();
  }
}());
