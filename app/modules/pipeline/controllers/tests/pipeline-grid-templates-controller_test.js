(function () {
  'use strict';
  describe('Pipeline grid template controller test', function () {
    var element, ctrl, scope, httpBackend, pipelineDataStore;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function ($compile, $rootScope, $controller, $httpBackend) {
      scope = $rootScope;
      scope.alertCount = 0;
      httpBackend = $httpBackend;
      ctrl = $controller('PipelineGridTemplatesController', {$scope: scope});
      $compile(element)($rootScope);
    }));
    it('Should show the Alert count if count is greater than zero', inject(function ($compile) {
      scope.alertCount = 5;
      var elem = $compile(angular.element('<div ng-controller="PipelineGridTemplatesController as vm">' +
      '<div id="alertcount" ng-show={{alertCount}}>' +
      '{{alertCount}}</div></div>'))(scope);
      scope.$digest();
      expect(elem.find('div[id="alertcount"]').hasClass('ng-hide')).toBe(false);
    }));
    it('Should hide the Alert count if count is greater than zero', inject(function ($compile) {
      scope.alertCount = 0;
      var elem = $compile(angular.element('<div ng-controller="PipelineGridTemplatesController as vm">' +
      '<div id="alertcount" ng-show={{alertCount}}>' +
      '{{alertCount}}</div></div>'))(scope);
      scope.$digest();
      expect(elem.find('div[id="alertcount"]').hasClass('ng-hide')).toBe(true);
    }));

    it('Should check for milestone name not found in data store', inject(function (PipelineDataStore) {
      pipelineDataStore = PipelineDataStore;
      pipelineDataStore.MilestoneProperties = [
        {'Name': 'Milestone_1', 'Color': 'Color [ A=255, R=10, G=20, B=255]'},
        {'Name': 'Milestone_2', 'Color': 'Color [ A=255, R=0, G=0, B=255]'}
      ];
      var returnMilestoneName = ctrl.setMilestoneColor('Milestone1');
      expect(returnMilestoneName).toBe('Milestone1');
      expect(ctrl.milestoneColors).toBe('rgba(0, 0, 0, 0)');
    }));

    it('Should check for milestone name found in data store', inject(function (PipelineDataStore) {
      pipelineDataStore = PipelineDataStore;
      pipelineDataStore.MilestoneProperties = [
        {'Name': 'Milestone_1', 'Color': 'Color [ A=255, R=10, G=20, B=255]'},
        {'Name': 'Milestone_2', 'Color': 'Color [ A=255, R=0, G=0, B=255]'}
      ];
      var returnMilestoneName = ctrl.setMilestoneColor('Milestone_1');
      expect(returnMilestoneName).toBe('Milestone_1');
      expect(ctrl.milestoneColors).toBe('rgba(10,20,255,255)');
    }));

    xit('Should check if milestone name is not found in data store', inject(function (PipelineDataStore) {
      pipelineDataStore = PipelineDataStore;
      pipelineDataStore.MilestoneProperties = [
        {'Name': 'Milestone_1', 'Color': 'Color [ A=255, R=10, G=20, B=255]'},
        {'Name': 'Milestone_2', 'Color': 'Color [ A=255, R=0, G=0, B=255]'}
      ];
      var returnMilestoneName = ctrl.setMilestoneColor('Milestone_3');
      expect(returnMilestoneName).toBe('Milestone_3');
      expect(ctrl.milestoneColors).toBe('rgba(0, 0, 0, 0)');
    }));

    xit('Should check if milestone color is not found in data store', inject(function (PipelineDataStore) {
      pipelineDataStore = PipelineDataStore;
      pipelineDataStore.MilestoneProperties = [
        {'Name': 'Milestone_1', 'Color': 'Color [ A=255, R=10, G=20, B=255]'},
        {'Name': 'Milestone_2', 'Color': 'Color [ A=255, R=0, G=0]'}
      ];
      var returnMilestoneName = ctrl.setMilestoneColor('Milestone_2');
      expect(returnMilestoneName).toBe('Milestone_2');
      expect(ctrl.milestoneColors).toBe('rgba(0, 0, 0, 0)');
    }));

    xit('Should test openloanalert method', inject(function ($rootScope, PipelineEventsConst) {
      spyOn($rootScope, '$broadcast');
      ctrl.openLoanAlert('MilestoneAlert');
      expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_ALERT_EVENT,
        {'alertColumnUniqueID': 'MilestoneAlert'});
    }));

    xit('Should test movetofolder method', inject(function ($rootScope, PipelineEventsConst) {
      spyOn($rootScope, '$broadcast');
      ctrl.moveToFolder();
      expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT, {'folder': ''});
    }));

    xit('Should test processEPassUrl method', inject(function (encompass) {
      spyOn(encompass, 'processEPassUrl');
      ctrl.processEPassUrl('www.abdc.com');
      expect(encompass.processEPassUrl).toHaveBeenCalledWith(JSON.stringify({Url: 'www.abdc.com'}), angular.noop);
    }));

    xit('Should test openLoanForm method', inject(function (encompass) {
      spyOn(encompass, 'openLoanForm');
      ctrl.openLoanForm('TestForm');
      expect(encompass.openLoanForm).toHaveBeenCalledWith(JSON.stringify({LoanFormName: 'TestForm'}), angular.noop);
    }));

    xit('Should test startConversation method', inject(function (encompass) {
      spyOn(encompass, 'startConversation');
      ctrl.startConversation(true, true, 'TestInfo');
      expect(encompass.startConversation).toHaveBeenCalledWith(JSON.stringify({
        IsEmail: true,
        IsBorrower: true,
        ContactInfo: 'TestInfo'
      }), angular.noop);
    }));

    xit('Should test showLockConfirmation method', inject(function (encompass) {
      spyOn(encompass, 'showLockConfirmation');
      ctrl.showLockConfirmation();
      expect(encompass.showLockConfirmation).toHaveBeenCalledWith(null, angular.noop);
    }));

    xit('Should test createAppointment method', inject(function (encompass) {
      spyOn(encompass, 'createAppointment');
      ctrl.createAppointment('3526hkt5-yh76-g5h9-3dff-8976fhgtr45y');
      expect(encompass.createAppointment).toHaveBeenCalledWith(JSON.stringify(
        {ContactGuid: '3526hkt5-yh76-g5h9-3dff-8976fhgtr45y'}), angular.noop);
    }));

    xit('Should test openLoanMessagesPopup method', inject(function (modalWindowService, PipelineDataStore,
                                                                    PipelineConst) {
      spyOn(modalWindowService, 'openLoanMessagesPopup');
      PipelineDataStore.LoanMessagesData.items = ['data'];
      ctrl.openLoanMessagesPopup(10, '3526hkt5-yh76-g5h9-3dff-8976fhgtr45y');
      expect(modalWindowService.openLoanMessagesPopup).toHaveBeenCalledWith(PipelineConst.MessagesText + '(10)',
        '3526hkt5-yh76-g5h9-3dff-8976fhgtr45y');
      expect(PipelineDataStore.LoanMessagesData.items.length).toBe(0);
    }));

    xit('Should test showLockConfirmation method', inject(function ($window) {
      spyOn($window, 'open');
      ctrl.openMap();
      expect($window.open).toHaveBeenCalled();
    }));

    xit('Should test contextMenuData method', inject(function (PipelineDataStore, PipelineContextMenu, $q) {
      var defer = $q.defer();
      defer.resolve();
      PipelineDataStore.PipelineGridData.selected = [{'Loan$Guid': '3526hkt5-yh76-g5h9-3dff-8976fhgtr45y'}];
      spyOn(PipelineContextMenu, 'resolvePromise').and.callFake(function () {
        PipelineContextMenu.loanData = {'3526hkt5-yh76-g5h9-3dff-8976fhgtr45y': 'test'};
        return defer.promise;
      });
      ctrl.contextMenuData();
      scope.$apply();
      expect(ctrl.menuData).toBe('test');
    }));

    xit('Should test dateDiff method when difference is less than zero', inject(function () {
      var currentDate = new Date();
      var returnValue = ctrl.dateDiff(currentDate.setDate(currentDate.getDate() - 20), true);
      expect(returnValue).toBe(null);
    }));

    xit('Should test dateDiff method when difference is greater than zero', inject(function () {
      var currentDate = new Date();
      var returnValue = ctrl.dateDiff(currentDate.setDate(currentDate.getDate() + 20), true);
      expect(returnValue).toBe('(20)');
    }));

    xit('Should test dateDiff method when difference is greater than zero and bracket formatting is false',
      inject(function () {
        var currentDate = new Date();
        var returnValue = ctrl.dateDiff(currentDate.setDate(currentDate.getDate() + 20), false);
        expect(returnValue).toBe('Expires in 20 days');
      }));

    xit('Should test dateDiff method when date is null', inject(function () {
      var returnValue = ctrl.dateDiff(null, false);
      expect(returnValue).toBe(null);
    }));
  });
})();
