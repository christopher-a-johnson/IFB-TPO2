(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').controller('PipelineMainController', PipelineMainController);

  /* @ngInject */
  function PipelineMainController(PipelineAutoRefresh, $window, $rootScope, PipelineEventsConst, $windowStack,
                                  hotkeys, PipelineConst, _) {
    var vm = this;
    vm.alerts = [];

    function initialize() {
      PipelineAutoRefresh.resolvePromise().then(angular.noop, function (error) {
        console.log('Error in PipelineAutoRefresh API...', error);
      });

      $window.encompassInteractionMenuClicked = function (menu) {
        var thickMenu2ThinEvent = {
          PI_Duplicate: {event: PipelineEventsConst.LOAN_DUPLICATE_EVENT, data: {}},
          PI_Move: {event: PipelineEventsConst.MOVE_FOLDER_EVENT_FROM_MAIN_MENU, data: {}},
          PI_Delete: {event: PipelineEventsConst.LOAN_DELETE_EVENT, data: {}},
          PI_Refresh: {event: PipelineEventsConst.REFRESH_GRID_EVENT, data: {}},
          PI_ManageAlerts: {event: PipelineEventsConst.LOAN_ALERT_EVENT, data: {'uniqueID': 'Alerts.AlertCount'}},
          PI_Columns: {event: PipelineEventsConst.CUSTOMIZE_COLUMN_EVENT, data: {}},
          PI_ManageViews: {event: PipelineEventsConst.MANAGE_VIEW_EVENT, data: {}},
          PI_ResetView: {event: PipelineEventsConst.RESET_VIEW_MENU_EVENT, data: {}},
          PI_ExportSelected: {event: PipelineEventsConst.LOAN_EXPORT_EXCEL_EVENT, data: {'exportAll': false}},
          PI_ExportAll: {event: PipelineEventsConst.LOAN_EXPORT_EXCEL_EVENT, data: {'exportAll': true}},
          PI_Print: {event: PipelineEventsConst.LOAN_PRINT_EVENT, data: {}},
          PI_New: {event: PipelineEventsConst.LOAN_NEW_EVENT, data: {}},
          PI_SaveView: {event: PipelineEventsConst.SAVE_VIEW, data: {}},
          PI_Transfer: {event: PipelineEventsConst.LOAN_TRANSFER_EVENT, data: {}},
          PI_Edit: {event: PipelineEventsConst.LOAN_EDIT_EVENT, data: {}},
          PI_Import: {event: PipelineEventsConst.LOAN_IMPORT_EVENT, data: {}},
          SRV_LEF_Selected: {event: PipelineEventsConst.EXPORT_LEF_SELECTED_EVENT, data: {'ExportAll': false}},
          SRV_LEF_All: {event: PipelineEventsConst.EXPORT_LEF_ALL_EVENT, data: {'ExportAll': true}},
          SRV_Fannie_Selected: {event: PipelineEventsConst.EXPORT_FNM_SELECTED_EVENT, data: {'ExportAll': false}},
          SRV_Fannie_All: {event: PipelineEventsConst.EXPORT_FNM_ALL_EVENT, data: {'ExportAll': true}},
          SRV_FannieMaeFormattedFile: {event: PipelineEventsConst.EXPORT_FNM_FORMATTED_FILE_EVENT, data: {}},
          SRV_Freddie_Selected: {event: PipelineEventsConst.EXPORT_FRE_SELECTED_EVENT, data: {'ExportAll': false}},
          SRV_Freddie_All: {event: PipelineEventsConst.EXPORT_FRE_ALL_EVENT, data: {'ExportAll': true}},
          SRV_NMLS: {event: PipelineEventsConst.GENERATE_NMLS_EVENT, data: {}},
          SRV_NCarComplianceReport: {event: PipelineEventsConst.NCAR_COMPLIANCE_REPORT_EVENT, data: {}}
        };
        if (typeof  thickMenu2ThinEvent[menu] !== 'undefined') {
          /* $windowStack.length() is checked to avoid multiple overlapping popups.
           It will disable thick client menu invocation when thin client popup is open.
           */
          if ($windowStack.length() === 0) {
            $rootScope.$broadcast(thickMenu2ThinEvent[menu].event, thickMenu2ThinEvent[menu].data);
          }
        }
      };

      //NGENC-1459 max loan alert
      $rootScope.$on(PipelineEventsConst.MAX_LOANS_EVENT, function (event, data, TotalLoans) {
        var maxloanAlert = _.find(vm.alerts, {'ngenAlertType': PipelineConst.MaxLoanAlert});
        if (data && (typeof maxloanAlert === 'undefined')) {
          vm.alerts.push({
            alertTitle: PipelineConst.MaxLoanAlertTitle,
            alertMsg: PipelineConst.MaxLoanAlertMsg.replace(/<TotalLoans>/g, TotalLoans),
            ngenAlertType: PipelineConst.MaxLoanAlert
          });

        } else if (!data && (typeof maxloanAlert !== 'undefined')) {
          var maxLoanAlertIndex = vm.alerts.indexOf(maxloanAlert);
          vm.alerts.splice(maxLoanAlertIndex, 1);
        }
      });
    }

    // mask browser new window action, thick client will open New Loan popup if the user has access to create new loans. This is working
    // in IE and in the thick client, but does not work in Chrome. As we only need to test this in thick client this is fine for now.
    hotkeys.add({
      combo: 'ctrl+n',
      description: 'New Loan...',
      callback: function (event) {
        event.cancelBubble = true;
        event.returnValue = false;
        event.preventDefault();
        broadcastShortKeyEvents(PipelineEventsConst.LOAN_NEW_EVENT);
        return false;
      }
    });
    // mask browser print dialog, thick client will show print forms dialog for this keystroke...
    hotkeys.add({
      combo: 'ctrl+p',
      description: 'Print Forms...',
      callback: function (event) {
        // To prevent default print dialog of IE Need to open window and close immediate.
        var w = window.open('', '', 'width = 1, height = 1, left = 0,top = 0');
        w.close();
        event.preventDefault();
        broadcastShortKeyEvents(PipelineEventsConst.LOAN_PRINT_EVENT);
      }
    });
    hotkeys.add({
      combo: 'f5',
      description: 'Refresh Grid Data',
      callback: function (event) {
        event.preventDefault();
        broadcastShortKeyEvents(PipelineEventsConst.REFRESH_GRID_EVENT);
      }
    });
    hotkeys.add({
      combo: ['backspace', 'alt+left', 'alt+right'],
      description: 'Disable Backspace',
      callback: function (event) {
        event.preventDefault();
      }
    });

    function broadcastShortKeyEvents(event) {
      if ($windowStack.length() === 0) {
        $rootScope.$broadcast(event);
      }
    }

    vm.closeAlert = function (index) {
      vm.alerts.splice(index, 1);
    };

    initialize();
  }
}());
