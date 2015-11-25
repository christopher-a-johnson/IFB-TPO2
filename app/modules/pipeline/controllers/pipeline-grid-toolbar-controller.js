(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline')
    .controller('PipelineGridToolbarController', PipelineGridToolbarController);

  /* @ngInject */
  function PipelineGridToolbarController(LoanFolderDropdownData, PipelineDataStore, applicationLoggingService,
                                         encompass, PipelineConst, modalWindowService, $timeout, SetMenuStateService,
                                         $scope, $rootScope, PipelineEventsConst, _, MovePipelineLoan,
                                         SetPipelineViewXmlService) {

    var vm = this;

    var windowInstance;
    var moveToFolderName; //This folder name is coming from the MoveToFolder action inside the Pipeline Grid Context Menu
    var loanGuids = [];
    var loansCollection;

    vm.isDisableNewLoan = true;
    vm.showDuplicateLoanButton = false;
    vm.deleteLoanAccess = false;
    var windoInstance;
    vm.pipelineConstants = PipelineConst;
    vm.pipelineViewDataStore = PipelineDataStore;
    vm.showMoveConfirmation = showMoveConfirmation;

    function setOpenLoanCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.OpenLoanCallBackLog + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    vm.duplicateButtonClicked = function () {
      SetPipelineViewXmlService.setPipelineViewXml();
      modalWindowService.modalDuplicateLoan.open();
    };

    vm.deleteLoanButtonClicked = function () {
      SetPipelineViewXmlService.setPipelineViewXml();
      var title;
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem === PipelineConst.TrashFolder) {
        title = 'Permanently Delete Loan';
      }
      else {
        title = 'Delete Loan';
      }
      modalWindowService.showDeleteLoanPopup(title);
    };

    vm.refreshPipelineClicked = function () {
      $rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT);
    };

    vm.moveToFolderClicked = function () {
      openMoveRestorePopup('Move Loans');
    };

    //restore to folder
    vm.restoreToFolderClicked = function () {
      openMoveRestorePopup('Restore Loans');
    };

    function openMoveRestorePopup(title) {
      SetPipelineViewXmlService.setPipelineViewXml();
      var moveLoanFolderList = PipelineDataStore.MoveLoanFolderList.items || [];
      if (moveLoanFolderList.length >= 1) {
        modalWindowService.showMoveToFolderPopup(title);
      }
      else {
        PipelineDataStore.warningIconDisabled = true;
        modalWindowService.showWarningPopup(PipelineConst.MoveLoanAccessError, PipelineConst.PopupTitle,
          'Warningicon');
      }
    }

    vm.openPrintDialog = openPrint;

    function openPrint() {
      SetPipelineViewXmlService.setPipelineViewXml();
      $timeout(function () {
        encompass.printForms('', printDialogCallback);
      }, 0, false);
    }

    function printDialogCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.PrintFormsCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    /***
     * This is for New Loan icon click event
     */
    vm.openNewLoanPopUp = openNewLoan;

    function openNewLoan() {
      SetPipelineViewXmlService.setPipelineViewXml();
      //to open new loan dialog
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem !== PipelineConst.TrashFolder &&
        PipelineDataStore.LoanFolderDropdownData.selectedItem !== PipelineConst.ArchiveFolder) {
        $timeout(function () {
          encompass.createNewLoan(null, newLoanDialogCallback);
        }, 0, false);
      }

    }

    /***
     * This will receive the call back from create new loan popup open call
     * @param {string} resp - receive the response
     */
    function newLoanDialogCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.NewLoanDialogCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    vm.editLoanClicked = openLoanForEdit;

    /***
     * This is for Export icon click event
     */
    function openLoanForEdit() {
      SetPipelineViewXmlService.setPipelineViewXml();
      if (LoanFolderDropdownData.selectedItemTitle === PipelineConst.Trash) {
        windoInstance = modalWindowService.showConfirmationPopup(PipelineConst.PopupMessage, PipelineConst.PopupTitle);
        windoInstance.result.then(function (result) {
          if (!result) {
            $timeout(function () {
              encompass.openLoan('', setOpenLoanCallback);
            }, 0, false);
          }
        });
      }
      else {
        $timeout(function () {
          encompass.openLoan('', setOpenLoanCallback);
        }, 0, false);
      }
    }

    /***
     * Transfer Loan PopUp
     */
    vm.openTransferLoanPopUp = openTransferLoan;

    function openTransferLoan() {
      SetPipelineViewXmlService.setPipelineViewXml();
      var jsonParams = {ThinPipelineInfos: PipelineDataStore.PipelineGridData.selected};
      $timeout(function () {
        encompass.transferLoans(JSON.stringify(jsonParams), transferLoansCallback);
      }, 0, false);
    }

    function openImportLoan() {
      SetPipelineViewXmlService.setPipelineViewXml();
      var jsonParams = {ThinPipelineInfos: PipelineDataStore.PipelineGridData.selected};
      $timeout(function () {
        encompass.importLoans(JSON.stringify(jsonParams), importLoansCallback);
      }, 0, false);
    }

    /***
     * This will receive the call back from transfer Loan.
     * @param {object} resp - receive the response
     */
    function transferLoansCallback(resp) {
      var param = JSON.parse(resp);
      if ((typeof param.errorCode !== 'undefined') && param.errorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.TransferLoansCallBackLog + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    /***
     * This will receive the call back from import Loan.
     * @param {object} resp - receive the response
     */
    function importLoansCallback(resp) {
      var param = JSON.parse(resp);
      if ((typeof param.errorCode !== 'undefined') && param.errorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.TransferLoansCallBackLog + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    vm.exportToExcel = exportToExcel;

    function exportToExcel(exportAll) {
      SetPipelineViewXmlService.setPipelineViewXml();
      $timeout(function () {
        encompass.exportToExcel(JSON.stringify({ExportAll: exportAll}), exportToExcelCallback);
      }, 0, false);
    }

    function exportToExcelCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.ExportToExcelCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    /*Move to folder controller part*/
    function showMoveConfirmation() {
      SetPipelineViewXmlService.setPipelineViewXml();
      PipelineDataStore.applyCheckClicked = false;
      PipelineDataStore.moveToFolderApplyCheckDisabled = true; //reset 'Apply to all' checkbox
      loansCollection = PipelineDataStore.PipelineGridData.selected.slice();

      var title = 'Move Loan Confirmation';
      // construct appropriate label for single vs multiple loan selections.
      if (loansCollection && loansCollection.length === 1) {
        var BorrowerName = loansCollection[0].Loan$BorrowerName;
        var LoanNumber = loansCollection[0].Fields$364;
        vm.messageText = 'Are you sure you want to move ' + BorrowerName + ' (#' + LoanNumber + ')?';
        windowInstance = modalWindowService.showConfirmationPopup(vm.messageText, title);
        windowInstance.result.then(function (result) {
          if (!result && result !== null) {
            //Add loanGuid to the loans list to move this loan to the folder
            loanGuids.push({
              'loanGuid': loansCollection[0].Loan$Guid
            });
            moveLoansToFolders(loanGuids);
          }
          else {
            loanGuids = [];
          }
        });
      }
      else {
        multipleConfirmationPopups(loansCollection);
      }
    }

    function multipleConfirmationPopups(loansCollection) {

      PipelineDataStore.moveToFolderApplyCheckDisabled = false;

      if (loansCollection && loansCollection.length === 1) {
        // When remaining loan is only 1 then check box and message should not be visible.
        PipelineDataStore.moveToFolderApplyCheckDisabled = true;
      }

      if (loansCollection && loansCollection.length < 1) {
        PipelineDataStore.moveToFolderApplyCheckDisabled = true; //To reset apply to all checkbox
        return void 0;
      }

      var _tempLoanGuids = [];
      var title = 'Move Loan Confirmation';
      var BorrowerName = loansCollection[0].Loan$BorrowerName;
      var LoanNumber = loansCollection[0].Fields$364;
      var messageText = 'Are you sure you want to move ' + BorrowerName + ' (#' + LoanNumber + ')?';
      PipelineDataStore.ConfirmModalApplyAllMessage = PipelineConst.MoveMulipleLoansMessage;
      windowInstance = modalWindowService.showConfirmationPopup(messageText, title);
      windowInstance.result.then(function (result) {
        if (!result && result !== null) {
          //If the "Apply All" checkbox is selected, then move all loans after another confirmation popup
          if (PipelineDataStore.applyCheckClicked) {
            _.each(loansCollection, function (loanItem) {
              _tempLoanGuids.push({
                'loanGuid': loanItem.Loan$Guid
              });
            });
            loansCollection.length = 0;
            moveLoansToFolders(_tempLoanGuids);
          } else { //Move one loan at a time
            _tempLoanGuids.push({
              'loanGuid': loansCollection[0].Loan$Guid
            });
            loansCollection.shift();
            moveLoansToFolders(_tempLoanGuids);
          }
        } else {
          if (PipelineDataStore.applyCheckClicked) { //ignore all loans
            loansCollection.length = 0;
          } else {
            loansCollection.shift();
          }
        }
        multipleConfirmationPopups(loansCollection, _tempLoanGuids);
      });
    }

    function moveLoansToFolders(loans) {
      var IsExternalOrganization = true;
      var loanOrganization = PipelineDataStore.CompanyViewDropdownData.selectedItem;
      var loanGuidData = loans;
      if (loanOrganization === 'Internal') {
        IsExternalOrganization = false;
      }
      //construct the object for API call
      var moveLoanFolderObj = {
        'IsExternalOrganization': IsExternalOrganization,
        'TargetFolderName': moveToFolderName,
        'Loans': loanGuidData
      };
      //add call to Service API
      loanGuids = [];
      PipelineDataStore.moveToFolderApplyCheckDisabled = true;
      MovePipelineLoan.resolvePromise(moveLoanFolderObj).then(function () {
        $rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT, {refreshCurrentPage: true});
      });
    }

    /* Event Listeners */
    $scope.$on(PipelineEventsConst.LOAN_NEW_EVENT, function (event, data) {
      if (!vm.isDisableNewLoan) {
        openNewLoan();
      }
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.LOAN_EDIT_EVENT, function (event, data) {
      openLoanForEdit();
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.LOAN_IMPORT_EVENT, function (event, data) {
      openImportLoan();
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.LOAN_DUPLICATE_EVENT, function (event, data) {
      vm.duplicateButtonClicked();
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.LOAN_TRANSFER_EVENT, function (event, data) {
      openTransferLoan();
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.LOAN_DELETE_EVENT, function (event, data) {
      vm.deleteLoanButtonClicked();
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.LOAN_PRINT_EVENT, function (event, data) {
      if (PipelineDataStore.PrintLoanAccess) {
        openPrint();
      }
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.LOAN_EXPORT_EXCEL_EVENT, function (event, data) {
      exportToExcel(data.exportAll);
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT, function (event, data) {
      moveToFolderName = data.folder;
      showMoveConfirmation();
      event.defaultPrevented = true;
    });
    $scope.$on(PipelineEventsConst.MOVE_FOLDER_EVENT_FROM_MAIN_MENU, function (event, data) {
      /* If trash folder is selected then instead of Move to Folder, Restore loan popup will be opened. */
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem === PipelineConst.TrashFolder) {
        vm.restoreToFolderClicked();
      }
      else {
        vm.moveToFolderClicked();
      }
      event.defaultPrevented = true;
    });

    /* Initialization code */
    function initialize() {
      /* jshint ignore: start */
      if (typeof vm.pipelineViewDataStore.PersonaAccess.LoanMgmt !== 'undefined') {
        vm.isDisableNewLoan = (!vm.pipelineViewDataStore.PersonaAccess.LoanMgmt['LoanMgmt_CreateBlank']
        && !vm.pipelineViewDataStore.PersonaAccess.LoanMgmt['LoanMgmt_CreateFromTmpl']);

        vm.showDuplicateLoanButton = vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate_Blank ||
        vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate_For_Second ||
        vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate;

        PipelineDataStore.deleteLoanAccess = (PipelineDataStore.LoanFolderDropdownData.selectedItem ===
        PipelineConst.TrashFolder) ? vm.pipelineViewDataStore.PersonaAccess.LoanMgmt['LoanMgmt_TF_Delete'] :
          vm.pipelineViewDataStore.PersonaAccess.LoanMgmt['LoanMgmt_Delete'];

        PipelineDataStore.DuplicateLoanAccess = vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate_Blank ||
        vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate_For_Second ||
        vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate;

        PipelineDataStore.PrintLoanAccess = vm.pipelineViewDataStore.PersonaAccess.LoansTab.LoansTab_Print_PrintButton ||
        vm.pipelineViewDataStore.PersonaAccess.LoansTab.LoansTab_Print_ToPDF ||
        vm.pipelineViewDataStore.PersonaAccess.LoansTab.LoansTab_Print_Preview ||
        vm.pipelineViewDataStore.PersonaAccess.LoansTab.LoansTab_Print_CustomForms ||
        vm.pipelineViewDataStore.PersonaAccess.LoansTab.LoansTab_Print_StandardForms;

        var menuStates = [{
          MenuItemTag: 'PI_New',
          Enabled: !vm.isDisableNewLoan,
          Visible: !vm.isDisableNewLoan
        }, {
          MenuItemTag: 'PI_Delete',
          Enabled: !PipelineDataStore.deleteIconDisabled && vm.pipelineViewDataStore.deleteLoanAccess,
          Visible: vm.pipelineViewDataStore.deleteLoanAccess
        }, {
          MenuItemTag: 'PI_ExportSelected',
          Enabled: !PipelineDataStore.excelButtonDisabled && vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_ExportToExcel,
          Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_ExportToExcel
        }, {
          MenuItemTag: 'PI_ExportAll',
          Enabled: !PipelineDataStore.excelButtonDisabled && vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_ExportToExcel,
          Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_ExportToExcel
        }, {
          MenuItemTag: 'PI_Print',
          Enabled: !PipelineDataStore.printButtonDisabled && PipelineDataStore.PrintLoanAccess,
          Visible: vm.pipelineViewDataStore.PrintLoanAccess
        }, {
          MenuItemTag: 'PI_Transfer',
          Enabled: (PipelineDataStore.LoanFolderDropdownData.selectedItem !== PipelineConst.TrashFolder
          && !PipelineDataStore.transferButtonDisabled) && vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Transfer,
          Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Transfer
        }];
        SetMenuStateService.setThickClientMenuState(menuStates);
      }
      /* jshint ignore: end */
    }

    initialize();
  }
})();
