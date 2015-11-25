(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline', []);

  angular.module('elli.encompass.web.pipeline').config(pipelineConfig);

  /* @ngInject */
  function pipelineConfig($stateProvider, wcOverlayConfigProvider, ENV) {
    $stateProvider.state('pipeline', {
      url: '/pipeline?thick',
      templateUrl: 'modules/pipeline/views/pipeline-main.html',
      resolve: {
        pipelineGetColumnDef: 'PipelineGetColumnDef',
        personaAccessService: 'PersonaAccessService',
        pipelineGetView: 'PipelineGetView',
        resolvePromises: function ($q, PipelineGetColumnDef, PersonaAccessService, PipelineGetView, PipelineGetLoans, PipelineDataStore) {
          if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
            PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: new Date().getTime(), ACTION: 'INITIAL LOAD'};
          }
          return $q.all([PipelineGetColumnDef.resolvePromise(), PersonaAccessService.resolvePromise()]).then(function () {
            return PipelineGetView.resolvePromise().then(function () {
              return PipelineGetLoans.resolvePromise();
            });
          });
        }
      },
      onEnter: function ($timeout, encompass) {
        $timeout(function () {
          var jsonParams = {HelpTargetName: 'PipelinePage'};
          encompass.setHelpTargetName(JSON.stringify(jsonParams), setHelpTargetCallBack);
        }, 0, false);
      },
      onExit: function ($timeout, encompass) {
        $timeout(function () {
          var jsonParams = {HelpTargetName: ''};
          encompass.setHelpTargetName(JSON.stringify(jsonParams), setHelpTargetCallBack);
        }, 0, false);
      }
    });
    function setHelpTargetCallBack(resp, applicationLoggingService, PipelineConst) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //modal error popup implementations
        applicationLoggingService.error(PipelineConst.SetHelpTargetErrorLog + param.ErrorCode);
      }
    }

    wcOverlayConfigProvider.setExceptionUrls([
      {url: ENV.restURL + '/pipeline/loan/getloandata', method: 'POST'},
      {url: ENV.restURL + '/pipeline/loan/getfoldersformoveloans', method: 'GET'},
      {url: ENV.restURL + '/pipeline/loan/getPipelineLoanMailboxMsgsCount', method: 'GET'}
    ]);
  }

  /* Fixme: Please refactor this into a separate file */
  angular.module('elli.encompass.web.pipeline').constant('PipelineConst', {
    PipelineGridPageSize: 50,
    DefaultColumnWidth: 100,
    Trash: 'Trash',
    PopupTitle: 'Encompass',
    PopupMessage: 'This loan is currently in the Trash folder. ' +
    'Changes to the file will not be saved. Do you still want to open this loan?',
    ResetConfirmationMessage: 'Are you sure you want to discard your changes' +
    ' to the Pipeline and reset the current Pipeline View?',
    ResetTitle: 'Reset Confirmation',
    System: 'System',
    DuplicateViewNameRequiredMessage: 'You must enter a view name. Note that backslashes ( \\ ) are not permitted.',
    SaveViewNameViewErrorMessage: 'You must enter a name for this view. Note that backslashes ( \\ ) are not permitted.',
    CustColumnMinSelectionMessage: 'You must select at least 1 column(s) before saving your changes',
    LoanMailBoxCallBackLog: 'Response Error From Encompass Interaction: openLoanMailbox: Error Code:',
    OpenLoanMailBox: 'Error from click event for open loan loan mailbox button: ',
    RenameRequiredMessage: 'You Must provide a name in the space provided.',
    RenameMaxLengthMessage: 'View name should be less 260 character.',
    RenameView: 'Rename View',
    ManageViewType: 'Custom',
    ConfirmationMessage: 'Are you sure you want to delete the selected view(s)?',
    DeleteButtonError: 'Error from click event for delete view button: ',
    CustReorderError: 'Error while reordering column in customiz column pop up',
    MoveMulipleLoansMessage: 'Are you sure you want to move all selected loans?',
    DataServiceFannie: 'Fannie',
    DataServiceFreddie: 'Freddie',
    InvestorServiceCategoryName: 'Investor Services',
    MaximumColumns: 'Maximum Columns',
    MaximumColumnsMessage: 'You have already selected the maximum number (50) of Pipeline columns to display. ' +
    'To add this column, you must remove at least one of your selected columns.',
    SaveView: 'Save View',
    NameViewErrorTitle: 'Name View Error',
    ExistingViewErrorTitle: 'Existing View Error',
    DeleteMultipleLoansMessage: 'Are you sure you want to delete the selected loans?',
    TimeWarningMessage: 'Please select a snooze duration time',
    Dismissed: 3,
    Snoozed: 2,
    DismissSnoozeDefaultMessage: '-----Dismissed or Snoozed Alerts-----',
    DismissSnoozeDefaultStatus: -1,
    DismissSnoozeDefaultId: -1,
    DismissAdditionalMessage: '(Dismissed)',
    DuplicateLoanConfirmationTitle: 'Duplicate Loan Confirmation',
    DuplicateLoanConfirmationMessage: 'The loan has been successfully duplicated. Do you want to open the duplicated ' +
    'loan?',
    DuplicateBlankLoanPerosnaPropName: 'LoanMgmt_Duplicate_Blank',
    DuplicateLoanPerosnaPropName: 'LoanMgmt_Duplicate',
    DuplicateSecondLoanPerosnaPropName: 'LoanMgmt_Duplicate_For_Second',
    LoanAlerts: ' Loan Alerts',
    InfoIcon: 'Infoicon',
    WarningIcon: 'Warningicon',
    ErrorIcon: 'Erroricon',
    SnoozeDurationTitle: 'Snooze Duration',
    MoveLoanAccessError: 'You are not authorized to move loans between folders.',
    MessagesText: 'Messages ',
    AllFolder: '<All Folders>',
    TrashFolder: '(Trash)',
    Internal: 'Internal',
    ArchiveFolder: '<Archive>',
    MoveToFolderText: 'Move To Folder',
    RestoreToFolderText: 'Restore To Folder',
    MaxLoanAlertTitle: 'Warning',
    MaxLoanAlert: 'MaxLoanAlert',
    MaxLoanAlertMsg: 'You can view <TotalLoans> loans at a time. Use more filters to view loans that may not have been displayed.',
    SetThinPipelineInfos: 'Response Error From Encompass Interaction: SetThinPipelineInfos: Error Code:',
    EFolderExportCallback: 'Response Error From Encompass Interaction: eFolderExport: Error Code:',
    SetPipelineView: 'Response Error From Encompass Interaction: SetPipelineView: Error Code:',
    SetMenuStates: 'Response Error From Encompass Interaction: SetMenuStates: Error Code:',
    NotifyUserCallback: 'Response Error From Encompass Interaction: setNotifyUserCallback: Error Code:',
    NewLoanDialogCallback: 'Response Error From Encompass Interaction: New Loan popup: Error Code:',
    OpenLoanCallBackLog: 'Response Error From Encompass Interaction: EditLoan: Error Code:',
    OpenLoanForEdit: 'Error from click event for edit loan button: Error Code:',
    TransferLoans: 'Error from click event for transfer loan button: Error Code:',
    TransferLoansCallBackLog: 'Response Error From Encompass Interaction: TransferLoan: Error Code:',
    RebuildLoanCallback: 'Response Error From Encompass Interaction: RebuildLoan: Error Code:',
    ExportToExcelCallback: 'Response Error From Encompass Interaction: ExportToExcel: Error Code:',
    PrintFormsCallback: 'Response Error From Encompass Interaction: PrintForms: Error Code:',
    InvestorStandardExport: 'Response Error From Encompass Interaction: investorStandardExportPipeline: Error Code:',
    ExportFannieMaeFormattedFile: 'Response Error From Encompass Interaction: exportFannieMaeFormattedFile: Error Code:',
    ExportLEFCallback: 'Response Error From Encompass Interaction: exportLEF: Error Code:',
    GenerateNMLSReportCallback: 'Response Error From Encompass Interaction: GenerateNMLSReport: Error Code:',
    GenerateNCMLDReportCallback: 'Response Error From Encompass Interaction: GenerateNCMLDReport: Error Code:',
    DuplicateLoan: 'Response Error From Encompass Interaction: duplicateLoan: Error Code:',
    SetHelpTargetErrorLog: 'Response Error From Encompass Interaction: setHelpTargetName: Error Code: ',
    UnavailableFieldIDMessage: 'You have searched for an unavailable field ID. Click the Lookup icon to view a ' +
    'list of available field IDs.',
    CachedDataExpirationTitle: 'Cached Data Expiration',
    CachedDataExpirationMessage: 'Pipeline cache has expired. Data will be refreshed and page 1 of ' +
    'the pipeline will be presented',
    CursorExpired: 'CursorExpired',
    DateFilterStartDate: '01/01/1990',
    DateFilterEndDate: '12/31/2199',
    DateFilterInvalidMessage: 'The value DATE does not represent valid date.',
    DateFilterInvalidRangeMessage: 'The DATE cannot be used.Only dates within STARTDATE - ENDDATE are supported.',
    DateFilterInvalidRangeTitle: 'Date Range Format Error'

  });

  angular.module('elli.encompass.web.pipeline').constant('PipelineEventsConst', {
    LOAD_VIEW_EVENT: 'PIPELINE_LOAD_VIEW_EVENT',
    SET_VIEW_EVENT: 'PIPELINE_SET_VIEW',
    RESET_VIEW_EVENT: 'PIPELINE_RESET_VIEW',
    RESET_GRID_FILTER_EVENT: 'PIPELINE_RESET_GRID_FILTER_EVENT',
    CLEAR_ALL_GRID_FILTER_EVENT: 'PIPELINE_CLEAR_ALL_GRID_FILTER_EVENT',
    RESET_GRID_SORT_EVENT: 'PIPELINE_RESET_GRID_SORT_EVENT',
    RESET_GRID_PAGE_EVENT: 'PIPELINE_RESET_GRID',
    REFRESH_GRID_EVENT: 'PIPELINE_REFRESH_GRID',
    LOAN_EDIT_EVENT: 'PIPELINE_EDIT_LOAN',
    LOAN_IMPORT_EVENT: 'PIPELINE_IMPORT_LOAN',
    LOAN_DUPLICATE_EVENT: 'PIPELINE_DUPLICATE_LOAN',
    LOAN_NEW_EVENT: 'PIPELINE_NEW_LOAN',
    LOAN_TRANSFER_EVENT: 'PIPELINE_TRANSFER_LOAN',
    LOAN_DELETE_EVENT: 'PIPELINE_DELETE_LOAN',
    LOAN_PRINT_EVENT: 'PIPELINE_PRINT_FORMS',
    LOAN_EXPORT_EXCEL_EVENT: 'PIPELINE_EXPORT_EXCEL_EVENT',
    LOAN_ALERT_EVENT: 'PIPELINE_ALERT_EVENT',
    LOAN_MOVE_FOLDER_EVENT: 'LOAN_MOVE_FOLDER_EVENT',
    MOVE_FOLDER_EVENT_FROM_MAIN_MENU: 'MOVE_FOLDER_EVENT_FROM_MAIN_MENU',
    MOVE_FOLDER_LIST_LOADED_EVENT: 'PIPELINE_MOVE_FOLDER_LIST_LOADED_EVENT',
    MAX_LOANS_EVENT: 'PIPELINE_MAX_LOANS_EVENT',
    PIPELINE_AUTOREFRESH_EVENT: 'PIPELINE_AUTOREFRESH_ERROR_EVENT',
    CUSTOMIZE_COLUMN_EVENT: 'CUSTOMIZE_COLUMN_EVENT',
    MANAGE_VIEW_EVENT: 'MANAGE_VIEW_EVENT',
    RESET_VIEW_MENU_EVENT: 'RESET_VIEW_MENU_EVENT',
    ENABLE_SAVE_RESET_BUTTON_EVENT: 'ENABLE_SAVE_RESET_BUTTON_EVENT',
    SAVE_VIEW: 'SAVE_VIEW',
    EXPORT_LEF_SELECTED_EVENT: 'EXPORT_LEF_SELECTED_EVENT',
    EXPORT_LEF_ALL_EVENT: 'EXPORT_LEF_ALL_EVENT',
    EXPORT_FNM_SELECTED_EVENT: 'EXPORT_FNM_SELECTED_EVENT',
    EXPORT_FNM_ALL_EVENT: 'EXPORT_FNM_ALL_EVENT',
    EXPORT_FNM_FORMATTED_FILE_EVENT: 'EXPORT_FNM_FORMATTED_FILE_EVENT',
    EXPORT_FRE_SELECTED_EVENT: 'EXPORT_FRE_SELECTED_EVENT',
    EXPORT_FRE_ALL_EVENT: 'EXPORT_FRE_ALL_EVENT',
    GENERATE_NMLS_EVENT: 'GENERATE_NMLS_EVENT',
    NCAR_COMPLIANCE_REPORT_EVENT: 'NCAR_COMPLIANCE_REPORT_EVENT',
    OPEN_ADVANCED_FILTER: 'PIPELINE_OPEN_ADVANCED_FILTER',
    PIPELINE_WINDOW_RESIZE_EVENT: 'PIPELINE_WINDOW_RESIZE_EVENT'
  });

}());
