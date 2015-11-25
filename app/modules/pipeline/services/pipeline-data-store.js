(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PipelineDataStore', PipelineDataStore);

  function PipelineDataStore() {
    return {
      VERBOSE_LOG: {
        START_TIME: 0,
        API_DATA_LOADED: false,
        ACTION: ''
      },
      saveButtonDisabled: true,
      resetButtonDisabled: true,
      duplicateButtonDisabled: true,
      deleteIconDisabled: true,
      printButtonDisabled: true,
      excelButtonDisabled: true,
      notifyButtonDisabled: true,
      editLoanButtonDisabled: true,
      moveToFolderButtonDisabled: true,
      transferButtonDisabled: true,
      infoIconDisabled: false,
      warningIconDisabled: false,
      moveToFolderApplyCheckDisabled: true,
      deleteLoansApplyCheckDisabled: true,
      resetView: false,
      externalOrg: {id: null, name: null},
      filterSummary: null,
      CustomizeColumnData: {items: []},
      PersonaAccess: {},
      PipelineViewListDataStore: {items: [], selectedItem: null, SeletedItemFromGrid: null, newViewName: null},
      LoanFolderDropdownData: {items: [], selectedItem: null},
      PipelineLoanMailStore: {data: {mailCount: null}},
      PipelineGridData: {
        data: {columns: [], items: []},
        selected: [],
        viewLoaded: false,
        totalResults: null,
        filters: [],
        sort: []
      },
      CompanyViewDropdownData: {
        items: [{id: 'Internal', title: 'Internal Organization'}, {id: 'TPO', title: 'TPO'}],
        selectedItem: null
      },
      LoanViewDropdownData: {
        items: [{id: 'All', title: 'All Loans'}, {id: 'User', title: 'My Loans'}],
        selectedItem: null
      },
      LoanPropertiesInfo: [],
      LoanDuplicationTemplates: {items: []},
      LoanAlertPopupInfo: {items: [], selectedItem: null},
      MoveLoanFolderList: {items: [], selectedItem: null},
      MoveLoanFromFolderList: {items: []},
      LoanMessagesData: {items: []},
      TPOCompaniesData: {items: [], selected: []},
      deleteLoanAccess: false,
      DuplicateLoanAccess: false,
      PrintLoanAccess: false,
      ConfirmModalApplyAllMessage: null,
      AutoRefreshInterval: -1,
      LoansDataLoaded: false,
      AutoRefreshIntervalLoaded: false,
      CustomizeColumnLoaded: false,
      AdvanceFilterShow: false,
      FieldDefinition: {items: [], selectedItem: {}},
      ManageViewListLoaded: false,
      MilestoneProperties: null
    };
  }
}());
