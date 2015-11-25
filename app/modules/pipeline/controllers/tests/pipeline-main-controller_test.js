/**
 * Created by rkumar3 on 6/18/2015.
 */
(function () {
  'use strict';

  describe('Test Pipeline Main Controller', function () {
    var scope, ctrl, rootScope, modalService, compile, pipelineEventsConst;
    beforeEach(module('elli.encompass.web'));
    beforeEach(module('cfp.hotkeys'));
    beforeEach(inject(function ($rootScope, $controller, $compile, modalWindowService, PipelineEventsConst) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      compile = $compile;
      modalService = modalWindowService;
      pipelineEventsConst = PipelineEventsConst;
      spyOn(modalWindowService, 'showManageView');
      ctrl = $controller('PipelineMainController', {
        scope: scope,
        modalWindowService: modalWindowService
      });
    }));

    describe('Test Hotkeys on pipeline page', function () {
      beforeEach(inject(function ($rootScope) {
        spyOn(rootScope, '$broadcast');
      }));
      it('should refresh the pipeline grid while pressing F5', inject(function (PipelineEventsConst, $rootScope, hotkeys) {
        var evt =
        {
          target: {nodeName: 'body'},
          defaultPrevented: false,
          preventDefault: function () {
            evt.defaultPrevented = true;
          }
        };
        hotkeys.get('f5').callback(evt);
        expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.REFRESH_GRID_EVENT);
      }));
      it('should give print loan popup while pressing ctrl+p', inject(function (PipelineEventsConst, $rootScope, hotkeys) {
        var evt =
        {
          target: {nodeName: 'body'},
          defaultPrevented: false,
          preventDefault: function () {
            evt.defaultPrevented = true;
          }
        };
        var returnObj = {
          close: function () {
          }
        };
        spyOn(window, 'open').and.returnValue(returnObj);
        hotkeys.get('ctrl+p').callback(evt);
        expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_PRINT_EVENT);
      }));
      it('should give move loan popup while pressing alt+p+m', inject(function (PipelineEventsConst, $rootScope, $window) {
        $window.encompassInteractionMenuClicked('PI_Move');
        expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.MOVE_FOLDER_EVENT_FROM_MAIN_MENU, {});
      }));
      it('should give move loan popup while pressing alt+m', inject(function (PipelineEventsConst, $rootScope, $window) {
        $window.encompassInteractionMenuClicked('PI_Move');
        expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.MOVE_FOLDER_EVENT_FROM_MAIN_MENU, {});
      }));
      it('should give delete loan popup while pressing alt+p+d', inject(function (PipelineEventsConst, $rootScope, $window) {
        $window.encompassInteractionMenuClicked('PI_Delete');
        expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_DELETE_EVENT, {});
      }));
      it('should give delete loan popup while pressing alt+d', inject(function (PipelineEventsConst, $rootScope, $window) {
        $window.encompassInteractionMenuClicked('PI_Delete');
        expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_DELETE_EVENT, {});
      }));
      it('should give duplicate loan popup while pressing alt+p+u', inject(function (PipelineEventsConst, $rootScope, $window) {
        $window.encompassInteractionMenuClicked('PI_Duplicate');
        expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_DUPLICATE_EVENT, {});
      }));
      it('should give customize column popup while pressing alt+p+c', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_Columns');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.CUSTOMIZE_COLUMN_EVENT, {});
      }));
      it('should give Manage Alert popup while pressing alt+p+a', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_ManageAlerts');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.LOAN_ALERT_EVENT, {uniqueID: 'Alerts.AlertCount'});
      }));
      it('should give Manage View popup while pressing alt+p+w', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_ManageViews');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.MANAGE_VIEW_EVENT, {});
      }));
      it('should give Reset view popup while pressing alt+p+r+r', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_ResetView');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.RESET_VIEW_MENU_EVENT, {});
      }));
      it('should give save view popup while pressing alt+p+e+e+e', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_SaveView');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.SAVE_VIEW, {});
      }));
      it('should give Edit Loan popup while pressing alt+p+e', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_Edit');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.LOAN_EDIT_EVENT, {});
      }));
      it('should give Import Loan popup while pressing alt+i', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_Import');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.LOAN_IMPORT_EVENT, {});
      }));
      it('should give Import Loan popup while pressing alt+p+i', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_Import');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.LOAN_IMPORT_EVENT, {});
      }));
      it('should give Transfer Loan popup while pressing alt+t', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_Transfer');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.LOAN_TRANSFER_EVENT, {});
      }));
      it('should give Transfer Loan popup while pressing alt+p+t', inject(function ($window) {
        $window.encompassInteractionMenuClicked('PI_Transfer');
        expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.LOAN_TRANSFER_EVENT, {});
      }));
    });

    describe('Test Alert', function () {
      it('Should show max loan alert with correct value', inject(function (PipelineEventsConst, $rootScope) {
        var overFlow = true;
        var TotalLoans = 5000;
        $rootScope.$broadcast(PipelineEventsConst.MAX_LOANS_EVENT, overFlow, TotalLoans);
        expect(ctrl.alerts.length).toEqual(1);
      }));

      it('Should remove max loan alert if overFlow is false', inject(function (PipelineEventsConst, $rootScope, PipelineConst) {
        var overFlow = false;
        var TotalLoans = 5000;
        ctrl.alerts.push({
          alertTitle: PipelineConst.MaxLoanAlertTitle,
          alertMsg: PipelineConst.MaxLoanAlertMsg.replace(/<TotalLoans>/g, TotalLoans),
          ngenAlertType: PipelineConst.MaxLoanAlert
        });
        $rootScope.$broadcast(PipelineEventsConst.MAX_LOANS_EVENT, overFlow, TotalLoans);
        expect(ctrl.alerts.length).toEqual(0);
      }));

      it('Should remove max loan alert', inject(function (PipelineEventsConst, $rootScope, PipelineConst) {
        var TotalLoans = 5000;
        ctrl.alerts.push({
          alertTitle: PipelineConst.MaxLoanAlertTitle,
          alertMsg: PipelineConst.MaxLoanAlertMsg.replace(/<TotalLoans>/g, TotalLoans),
          ngenAlertType: PipelineConst.MaxLoanAlert
        });
        ctrl.closeAlert(0);
        expect(ctrl.alerts.length).toEqual(0);
      }));

    });

  });

})();
