(function () {
  'use strict';
  describe('Pipeline Context Menu', function () {
    var env, httpBackend, Restangular, pipelineDataStore;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_, PipelineDataStore) {
      env = ENV;
      pipelineDataStore = PipelineDataStore;
      httpBackend = $httpBackend;
      Restangular = _Restangular_;
    }));

    it('Should get pipeline loan context menu',
      inject(function (PipelineDataStore, ENV, $httpBackend, PipelineContextMenu) {
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/loan/getcontextmenu').respond(201, {});
        PipelineContextMenu.resolvePromise({});
        $httpBackend.flush();
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getcontextmenu');
      }));
  });
})();
