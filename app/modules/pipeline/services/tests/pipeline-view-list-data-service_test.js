(function () {
  'use strict';
  describe('Pipeline View List Data', function () {
    var env, httpBackend, Restangular, pipelineDataStore;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_, PipelineDataStore) {
      env = ENV;
      pipelineDataStore = PipelineDataStore;
      httpBackend = $httpBackend;
      Restangular = _Restangular_;
    }));

    it('Should get pipeline view list',
      inject(function (PipelineDataStore, ENV, $httpBackend, PipelineViewListData) {
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectGET(ENV.restURL + '/pipeline/view/getlistofviews').respond([
          {'ViewName': 'Test', 'Type': 'normal'},
          {'ViewName': 'MyView', 'Type': 'normal'}
        ]);
        PipelineViewListData.resolvePromise();
        $httpBackend.flush();
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/view/getlistofviews');
        expect(PipelineDataStore.PipelineViewListDataStore.items.length).toBe(2);
        expect(PipelineDataStore.ManageViewListLoaded).toBe(true);
      }));
  });
})();
