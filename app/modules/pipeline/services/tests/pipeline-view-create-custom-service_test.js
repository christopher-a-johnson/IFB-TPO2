(function () {
  'use strict';
  describe('Pipeline View Custom Service', function () {
    var env, httpBackend, Restangular, pipelineDataStore;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_, PipelineDataStore) {
      env = ENV;
      pipelineDataStore = PipelineDataStore;
      httpBackend = $httpBackend;
      Restangular = _Restangular_;
    }));

    it('Should get pipeline loan properties',
      inject(function (PipelineDataStore, ENV, $httpBackend, CreateCustomView) {
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/view/createcustompipelineview').respond(201, {});
        CreateCustomView.resolvePromise({});
        $httpBackend.flush();
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/view/createcustompipelineview');
        expect(PipelineDataStore.saveButtonDisabled).toBe(true);
        expect(PipelineDataStore.resetButtonDisabled).toBe(true);
      }));
  });
})();
