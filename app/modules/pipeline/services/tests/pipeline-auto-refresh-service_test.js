(function () {
  'use strict';
  describe('Pipeline Auto refresh service', function () {
    var env, httpBackend, response, payload;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, PipelineConst, Restangular) {
      env = ENV;
      httpBackend = $httpBackend;
      response = {
        CategoryField: 'Pipeline',
        SettingsField: [{
          Name: 'RefreshInterval',
          Value: '30'
        }]
      };
      payload = {
        Category: 'Pipeline',
        Setting: 'RefreshInterval'
      };
      spyOn(Restangular, 'all').and.callThrough();
      httpBackend.expectPOST(env.restURL + '/user/getusersettings', payload).respond(response);

    }));

    it('Should check the AutoRefreshInterval if user has rights to auto refresh setting',
      inject(function (PipelineAutoRefresh, PipelineDataStore) {
        PipelineDataStore.PersonaAccess = {LoanMgmt: {'LoanMgmt_PipelineAutoRefresh': true}};
        PipelineAutoRefresh.resolvePromise();
        httpBackend.flush();
        expect(PipelineDataStore.AutoRefreshInterval).toBe(30);
        expect(PipelineDataStore.AutoRefreshIntervalLoaded).toBe(true);
      }));

    it('Should check the AutoRefreshInterval to have the default value of -1 if user does not have rights to auto ' +
      'refresh setting',
      inject(function (PipelineAutoRefresh, PipelineDataStore) {
        PipelineDataStore.PersonaAccess = {LoanMgmt: {'LoanMgmt_PipelineAutoRefresh': false}};
        PipelineAutoRefresh.resolvePromise();
        expect(PipelineDataStore.AutoRefreshInterval).toBe(-1);
        expect(PipelineDataStore.AutoRefreshIntervalLoaded).toBe(false);
      }));
  });
})();
