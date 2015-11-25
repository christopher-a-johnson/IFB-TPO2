/**
 * Created by rkumar3 on 4/1/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').controller('LoanAlertController', LoanAlertController);
  function LoanAlertController(PipelineDataStore, LoanAlertPopupData, SnoozeAlertService,
                               DismissAlertService, selectedLoanGUID, selectedAlertLoanAssociateGroupID,
                               selectedAlertLoanAssociateID, modalWindowService, _,
                               PipelineConst, ReactivateAlertService, selectedAlertColumnID, $filter) {
    var vm = this;
    vm.loanGuid = selectedLoanGUID;
    vm.alertColumnUniqueID = selectedAlertColumnID;
    vm.selectedAlertLoanAssociateID = selectedAlertLoanAssociateID;
    vm.selectedAlertLoanAssociateGroupID = selectedAlertLoanAssociateGroupID;
    var selectedAlertGuidList = [];
    vm.isAdministrator = PipelineDataStore.PersonaAccess.UserPersonaRights.IsAdministrator;
    vm.isSuperAdministrator = PipelineDataStore.PersonaAccess.UserPersonaRights.IsSuperAdministrator;
    vm.loanAlertPersonaAccess = PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Pipeline_Alert;
    initialize();
    vm.dismissDisabled = true;
    vm.snoozeDisabled = true;
    vm.selectedSnoozedTime = '';
    vm.loanAlertData = PipelineDataStore.LoanAlertPopupInfo;
    vm.gridSelectionChange = gridSelectionChange;
    vm.snoozeClicked = snoozeAlert;
    vm.reactiveClicked = reactivateAlert;
    vm.dismissAlertClicked = dismissAlert;
    vm.loanAlertSnoozeDropdownOptions = {
      dataSource: [
        {
          'title': '10 minutes'
        },
        {
          'title': '1 hour'
        },
        {
          'title': '4 hours'
        },
        {
          'title': '1 day'
        },
        {
          'title': '2 days'
        },
        {
          'title': '4 days'
        },
        {
          'title': '1 week'
        },
        {
          'title': '2 weeks'
        },
        {
          'title': '1 month'
        }
      ],
      dataTextField: 'title',
      dataValueField: 'title',
      optionLabel: ' '
    };
    vm.loanAlertGridOptions = {
      dataSource: vm.loanAlertData.items,
      scrollable: true,
      animation: false,
      columns: [
        {
          field: 'AlertMessage',
          title: 'Alert'
        },
        {
          field: 'DateExpected',
          type: 'Date',
          title: 'Date Expected',
          format: '{0:M/d/yy}'
        }
      ],
      resizable: true,
      height: 332
    };

    /* Context Menu */
    vm.gridAlertContextMenuOptions = {
      target: '#ngen-manage-alert',
      filter: 'tr.ng-scope',
      rightButton: true,
      border: true,
      animation: false
    };

    function setAlertActions(val) {
      disableDismiss(val);
      disableSnooze(val);
      disableReactivate(val);
    }

    function dismissAlert() {
      if (!vm.dismissDisabled) {
        var payload = {
          'LoanGuid': vm.loanGuid,
          'IsExternalOrganization': isExternalOrgnization(),
          'LoanAlertIds': []
        };
        if (selectedAlertGuidList.length > 0) {
          _.each(selectedAlertGuidList, function (item) {
            payload.LoanAlertIds.push(item.LoanAlertID);
          });
        }
        DismissAlertService.resolvePromise(payload).then(function () {
          loadAlertsData();
        });
        setAlertActions(true);
      }
      vm.alertContextMenu.close();
    }

    function isExternalOrgnization() {
      if (PipelineDataStore.CompanyViewDropdownData.selectedItem === 'Internal') {
        return false;
      }
      else {
        return true;
      }

    }

    function snoozeAlert() {
      var time = new Date();
      var currentTime = $filter('date')(time, 'yyyy-MM-ddTHH:mm:ss.sss');

      if (!vm.snoozeDisabled) {
        if (vm.selectedSnoozedTime === ' ') {
          PipelineDataStore.warningIconDisabled = false;
          modalWindowService.showWarningPopup(PipelineConst.TimeWarningMessage, PipelineConst.SnoozeDurationTitle);
          return;
        }
        var payload = {
          'LoanGuid': vm.loanGuid,
          'SnoozeTimePeriod': vm.selectedSnoozedTime,
          'LoanAlertIds': [],
          'IsExternalOrganization': isExternalOrgnization(),
          'SnoozeStartTime': currentTime
        };
        if (selectedAlertGuidList.length > 0) {
          _.each(selectedAlertGuidList, function (item) {
            payload.LoanAlertIds.push(item.LoanAlertID);
          });
        }
        SnoozeAlertService.resolvePromise(payload).then(function () {
          loadAlertsData();
        });
        setAlertActions(true);
      }
      vm.alertContextMenu.close();
    }

    function reactivateAlert() {
      if (!vm.reactivateDisabled) {
        var payload = {
          'LoanGuid': vm.loanGuid,
          'LoanAlertIds': [],
          'IsExternalOrganization': isExternalOrgnization()
        };
        if (selectedAlertGuidList.length > 0) {
          _.each(selectedAlertGuidList, function (item) {
            payload.LoanAlertIds.push(item.LoanAlertID);
          });
        }
        ReactivateAlertService.resolvePromise(payload).then(function () {
          loadAlertsData();
        });
        setAlertActions(true);
      }
      vm.alertContextMenu.close();
    }

    function gridSelectionChange(data) {
      vm.disableAlertActions = PipelineDataStore.LoanAlertPopupInfo.DisableAlertActions;
      vm.separatorRow = true;
      if (data.length === 0 || (data.length === 1 && data[0].AlertID === -1)) {
        setAlertActions(true);
        vm.separatorRow = false;
      }
      else {
        selectedAlertGuidList = _.filter(data, function (list) {
          return list.AlertID !== -1;
        });
        if (vm.disableAlertActions !== undefined) {
          if (vm.disableAlertActions.toString() === 'false') {
            setAlertActions(false);
          } else {
            setAlertActions(true);
          }
        }
        /*Below conditions for enable/disable the action on basis of selected alerts status */
        if (typeof _.findWhere(selectedAlertGuidList, {DisplayStatus: 2}) !== 'undefined') {
          disableSnooze(true);
        }
        if (typeof _.findWhere(selectedAlertGuidList, {DisplayStatus: 3}) !== 'undefined') {
          disableDismiss(true);
        }

        if (typeof _.findWhere(selectedAlertGuidList, {DisplayStatus: 1}) !== 'undefined') {
          disableReactivate(true);
        }
      }
    }

    function disableReactivate(val) {
      vm.reactivateDisabled = val;
    }

    function disableDismiss(val) {
      vm.dismissDisabled = val;
    }

    function disableSnooze(val) {
      vm.snoozeDisabled = val;
    }

    function loadAlertsData() {
      var payload = {
        'LoanGuid': vm.loanGuid,
        'AlertCriterionName': vm.alertColumnUniqueID,
        'CurrentLoanAssociateId': vm.selectedAlertLoanAssociateID,
        'CurrentLoanAssociateGroupId': vm.selectedAlertLoanAssociateGroupID,
        'IsAdmin': vm.isAdministrator,
        'IsSuperAdmin': vm.isSuperAdministrator,
        'ManageAlertRights': vm.loanAlertPersonaAccess
      };
      LoanAlertPopupData.resolvePromise(payload);
    }

    /* Initialization code */
    function initialize() {
      loadAlertsData();
    }
  }
}());
