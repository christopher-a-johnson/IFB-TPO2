/**
 * Created by rkumar3 on 5/11/2015.
 */
(function () {
  'use strict';
  describe('Test Loan Message Controller', function () {
    var ctrl, env, scope, compile;
    beforeEach(module('elli.encompass.web'));
    beforeEach(module('elli.encompass.web.pipeline'));
    var responseData = [
      {
        'Description': 'aaa',
        'Source': 'aa',
        'Timestamp': '02/02/2000'
      }
    ];
    beforeEach(inject(function ($compile, $rootScope, $controller, $httpBackend, ENV) {
      scope = $rootScope.$new();
      compile = $compile;
      env = ENV;
      $httpBackend.when('POST', env.restURL + 'pipeline/loan/getmessages').respond(responseData);
      ctrl = $controller('LoanMessagesController', {
        $scope: scope,
        selectedLoanGUID: {}
      });

    }));
    it('Should check if all the required methods are defined',
      inject(function () {
        expect(ctrl.closePopup).toBeDefined();
      }));

    it('Should check LoanMessagesService.resolvePromise called on initialize ', inject(
      function (PipelineDataStore, $controller, LoanMessagesService) {
        spyOn(LoanMessagesService, 'resolvePromise');
        ctrl = $controller('LoanMessagesController',
          {
            $scope: scope,
            selectedLoanGUID: {}
          });
        expect(LoanMessagesService.resolvePromise).toHaveBeenCalled();
      }));

    it('Should check modalWindowService.closeLoanMessagesPopup called after invoking closePopup',
      inject(function (modalWindowService) {
        spyOn(modalWindowService, 'closeLoanMessagesPopup');
        ctrl.closePopup();
        expect(modalWindowService.closeLoanMessagesPopup).toHaveBeenCalled();
      }));

    it('Should check LoanMessagesGridOptions.dataSource get value as LoanMessagesController initialize', inject(
      function ($controller, PipelineDataStore) {
        PipelineDataStore.LoanMessagesData.items = [
          {
            'Description': 'aaa',
            'Source': 'aa',
            'Timestamp': '02/02/2000'
          }
        ];
        PipelineDataStore.CompanyViewDropdownData.selectedItem = 'Internal';
        ctrl = $controller('LoanMessagesController',
          {
            $scope: scope,
            selectedLoanGUID: {}
          });
        expect(ctrl.loanMessagesGridOptions.dataSource).toEqual([{
          Description: 'aaa',
          Source: 'aa', Timestamp: '02/02/2000'
        }]);
      }));
  });

})();
