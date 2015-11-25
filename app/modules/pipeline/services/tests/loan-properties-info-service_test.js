(function () {
  'use strict';
  describe('Pipeline Loan Properties', function () {
    var env, httpBackend, Restangular, pipelineDataStore;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_, PipelineDataStore) {
      env = ENV;
      pipelineDataStore = PipelineDataStore;
      httpBackend = $httpBackend;
      Restangular = _Restangular_;
    }));

    it('Should get pipeline loan properties',
      inject(function (PipelineDataStore, ENV, $httpBackend, LoanPropertiesInfoService) {
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getloanpropertiesinfo').respond(201, {
          'GetLoanPropertiesInfoResponse1': {
            'loanPropertiesInfoField': {
              'sizeField': '100',
              'identityField': {'guidField': 'Name', 'loanNameField': 'Loan', 'loanFolderField': '<(Archive)>'}
            }
          }
        });
        LoanPropertiesInfoService.resolvePromise({
          'IsExternalOrganization': 'true',
          'LoanGuid': 'a2f3d228-8bed-4e39-9eaa-f5f07db3c272'
        });
        $httpBackend.flush();
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getloanpropertiesinfo');
      }));
  });
})();
