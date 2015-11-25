(function () {
  'use strict';
  describe('Test TPO Companies data service', function () {
    var env, httpBackend, Restangular;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_) {
      env = ENV;
      httpBackend = $httpBackend;
      Restangular = _Restangular_;

    }));
    it('Should get external organization data from API', inject(function (ENV, TPOCompaniesService, PipelineDataStore, $httpBackend) {
      spyOn(Restangular, 'one').and.callThrough();
      $httpBackend.expectGET(ENV.restURL + '/pipeline/view/externalorginfo').respond({
        ExternalOrgInfoList: [{externalIdField: 1, nameField: 'All'}, {
          externalIdField: 2,
          nameField: 'Test'
        }]
      });

      TPOCompaniesService.resolvePromise();
      expect(Restangular.one).toHaveBeenCalledWith('pipeline/view/externalorginfo');
      $httpBackend.flush();
      expect(PipelineDataStore.TPOCompaniesData.items.length).toBe(2);
    }));
  });
})();
