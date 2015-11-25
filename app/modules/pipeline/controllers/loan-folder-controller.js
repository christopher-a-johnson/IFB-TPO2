(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('LoanFolderController', LoanFolderController);

  /* @ngInject */
  function LoanFolderController(modalWindowService, PipelineDataStore, _, PipelineConst,
                                $rootScope, PipelineEventsConst) {
    var vm = this;
    vm.dataStore = PipelineDataStore;

    vm.companyViewChanged = function () {
      if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
        PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: new Date().getTime(), ACTION:'COMPANY CHANGED'};
      }
      $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      if (vm.dataStore.CompanyViewDropdownData.selectedItem.id === 'TPO') {
        vm.dataStore.externalOrg = {id: '-1', name: 'All'};
      }
      else {
        vm.dataStore.externalOrg = {id: null, name: ''};
      }
    };

    vm.loanFolderChanged = function () {
      if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
        PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: new Date().getTime(), ACTION:'FOLDER CHANGED'};
      }
      setDeleteLoanAccess();
      $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      $rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT);
    };

    vm.loanViewChanged = function () {
      if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
        PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: new Date().getTime(), ACTION:'LOAN VIEW CHANGED'};
      }
      $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      $rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT);
    };

    // We need to add top most option "<All Folder>".
    // We are changing here as this data alteration apply to only this dropdown.
    vm.loanFolderDropdownOptions = {
      dataSource: PipelineDataStore.LoanFolderDropdownData.items
    };

    vm.loanViewDropdownOptions = {
      dataSource: PipelineDataStore.LoanViewDropdownData.items,
      dataTextField: 'title',
      dataValueField: 'id'
    };

    vm.companyViewDropdownOptions = {
      dataSource: PipelineDataStore.CompanyViewDropdownData.items,
      dataTextField: 'title',
      dataValueField: 'id'
    };

    vm.showTPOCompaniesPopUp = function () {
      modalWindowService.showTPOCompaniesPopup('TPO Companies');
    };

    function setDeleteLoanAccess() {
      /* jshint ignore: start */
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem === PipelineConst.TrashFolder) {
        PipelineDataStore.deleteLoanAccess = vm.dataStore.PersonaAccess.LoanMgmt['LoanMgmt_TF_Delete'];
      }
      else {
        PipelineDataStore.deleteLoanAccess = vm.dataStore.PersonaAccess.LoanMgmt['LoanMgmt_Delete'];
      }
      /* jshint ignore: end */
    }

    /* Initialization code */
    function initialize() {
    }

    initialize();
  }
}());
