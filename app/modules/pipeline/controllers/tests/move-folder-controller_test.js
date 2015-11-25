'use strict';

describe('Test Move folder controller', function () {
  beforeEach(module('elli.encompass.web'));

  var scope, ctrl, rootScope;
  beforeEach(inject(function ($controller, $rootScope) {
    rootScope = $rootScope;
    scope = $rootScope.$new();
    ctrl = $controller('MoveFolderController', {$scope: scope});
  }));

  it('Should check if the methods are defined', function () {
    expect(ctrl.moveFolderOkClick).toBeDefined();
    expect(ctrl.moveFolderCancelClick).toBeDefined();
    expect(ctrl.moveFolderDropdownOptions).toBeDefined();
  });

  it('Should check if moveFolderDropdownSource does not contain LoanFolderDropdownData selectedItem when ' +
    'LoanFolderDropdownData selectedItem is not null',
    inject(function (PipelineDataStore, $controller) {
      PipelineDataStore.MoveLoanFolderList.items = ['NewLoans', 'ApprovedLoans', 'PendingLoans'];
      PipelineDataStore.LoanFolderDropdownData.selectedItem = 'ApprovedLoans';
      ctrl = $controller('MoveFolderController', {$scope: scope});
      expect(ctrl.moveFolderDropdownOptions.dataSource).not.toContain('ApprovedLoans');
      expect(ctrl.moveFolderDropdownOptions.dataSource).toEqual(['NewLoans', 'PendingLoans']);
    }));

  it('Should check if closeMoveToFolderWindow is called on moveFolderOkClick',
    inject(function (modalWindowService) {
      spyOn(modalWindowService, 'closeMoveToFolderWindow');
      ctrl.moveFolderOkClick();
      expect(modalWindowService.closeMoveToFolderWindow).toHaveBeenCalled();
    }));

  it('Should check if showMoveConfirmation is called on moveFolderOkClick',
    inject(function (modalWindowService, PipelineEventsConst) {
      spyOn(modalWindowService, 'closeMoveToFolderWindow');
      spyOn(rootScope, '$broadcast').and.callThrough();
      scope.$on(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT, function () {
      });
      ctrl.moveLoanFolder = 'folderName';
      ctrl.moveFolderOkClick();
      expect(modalWindowService.closeMoveToFolderWindow).toHaveBeenCalled();
      expect(rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT,
        {'folder': ctrl.moveLoanFolder});
    }));

  it('Should check if closeMoveToFolderWindow is called on moveFolderCancelClick',
    inject(function (modalWindowService) {
      spyOn(modalWindowService, 'closeMoveToFolderWindow');
      ctrl.moveFolderCancelClick();
      expect(modalWindowService.closeMoveToFolderWindow).toHaveBeenCalled();
    }));
});
