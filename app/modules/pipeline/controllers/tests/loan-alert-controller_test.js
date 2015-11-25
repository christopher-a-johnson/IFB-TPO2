(function () {
  'use strict';
  describe('Test loan alert controller ', function () {
    var ctrl, scope, loanAlertPopupData, env, snoozeAlertService, dismissAlertService, pipelineDataStore,
      responsePipeLineDataStore, element, compile;
    beforeEach(module('elli.encompass.web'));
    beforeEach(module('elli.encompass.web.pipeline'));
    var responseLoanAlertData = [
      {
        'AlertID': 5,
        'AlertIDFieldSpecified': true,
        'AlertMessage': 'Processing expected ',
        'AlertTargetID': '2',
        'DateExpected': '2014-01-23T00:00:00',
        'DateExpectedSpecified': true,
        'DisplayStatus': 3,
        'DisplayStatusSpecified': true,
        'Event': null,
        'GroupID': -1,
        'GroupIDSpecified': true,
        'LoanAlertID': '3821',
        'LogRecordID': null,
        'MilestoneID': '2',
        'SnoozeDurationSpecified': false,
        'SnoozeStartDTTMSpecified': false,
        'Status': 'expected',
        'UserID': ''
      }

    ];
    beforeEach(
      inject(function ($compile, $rootScope, $controller, $httpBackend, modalWindowService, LoanAlertPopupData,
                       ENV, SnoozeAlertService, DismissAlertService, PipelineDataStore, ReactivateAlertService) {
        scope = $rootScope.$new();
        compile = $compile;
        loanAlertPopupData = LoanAlertPopupData;
        snoozeAlertService = SnoozeAlertService;
        dismissAlertService = DismissAlertService;
        pipelineDataStore = PipelineDataStore;
        spyOn(LoanAlertPopupData, 'resolvePromise').and.callThrough();
        spyOn(SnoozeAlertService, 'resolvePromise').and.callThrough();
        spyOn(DismissAlertService, 'resolvePromise').and.callThrough();
        spyOn(ReactivateAlertService, 'resolvePromise').and.callThrough();
        env = ENV;
        $httpBackend = $httpBackend;
        var responseSnoozeAlerts = {
          'UpdatePipelineLoanAlertsResponse1': {
            'resultField': 'Action SNOOZED Successful',
            'PropertyChanged': null
          }
        };
        var responseDismissAlerts = {
          'UpdatePipelineLoanAlertsResponse1': {
            'resultField': ' Action DISMISS Successful',
            'PropertyChanged': null
          }
        };
        var responseReactivateAlerts = {
          'UpdatePipelineLoanAlertsResponse1': {
            'resultField': ' Action REACTIVATE Successful',
            'PropertyChanged': null
          }
        };
        responsePipeLineDataStore = {
          'PersonaAccess': {
            'LoanMgmt': {'LoanMgmt_Pipeline_Alert': 'true'},
            'UserPersonaRights':{'IsAdministrator' : 'true', 'IsSuperAdministrator' : 'true'}},
          LoanAlertPopupInfo: {'DisableAlertActions' :'false'},
          CompanyViewDropdownData: {selectedItem: 'Internal'}
        };
        $httpBackend.when('POST', env.restURL + '/pipeline/loan/getpipelineloanalerts').respond(responseLoanAlertData);
        $httpBackend.when('POST', env.restURL + '/pipeline/loan/snoozealert').respond(responseSnoozeAlerts);
        $httpBackend.when('POST', env.restURL + '/pipeline/loan/dismissalert').respond(responseDismissAlerts);
        $httpBackend.when('POST', env.restURL + '/pipeline/loan/reactivatealert').respond(responseReactivateAlerts);
        ctrl = $controller('LoanAlertController', {
          $scope: scope,
          LoanAlertPopupData: LoanAlertPopupData,
          SnoozeAlertService: SnoozeAlertService,
          DismissAlertService: DismissAlertService,
          ReactivateAlertService: ReactivateAlertService,
          PipelineDataStore: responsePipeLineDataStore,
          selectedLoanGUID: {},
          selectedAlertColumnID: {},
          selectedAlertLoanAssociateID : {},
          selectedAlertLoanAssociateGroupID : {}
        });
        ctrl.dismissDisabled = false;
        ctrl.alertContextMenu = {
          enable: function (a, b) {
          },
          close: function () {
          }
        };
        ctrl.loanGuid = '1234556';
        ctrl.LoanAlertIds = ['1234'];
        ctrl.selectedSnoozedTime = '10 minutes';

      }));
    describe('Tests for Dismissing  selected alerts ', function () {
      var payload;
      beforeEach(function () {
        var data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 1,
          'LoanAlertID': '101'
        }];
        payload = {
          'LoanGuid': '1234556',
          'IsExternalOrganization': false,
          'LoanAlertIds': ['101']
        };
        spyOn(ctrl.alertContextMenu, 'close');
        ctrl.gridSelectionChange(data);
      });
      it(' DismissAlertService should have been called on Dismss button clicked',
        inject(function (DismissAlertService) {
          ctrl.dismissAlertClicked();
          expect(DismissAlertService.resolvePromise).toHaveBeenCalledWith(payload);
        }));
      it(' After dismissing alerts dismissDisabled should be true',
        inject(function (DismissAlertService) {
          ctrl.dismissAlertClicked();
          expect(DismissAlertService.resolvePromise).toHaveBeenCalledWith(payload);
          expect(ctrl.dismissDisabled).toBe(true);
        }));
      it(' After dismissing alerts enable method of context menu should get closed',
        inject(function (DismissAlertService) {
          ctrl.dismissAlertClicked();
          expect(DismissAlertService.resolvePromise).toHaveBeenCalledWith(payload);
          expect(ctrl.alertContextMenu.close).toHaveBeenCalled();
        }));
    });
    describe('Test for Reactivating selected alerts ', function () {
      var payload;
      beforeEach(function () {
        var data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 2,
          'LoanAlertID': '101'
        }];
        payload = {
          'LoanGuid': '1234556',
          'IsExternalOrganization': false,
          'LoanAlertIds': ['101']
        };
        spyOn(ctrl.alertContextMenu, 'close');
        ctrl.gridSelectionChange(data);
      });
      it(' ReactivateAlertService should have been called on Reactivate button clicked',

        inject(function (ReactivateAlertService) {
          ctrl.reactiveClicked();
          expect(ReactivateAlertService.resolvePromise).toHaveBeenCalledWith(payload);
        }));
      it(' After reactivating alerts reactivateDisabled should be true',

        inject(function (ReactivateAlertService) {
          ctrl.reactiveClicked();
          expect(ReactivateAlertService.resolvePromise).toHaveBeenCalledWith(payload);
          expect(ctrl.reactivateDisabled).toBe(true);
        }));
      it(' After reactivating alerts enable method of context menu should get closed',

        inject(function (ReactivateAlertService) {
          ctrl.reactiveClicked();
          expect(ReactivateAlertService.resolvePromise).toHaveBeenCalledWith(payload);
          expect(ctrl.alertContextMenu.close).toHaveBeenCalled();
        }));
    });
    describe('Tests for Snoozing  selected alerts ', function () {
      var payload;
      beforeEach(function () {
        var data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 1,
          'LoanAlertID': '101'
        }];
        payload = {
          'LoanGuid': '1234556',
          'IsExternalOrganization': false,
          'LoanAlertIds': ['101'],
          'SnoozeTimePeriod': '10 minutes',
          'SnoozeStartTime': new Date().toISOString()
        };
        spyOn(ctrl.alertContextMenu, 'close');
        ctrl.gridSelectionChange(data);
      });
      it(' SnoozeAlertService should have been called on snooze button clicked', inject(function (SnoozeAlertService) {
        ctrl.snoozeClicked();
        expect(SnoozeAlertService.resolvePromise).toHaveBeenCalled();
      }));
      it(' After snoozing alerts snoozeDisabled should be true',
        inject(function (SnoozeAlertService) {
          ctrl.snoozeClicked();
          expect(SnoozeAlertService.resolvePromise).toHaveBeenCalled();
          expect(ctrl.snoozeDisabled).toBe(true);
        }));
      it(' After snoozing alerts enable method of context menu should get closed',
        inject(function (SnoozeAlertService) {
          ctrl.snoozeClicked();
          expect(SnoozeAlertService.resolvePromise).toHaveBeenCalled();
          expect(ctrl.alertContextMenu.close).toHaveBeenCalled();
        }));
    });
    describe('Test Manage alert controller', function () {
      it('Should Snooze dropdown option defined', inject(function () {
        expect(ctrl.loanAlertSnoozeDropdownOptions).not.toBeUndefined();
      }));

      it('Manage Alert should contain two column', function (done) {
        ctrl.loanAlertGridOptions.dataSource = responseLoanAlertData;
        scope.option = ctrl.loanAlertGridOptions;
        element = compileDirective(angular.element('<div>' +
        '<div ngen-grid-navigation id="aria"  kendo-grid k-options="option" k-navigatable="true"></div></div>'));
        var grid;
        var tdLength;
        scope.$on('kendoRendered', function () {
          grid = element.find('div[id="aria"]').data('kendoGrid');
          if (grid) {
            tdLength = grid.table.find('tr:first td').length;
            expect(tdLength).toBe(2);
            done();
          }
        });
      });

      function compileDirective(html) {
        var elem = angular.element(html);
        var compiled = compile(elem);
        compiled(scope);
        angular.element(document).find('body').append(elem);
        scope.$digest();
        return elem;
      }
    });
    describe('Tests for enable/disable of snooze and dismiss buttons and context menu ', function () {
      var data;
      it(' If selected alert type is not dismiss then dismiss button and respective context menu should be enable ', function () {
        data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 1,
          'LoanAlertID': '101'
        }];
        ctrl.gridSelectionChange(data);
        expect(ctrl.dismissDisabled).toBe(false);
      });
      it(' If selected alert type is dismiss then dismiss button and respective context menu should be disable', function () {
        data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 3,
          'LoanAlertID': '101'
        }];
        ctrl.gridSelectionChange(data);
        expect(ctrl.dismissDisabled).toBe(true);
      });
      it('If selected alert type is active then reactive context menu should be disable', function () {
        data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 1,
          'LoanAlertID': '101'
        }];
        ctrl.gridSelectionChange(data);
        expect(ctrl.reactivateDisabled).toBe(true);
      });
      it(' If multiple alerts are selected & alert type is not dismiss then dismiss button and respective' +
      ' context menu should be enable', function () {
        data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 1,
          'LoanAlertID': '101'
        },
          {
            'Alert': 'Alert 3',
            'ExpectedDate': '3/4/2012',
            'DisplayStatus': 2,
            'LoanAlertID': '102'
          }];
        ctrl.gridSelectionChange(data);
        expect(ctrl.dismissDisabled).toBe(false);
      });
      it(' If multiple alerts are selected & alert type is not active then reactive' +
      ' context menu should be enable', function () {
        data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 2,
          'LoanAlertID': '101'
        },
          {
            'Alert': 'Alert 3',
            'ExpectedDate': '3/4/2012',
            'DisplayStatus': 3,
            'LoanAlertID': '102'
          }];
        ctrl.gridSelectionChange(data);
        expect(ctrl.reactivateDisabled).toBe(false);
      });
      it(' If multiple alerts are selected & alert type contains dismiss then dismiss button and respective ' +
      'context menu should be disable', function () {
        data = [{
          'Alert': 'Alert 2',
          'ExpectedDate': '3/4/2012',
          'DisplayStatus': 1,
          'LoanAlertID': '101'
        },
          {
            'Alert': 'Alert 3',
            'ExpectedDate': '3/4/2012',
            'DisplayStatus': 3,
            'LoanAlertID': '102'
          }];
        ctrl.gridSelectionChange(data);
        expect(ctrl.dismissDisabled).toBe(true);
      });
    });
  });
})();
