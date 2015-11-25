/**
 * Created by apenmatcha on 3/20/2015.
 */
(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('LoanDeleteController', LoanDeleteController);

  /* @ngInject */
  function LoanDeleteController(PipelineDataStore, modalWindowService, PipelineConst, _, PipelineGetView,
                                DeletePipelineLoan, PipelineEventsConst, $rootScope) {

    var vm = this;
    vm.modalYesClick = modalYesClick;
    vm.modalNoClick = modalNoClick;
    vm.deleteLoansConfirmation = deleteLoansConfirmation;
    vm.deleteLoans = deleteLoans;
    vm.multipleConfirmationPopups = multipleConfirmationPopups;
    vm.checklabel = 'Apply to all items';
    vm.applyCheck = false;
    vm.applyAllCheckChange = applyAllCheckChange;

    var windoInstance;
    var loanGuids = [];
    var loansCollection = PipelineDataStore.PipelineGridData.selected.slice();

    function setPopupMessage() {
      if (loansCollection && loansCollection.length > 0) {
        var BorrowerName = loansCollection[0].Loan$BorrowerName;
        var LoanNumber = loansCollection[0].Fields$364;
        if (PipelineDataStore.LoanFolderDropdownData.selectedItem === PipelineConst.TrashFolder) {
          vm.message = 'Are you sure you want to permanently delete ' + BorrowerName + ', (#' + LoanNumber + ')? Once deleted,' +
            ' the loan cannot be recovered.';
        }
        else {
          vm.message = 'Are you sure you want to delete ' + BorrowerName + ', (#' + LoanNumber + ')?';
        }
      }
    }

    setPopupMessage();
    if (loansCollection.length > 1) {
      vm.displayApplyToAll = true;
    }

    function applyAllCheckChange() {
      if (vm.applyCheck) {
        vm.message = PipelineConst.DeleteMultipleLoansMessage;
      }
      else {
        setPopupMessage();
      }
    }

    function modalYesClick() {
      if (vm.applyCheck) {
        PipelineDataStore.applyCheckClicked = true;
      }
      modalWindowService.closeDeleteLoanWindow();
      vm.deleteLoansConfirmation();
    }

    function modalNoClick() {
      if (vm.applyCheck || loansCollection.length === 1) {
        loanGuids = [];
        PipelineDataStore.deleteLoansApplyCheckDisabled = true;
        PipelineDataStore.applyCheckClicked = false;
        modalWindowService.closeDeleteLoanWindow();
      }
      else if (loansCollection.length > 1) {
        modalWindowService.closeDeleteLoanWindow();
        loansCollection.shift();
        PipelineDataStore.deleteLoansApplyCheckDisabled = false;
        multipleConfirmationPopups(loansCollection, loanGuids);

      }
    }

    function deleteLoansConfirmation() {
      // delete single loan
      if (loansCollection && loansCollection.length === 1) {
        loanGuids.push({
          'loanGuid': loansCollection[0].Loan$Guid
        });
        deleteLoans(loanGuids);
        PipelineDataStore.deleteLoansApplyCheckDisabled = true; //To reset apply to all checkbox
      }
      //delete multiple loans when apply to all is checked
      else if ((loansCollection.length > 1) && (PipelineDataStore.applyCheckClicked)) {
        //construct the loan guid collection
        _.each(loansCollection, function (loanItem) {
          loanGuids.push({
            'loanGuid': loanItem.Loan$Guid
          });
        });
        deleteLoans(loanGuids);
      }
      else if ((loansCollection.length > 1) && !(PipelineDataStore.applyCheckClicked)) {
        // move first loan to trash folder and display prompts for subsequent loans
        loanGuids.push({
          'loanGuid': loansCollection[0].Loan$Guid
        });
        // present popups to delete subsequent loans.
        loansCollection.shift();
        PipelineDataStore.deleteLoansApplyCheckDisabled = false;
        multipleConfirmationPopups(loansCollection, loanGuids);
      }
    }

    function deleteLoans(loans) {
      var IsExternalOrganization = true;
      var loanOrganization = PipelineDataStore.CompanyViewDropdownData.selectedItem;
      var loanGuidData = loans;
      if (loanOrganization === PipelineConst.Internal) {
        IsExternalOrganization = false;
      }
      //construct the object for API call
      var deleteLoanObj = {
        'IsExternalOrganization': IsExternalOrganization,
        'Loans': loanGuidData
      };
      DeletePipelineLoan.resolvePromise(deleteLoanObj).then(function () {
        loanGuids = [];
        PipelineDataStore.deleteLoansApplyCheckDisabled = true;
        PipelineDataStore.applyCheckClicked = false;
        $rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT, {refreshCurrentPage: true});
      });
    }

    function multipleConfirmationPopups(loansCollection, loanGuids) {
      if (loansCollection && loansCollection.length < 1) {
        if (loanGuids.length < 1) {
          return void 0;
        }
        deleteLoans(loanGuids);
        return void 0;
      }
      var title, messageText;
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem === PipelineConst.TrashFolder) {
        title = 'Permanently Delete Loan';
        messageText = 'Are you sure you want to permanently delete ' + loansCollection[0].Loan$BorrowerName +
          ', (#' + loansCollection[0].Fields$364 + ')? Once deleted,' +
          ' the loan cannot be recovered.';
      }
      else {
        title = 'Delete Loan';
        messageText = 'Are you sure you want to delete ' + loansCollection[0].Loan$BorrowerName +
          ', (#' + loansCollection[0].Fields$364 + ')?';
      }

      if (loansCollection.length === 1) {
        PipelineDataStore.deleteLoansApplyCheckDisabled = true;
      }
      PipelineDataStore.ConfirmModalApplyAllMessage = PipelineConst.DeleteMultipleLoansMessage;
      windoInstance = modalWindowService.showConfirmationPopup(messageText, title);
      windoInstance.result.then(function (result) {
        if (!result && PipelineDataStore.applyCheckClicked) {
          // Push all the remaining loans to the
          _.each(loansCollection, function (loanItem) {
            loanGuids.push({
              'loanGuid': loanItem.Loan$Guid
            });
          });
          deleteLoans(loanGuids);
          return void 0;
        }
        else if (!result && !PipelineDataStore.applyCheckClicked) {
          // Push just the one loan to the queue
          loanGuids.push({
            'loanGuid': loansCollection[0].Loan$Guid
          });
        }
        else if (result && PipelineDataStore.applyCheckClicked) {
          if (loanGuids.length > 0) {
            deleteLoans(loanGuids);
          }
          return void 0;
        }
        loansCollection.shift();
        multipleConfirmationPopups(loansCollection, loanGuids);
      });
    }
  }
}
());
