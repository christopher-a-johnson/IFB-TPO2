(function () {
  'use strict';
  describe('Test Duplicate Loan Controller: DuplicateLoanController', function () {
    beforeEach(module('elli.encompass.web'));

    var scope, modalDuplicateLoanController, loanFolderDropdownData, httpBackend, env;
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, LoanFolderDropdownData, ENV) {
      scope = $rootScope.$new();
      loanFolderDropdownData = LoanFolderDropdownData;
      spyOn(LoanFolderDropdownData, 'resolvePromise').and.callThrough();
      var response = [{}];
      httpBackend = $httpBackend;
      httpBackend.when('GET', '/api/v1/loanFolderDropdownData.json').respond(response);
      env = ENV;
      httpBackend.when('GET', env.restURL + '/pipeline/loan/duplicatetemplate').respond(response);
      modalDuplicateLoanController = $controller('ModalDuplicateLoanController', {
        $scope: scope,
        LoanFolderDropdownData: LoanFolderDropdownData
      });
    }));

    it('Loan folder data fetched from api', inject(function (LoanFolderDropdownData, PipelineDataStore) {
      loanFolderDropdownData.resolvePromise();
      httpBackend.flush();
      expect(PipelineDataStore.LoanFolderDropdownData.items.length).not.toBe(0);
    }));

    it('Loan folder dropdown options defined', inject(function () {
      expect(modalDuplicateLoanController.loanFolderDropdownOptions).toBeDefined();
    }));

    it('Should call duplicate loan of thick client on ok click',
      inject(function (encompass) {
        modalDuplicateLoanController.selectedLoan = '<Archive>';
        encompass.duplicateLoan =
          jasmine.createSpy('encompass.duplicateLoan').and.callFake(
            function (jsonParam, callBack) {
              return 'test';
            }
          );
        modalDuplicateLoanController.okClick();
        expect(encompass.duplicateLoan).toHaveBeenCalled();
      }));

    it('Should call close modal window popup on cancel click',
      inject(function (modalWindowService) {
        spyOn(modalWindowService.modalDuplicateLoan, 'close');
        modalDuplicateLoanController.cancelClick();
        expect(modalWindowService.modalDuplicateLoan.close).toHaveBeenCalled();
      }));

    it('Should call close modal window popup on ok click',
      inject(function (modalWindowService) {
        modalDuplicateLoanController.selectedLoan = '<Archive>';
        spyOn(modalWindowService.modalDuplicateLoan, 'close');
        modalDuplicateLoanController.okClick();
        expect(modalWindowService.modalDuplicateLoan.close).toHaveBeenCalled();
      }));

    it('Should check duplicate selected loan radio button as according to persona accesss',
      inject(function (PipelineConst, $controller, LoanFolderDropdownData, PipelineDataStore) {
        PipelineDataStore.PersonaAccess = {'LoanMgmt': {'LoanMgmt_Duplicate': true}};
        modalDuplicateLoanController = $controller('ModalDuplicateLoanController', {
          $scope: scope,
          LoanFolderDropdownData: LoanFolderDropdownData
        });
        expect(!modalDuplicateLoanController.dataStore.PersonaAccess.LoanMgmt[PipelineConst.DuplicateLoanPerosnaPropName])
          .toBe(modalDuplicateLoanController.duplicateSelectedLoanDisabled);
        expect(modalDuplicateLoanController.loanDuplicateOption).toBe('1');
      }));

    it('Should check duplicate second lien radio button as according to persona accesss',
      inject(function (PipelineConst, $controller, LoanFolderDropdownData, PipelineDataStore) {
        PipelineDataStore.PersonaAccess = {
          'LoanMgmt': {
            'LoanMgmt_Duplicate_For_Second': true,
            'LoanMgmt_Duplicate_Blank': false
          }
        };
        modalDuplicateLoanController = $controller('ModalDuplicateLoanController', {
          $scope: scope,
          LoanFolderDropdownData: LoanFolderDropdownData
        });
        expect(!modalDuplicateLoanController.dataStore.PersonaAccess.LoanMgmt[PipelineConst.DuplicateSecondLoanPerosnaPropName])
          .toBe(modalDuplicateLoanController.duplicateSecondLienDisabled);
        expect(modalDuplicateLoanController.loanDuplicateOption).toBe('2');
      }));

    it('Should check the selected loan option 3 as according to persona accesss',
      inject(function (PipelineConst, $controller, LoanFolderDropdownData, PipelineDataStore) {
        PipelineDataStore.PersonaAccess = {
          'LoanMgmt': {
            'LoanMgmt_Duplicate_For_Second': false,
            'LoanMgmt_Duplicate_Blank': false
          }
        };
        modalDuplicateLoanController = $controller('ModalDuplicateLoanController', {
          $scope: scope,
          LoanFolderDropdownData: LoanFolderDropdownData
        });
        expect(modalDuplicateLoanController.loanDuplicateOption).toBe('3');
      }));

  });
})();
