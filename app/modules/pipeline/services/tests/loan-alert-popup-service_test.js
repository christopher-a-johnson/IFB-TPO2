/**
 * Created by rkumar3 on 4/10/2015.
 */
(function () {
  'use strict';
  describe('LoanAlertPopupData Service', function () {
    var env, httpBackend, Restangular;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_) {
      env = ENV;
      httpBackend = $httpBackend;
      Restangular = _Restangular_;
    }));

    it('Should get Alert with status 3 if item is dismissed',
      inject(function (LoanAlertPopupData, $httpBackend, ENV, PipelineDataStore, $filter) {
        var payload = {
          'LoanGuid': '990966c8-2ff8-4c8b-b639-98073b1f856a'
        };
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getpipelineloanalerts', payload).respond(201, {
          'PipelineLoanAlerts': [{
            AlertID: 5,
            AlertMessage: 'my loan(Dismissed)',
            AlertTargetID: '7',
            DateExpected: '2014-02-14T00:00:00',
            DisplayStatus: 3,
            Event: null,
            GroupID: -1,
            LoanAlertID: '14243',
            LogRecordID: null,
            MilestoneID: '7',
            SnoozeDuration: null,
            SnoozeStartDTTM: null,
            Status: 'expected',
            UserID: ''
          }]
        });
        LoanAlertPopupData.resolvePromise(payload);
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getpipelineloanalerts');
        $httpBackend.flush();
        expect(PipelineDataStore.LoanAlertPopupInfo.items.length).toBe(2);
        expect(PipelineDataStore.LoanAlertPopupInfo.items[1].AlertMessage.search('Dismissed')).toBeGreaterThan(0);
        expect(PipelineDataStore.LoanAlertPopupInfo.items[1].DisplayStatus).toBe(3);
      }));

    it('Should get Alert with status 2 if item is snoozed',
      inject(function (LoanAlertPopupData, $httpBackend, ENV, PipelineDataStore, $filter) {
        var payload = {
          'LoanGuid': '990966c8-2ff8-4c8b-b639-98073b1f856a'
        };
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getpipelineloanalerts', payload).respond(201, {
          'PipelineLoanAlerts': [{
            AlertID: 5,
            AlertMessage: 'Completion expected (Snoozed for 2 days from' + $filter('date')(new Date(), 'M/d/yy HH:mm:ss a') + ')',
            AlertTargetID: '7',
            DateExpected: '2014-02-14T00:00:00',
            DisplayStatus: 2,
            Event: null,
            GroupID: -1,
            LoanAlertID: '14243',
            LogRecordID: null,
            MilestoneID: '7',
            SnoozeDuration: 2880,
            SnoozeStartDTTM: new Date().toISOString(),
            Status: 'expected',
            UserID: ''
          }]
        });
        LoanAlertPopupData.resolvePromise(payload);
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getpipelineloanalerts');
        $httpBackend.flush();
        expect(PipelineDataStore.LoanAlertPopupInfo.items.length).toBe(2);
        expect(PipelineDataStore.LoanAlertPopupInfo.items[0].AlertMessage).toBe('-----Dismissed or Snoozed Alerts-----');
        expect(PipelineDataStore.LoanAlertPopupInfo.items[1].DisplayStatus).toBe(2);
        expect(PipelineDataStore.LoanAlertPopupInfo.items[1].AlertMessage.search('2 days')).toBeGreaterThan(0);
      }));

    it('Should Check Alert with status 2(snoozed) should be 1(active) if snooze duration and datetime is null',
      inject(function (LoanAlertPopupData, $httpBackend, ENV, PipelineDataStore, $filter) {
        var payload = {
          'LoanGuid': '990966c8-2ff8-4c8b-b639-98073b1f856a'
        };
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getpipelineloanalerts', payload).respond(201, {
          'PipelineLoanAlerts': [{
            AlertID: 5,
            AlertMessage: 'Completion expected (Snoozed for 2 days from' + $filter('date')(new Date(), 'M/d/yy HH:mm:ss a') + ')',
            AlertTargetID: '7',
            DateExpected: '2014-02-14T00:00:00',
            DisplayStatus: 2,
            Event: null,
            GroupID: -1,
            LoanAlertID: '14243',
            LogRecordID: null,
            MilestoneID: '7',
            SnoozeDuration: null,
            SnoozeStartDTTM: null,
            Status: 'expected',
            UserID: ''
          }]
        });
        LoanAlertPopupData.resolvePromise(payload);
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getpipelineloanalerts');
        $httpBackend.flush();
        expect(PipelineDataStore.LoanAlertPopupInfo.items.length).toBe(1);
        expect(PipelineDataStore.LoanAlertPopupInfo.items[0].DisplayStatus).toBe(1);
      }));

    it('Should Check Alert with status 2(snoozed) should be 1(active) if current time is greater than snooze time',
      inject(function (LoanAlertPopupData, $httpBackend, ENV, PipelineDataStore, $filter) {
        var payload = {
          'LoanGuid': '990966c8-2ff8-4c8b-b639-98073b1f856a'
        };
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getpipelineloanalerts', payload).respond(201, {
          'PipelineLoanAlerts': [{
            AlertID: 5,
            AlertMessage: 'Completion expected (Snoozed for 2 days from' + $filter('date')(new Date(), 'M/d/yy HH:mm:ss a') + ')',
            AlertTargetID: '7',
            DateExpected: '2014-02-14T00:00:00',
            DisplayStatus: 2,
            Event: null,
            GroupID: -1,
            LoanAlertID: '14243',
            LogRecordID: null,
            MilestoneID: '7',
            SnoozeDuration: 10,
            SnoozeStartDTTM: '2015-06-08T07:31:18.549Z',
            Status: 'expected',
            UserID: ''
          }]
        });
        LoanAlertPopupData.resolvePromise(payload);
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getpipelineloanalerts');
        $httpBackend.flush();
        expect(PipelineDataStore.LoanAlertPopupInfo.items.length).toBe(1);
        expect(PipelineDataStore.LoanAlertPopupInfo.items[0].DisplayStatus).toBe(1);
      }));

    it('Should Check if snooze start date time string(SnoozeStartDTTM) does not have "Z" in the end then still it' +
      ' should return time Zone time',
      inject(function (LoanAlertPopupData, $httpBackend, ENV, PipelineDataStore, $filter) {
        var payload = {
          'LoanGuid': '990966c8-2ff8-4c8b-b639-98073b1f856a'
        };
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getpipelineloanalerts', payload).respond(201, {
          'PipelineLoanAlerts': [{
            AlertID: 5,
            AlertMessage: 'Completion expected (Snoozed for 2 days from' + $filter('date')(new Date(), 'M/d/yy HH:mm:ss a') + ')',
            AlertTargetID: '7',
            DateExpected: '2014-02-14T00:00:00',
            DisplayStatus: 2,
            Event: null,
            GroupID: -1,
            LoanAlertID: '14243',
            LogRecordID: null,
            MilestoneID: '7',
            SnoozeDuration: 10,
            SnoozeStartDTTM: '2015-06-08T07:31:18.549',
            Status: 'expected',
            UserID: ''
          }]
        });
        LoanAlertPopupData.resolvePromise(payload);
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getpipelineloanalerts');
        $httpBackend.flush();
        expect(PipelineDataStore.LoanAlertPopupInfo.items.length).toBe(1);
        expect(PipelineDataStore.LoanAlertPopupInfo.items[0].DisplayStatus).toBe(1);
      }));
    it('Should Check method for update the loan alert count has been called',
      inject(function (LoanAlertPopupData, $httpBackend, ENV, PipelineDataStore, modalWindowService) {
        var payload = {
          'LoanGuid': '990966c8-2ff8-4c8b-b639-98073b1f856a'
        };
        spyOn(Restangular, 'all').and.callThrough();
        spyOn(modalWindowService, 'changeTitleForLoanAlertPopup');
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getpipelineloanalerts', payload).respond(201, {
          'PipelineLoanAlerts': [{
            AlertID: 5,
            AlertMessage: '',
            AlertTargetID: '7',
            DateExpected: '2014-02-14T00:00:00',
            DisplayStatus: 2,
            Event: null,
            GroupID: -1,
            LoanAlertID: '14243',
            LogRecordID: null,
            MilestoneID: '7',
            SnoozeDuration: null,
            SnoozeStartDTTM: null,
            Status: 'expected',
            UserID: ''
          }]
        });
        LoanAlertPopupData.resolvePromise(payload);
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getpipelineloanalerts');
        $httpBackend.flush();

        expect(modalWindowService.changeTitleForLoanAlertPopup).toHaveBeenCalledWith('1 Loan Alerts');
      }));

    it('should check the alert status to be 1 if display status is 1',
      inject(function ($httpBackend, ENV, LoanAlertPopupData, PipelineDataStore) {
        var payload = {
          'LoanGuid': '990966c8-2ff8-4c8b-b639-98073b1f856a'
        };
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getpipelineloanalerts', payload).respond(201, {
          'PipelineLoanAlerts': [{
            AlertID: 5,
            AlertMessage: '',
            AlertTargetID: '7',
            DateExpected: '2014-02-14T00:00:00',
            DisplayStatus: 1,
            Event: null,
            GroupID: -1,
            LoanAlertID: '14243',
            LogRecordID: null,
            MilestoneID: '7',
            SnoozeDuration: null,
            SnoozeStartDTTM: null,
            Status: 'expected',
            UserID: ''
          }]
        });
        LoanAlertPopupData.resolvePromise(payload);
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getpipelineloanalerts');
        $httpBackend.flush();

        expect(PipelineDataStore.LoanAlertPopupInfo.items.length).toBe(1);
        expect(PipelineDataStore.LoanAlertPopupInfo.items[0].DisplayStatus).toBe(1);

      }));
  });

})();
