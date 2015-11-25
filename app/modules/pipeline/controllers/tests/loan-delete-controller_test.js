'use strict';

describe('Test Loan Delete Controller', function () {
  beforeEach(module('elli.encompass.web'));

  var scope, ctrl;
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('LoanDeleteController', {$scope: scope});
  }));

  it('Should check if all the required methods are defined',
    inject(function () {
      expect(ctrl.modalYesClick).toBeDefined();
      expect(ctrl.modalNoClick).toBeDefined();
      expect(ctrl.deleteLoansConfirmation).toBeDefined();
      expect(ctrl.deleteLoans).toBeDefined();
      expect(ctrl.multipleConfirmationPopups).toBeDefined();
      expect(ctrl.checklabel).toBe('Apply to all items');
      expect(ctrl.applyCheck).toBe(false);
    }));

  it('Should check the message value when the selected loans count is 1',
    inject(function (PipelineDataStore, $controller) {
      PipelineDataStore.PipelineGridData.selected = [{
        Loan$BorrowerName: 'Andy', Fields$364: '789',
        Loan$Guid: '1234'
      }];
      ctrl = $controller('LoanDeleteController', {$scope: scope});
      expect(ctrl.message).toBe('Are you sure you want to delete Andy, (#789)?');
    }));

  it('Should check the message value and displayApplyToAll is set to true ' +
    'when the selected loans count is > 1',
    inject(function (PipelineDataStore, $controller, PipelineConst) {
      PipelineDataStore.PipelineGridData.selected = [{
        Loan$BorrowerName: 'Andy', Fields$364: '789',
        Loan$Guid: '1234'
      }, {Loan$BorrowerName: 'Jim', Fields$364: '666', Loan$Guid: '5643'}];
      ctrl = $controller('LoanDeleteController', {$scope: scope});
      expect(ctrl.message).toBe('Are you sure you want to delete Andy, (#789)?');
      expect(ctrl.displayApplyToAll).toBe(true);
    }));

  it('Should check if PipelineDataStore.applyCheckClicked is set to true, closeDeleteLoanWindow of modalWindowService ' +
    'and deleteLoansConfirmation is called when modalYesClick method is called',
    inject(function (modalWindowService, PipelineDataStore) {
      spyOn(ctrl, 'deleteLoansConfirmation').and.callFake(function () {
      });
      spyOn(modalWindowService, 'closeDeleteLoanWindow');
      PipelineDataStore.applyCheckClicked = false;
      ctrl.applyCheck = true;
      ctrl.modalYesClick();
      expect(modalWindowService.closeDeleteLoanWindow).toHaveBeenCalled();
      expect(ctrl.deleteLoansConfirmation).toHaveBeenCalled();
      expect(PipelineDataStore.applyCheckClicked).toBe(true);
    }));

  it('Should check if closeDeleteLoanWindow method of modalWindowService is called when modalNoClick method ' +
    'is executed',
    inject(function (modalWindowService) {
      spyOn(modalWindowService, 'closeDeleteLoanWindow');
      ctrl.applyCheck = true;
      ctrl.modalNoClick();
      expect(modalWindowService.closeDeleteLoanWindow).toHaveBeenCalled();
    }));

  it('Should check if PipelineDataStore.deleteLoansApplyCheckDisabled is set to true,  ' +
    'PipelineDataStore.applyCheckClicked is set to false ' +
    'when modalYesClick method is executed and selected loans count is 1',
    inject(function (PipelineDataStore, DeletePipelineLoan, $controller, $q) {
      PipelineDataStore.PipelineGridData.selected = [{
        Loan$BorrowerName: 'Andy', Fields$364: '789',
        Loan$Guid: '1234'
      }];
      ctrl = $controller('LoanDeleteController', {$scope: scope});
      var deletePromise;
      var deleteDeferred = $q.defer();
      deletePromise = deleteDeferred.promise;
      deleteDeferred.resolve();
      spyOn(DeletePipelineLoan, 'resolvePromise').and.callFake(function (delObj) {
        return deletePromise;
      });
      ctrl.modalYesClick();
      scope.$apply();
      expect(PipelineDataStore.deleteLoansApplyCheckDisabled).toBe(true);
      expect(PipelineDataStore.applyCheckClicked).toBe(false);
    }));

  it('Should check the message value when the selected loan folder is Trash',
    inject(function (PipelineDataStore, $controller) {
      PipelineDataStore.LoanFolderDropdownData.selectedItem = '(Trash)';
      PipelineDataStore.PipelineGridData.selected = [{
        Loan$BorrowerName: 'Andy', Fields$364: '789',
        Loan$Guid: '1234'
      }, {Loan$BorrowerName: 'Jim', Fields$364: '666', Loan$Guid: '5643'}];
      ctrl = $controller('LoanDeleteController', {$scope: scope});
      expect(ctrl.message).toBe('Are you sure you want to permanently delete Andy, (#789)? Once deleted, the loan cannot be ' +
      'recovered.');
    }));

  it('Should check the message value when apply all is checked',
    inject(function (PipelineConst) {
      ctrl.applyCheck = true;
      ctrl.applyAllCheckChange();
      expect(ctrl.message).toBe(PipelineConst.DeleteMultipleLoansMessage);
    }));

  describe('Test when selected loans count is > 1', function () {

    beforeEach(inject(function ($controller, PipelineDataStore, $q, DeletePipelineLoan) {
      PipelineDataStore.PipelineGridData.selected = [{
        Loan$BorrowerName: 'Andy', Fields$364: '789',
        Loan$Guid: '1234'
      }, {Loan$BorrowerName: 'Jim', Fields$364: '666', Loan$Guid: '5643'},
        {Loan$BorrowerName: 'Kim', Fields$364: '555', Loan$Guid: '9876'}];
      ctrl = $controller('LoanDeleteController', {$scope: scope});
      var deletePromise;
      var deleteDeferred = $q.defer();
      deletePromise = deleteDeferred.promise;
      deleteDeferred.resolve();
      spyOn(DeletePipelineLoan, 'resolvePromise').and.callFake(function (delObj) {
        return deletePromise;
      });
      PipelineDataStore.applyCheckClicked = false;
    }));

    it('Should check if PipelineDataStore.deleteLoansApplyCheckDisabled is set to true,  ' +
      'PipelineDataStore.applyCheckClicked is set to false ' +
      'when modalYesClick method is executed, selected loans count > 1 and PipelineDataStore.applyCheckClicked ' +
      'is true',
      inject(function (PipelineDataStore) {
        PipelineDataStore.applyCheckClicked = true;
        ctrl.modalYesClick();
        scope.$apply();
        expect(PipelineDataStore.deleteLoansApplyCheckDisabled).toBe(true);
        expect(PipelineDataStore.applyCheckClicked).toBe(false);
      }));

    it('Should check if PipelineDataStore.deleteLoansApplyCheckDisabled is set to true,  ' +
      'PipelineDataStore.applyCheckClicked is set to false ' +
      'when modalYesClick method is executed, selected loans count > 1 and PipelineDataStore.applyCheckClicked ' +
      'is false',
      inject(function (modalWindowService, $q, PipelineDataStore) {
        var popupPromise;
        var popupDeferred = $q.defer();
        popupPromise = {result: popupDeferred.promise};
        popupDeferred.resolve(false);
        spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function (messageText, title) {
          return popupPromise;
        });
        ctrl.modalYesClick();
        scope.$apply();
        expect(PipelineDataStore.deleteLoansApplyCheckDisabled).toBe(true);
        expect(modalWindowService.showConfirmationPopup).toHaveBeenCalled();
      }));

    it('Should check if showConfirmation popup is called "n - 1" times when modalYesClick method is executed, ' +
      'selected loans count is "n" and PipelineDataStore.applyCheckClicked is false',
      inject(function (modalWindowService, $q, PipelineDataStore) {
        var count = 0;
        var expectedValue = PipelineDataStore.PipelineGridData.selected.length - 1;
        var popupPromise;
        var popupDeferred = $q.defer();
        popupPromise = {result: popupDeferred.promise};
        popupDeferred.resolve(false);
        spyOn(modalWindowService, 'showConfirmationPopup').and.callFake(function (messageText, title) {
          PipelineDataStore.applyCheckClicked = false;
          count = count + 1;
          return popupPromise;
        });
        ctrl.modalYesClick();
        scope.$apply();
        expect(count).toBe(expectedValue);
      }));
  });
});
