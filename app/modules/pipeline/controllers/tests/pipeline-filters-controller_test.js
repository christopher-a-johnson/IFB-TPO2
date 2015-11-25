(function () {
  'use strict';
  describe('Test Pipeline Filters Controller: PipelineFitlersController', function () {
    var scope, ctrl, rootScope, personaAccessService, pipelineDataStore, encompass, _timeout;

    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function ($rootScope, $controller, PersonaAccessService, _PipelineDataStore_, _encompass_, $timeout) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      ctrl = $controller('PipelineFiltersController', {
        scope: scope
      });
      pipelineDataStore = _PipelineDataStore_;
      personaAccessService = PersonaAccessService;
      encompass = _encompass_;
      _timeout = $timeout;
    }));

    it('Should notify user if notify button enabled', function () {
      pipelineDataStore.notifyButtonEnabled = true;
      spyOn(encompass, 'notifyUsers');
      ctrl.notifyUser();
      _timeout.flush();
      expect(encompass.notifyUsers).toHaveBeenCalled();
    });

    it('Should toggle ui for advanced search on click of Advanced Search button', function () {
      ctrl.advanceFilter();
      expect(pipelineDataStore.AdvanceFilterShow).toBe(true);
    });

    it('should clear filter applied in advance search', function () {
      ctrl.clearAllFilters();
      expect(pipelineDataStore.PipelineGridData.filters.length).toBe(0);
    });
  });
})();
