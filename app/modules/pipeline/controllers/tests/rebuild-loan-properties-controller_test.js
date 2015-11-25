'use strict';

describe('Test Save Pipeline view Controller', function () {
  beforeEach(module('elli.encompass.web'));

  var scope, ctrl;
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('RebuildLoanPropertiesController', {$scope: scope});
  }));

  it('Should check if rebuildLoanClick is defined', function () {
    expect(ctrl.rebuildLoanClick).toBeDefined();
  });

  it('Should check if closeLoanProperties is defined', function () {
    expect(ctrl.closeLoanProperties).toBeDefined();
  });

  it('Should check if encompass rebuildLoan method is called',
    inject(function (encompass, PipelineDataStore, $controller, $timeout) {
      spyOn(encompass, 'rebuildLoan');
      PipelineDataStore.LoanPropertiesInfo = {loanFolder: 'TestFolder', loanName: 'TestLoan'};
      ctrl = $controller('RebuildLoanPropertiesController', {$scope: scope});
      var rebuildLoanData = JSON.stringify({'LoanFolder': 'TestFolder', 'LoanName': 'TestLoan'});
      ctrl.rebuildLoanClick();
      $timeout.flush();
      expect(encompass.rebuildLoan).toHaveBeenCalledWith(rebuildLoanData, ctrl.rebuildLoanCallback);
    }));

  it('Should check if closeRebuildLoanPropertiesWindow is called on cloaseLoanProperties',
    inject(function (modalWindowService) {
      spyOn(modalWindowService, 'closeRebuildLoanPropertiesWindow');
      ctrl.closeLoanProperties();
      expect(modalWindowService.closeRebuildLoanPropertiesWindow).toHaveBeenCalled();
    }));
});
