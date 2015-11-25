(function () {
  'use strict';
  describe('Test Duplicate manage view controller: DuplicateManageViewController', function () {
    var scope, ctrl, $document, env;

    beforeEach(module('elli.encompass.web', function ($provide) {
      $provide.value('currentViewName', function () {
        return 'DefaultView';
      });
    }));

    beforeEach(inject(function ($compile, $rootScope, $controller, _$document_, $httpBackend, ENV) {
      scope = $rootScope.$new();
      $document = _$document_;
      env = ENV;
      $httpBackend.when('POST', env.restURL + '/pipeline/view/duplicate', '{}').respond([{}]);
      $httpBackend.when('GET', env.restURL + '/pipeline/view/getlistofviews').respond([{}]);
      ctrl = $controller('DuplicateManageViewController', {$scope: scope});
    }));

    it('Should call popup on empty view name', inject(function (modalWindowService, DuplicateViewService) {
      ctrl.renameValue = '';
      spyOn(modalWindowService.popupInformation, 'open');
      spyOn(DuplicateViewService, 'resolvePromise');
      ctrl.okClick();
      expect(modalWindowService.popupInformation.open).toHaveBeenCalled();
      expect(DuplicateViewService.resolvePromise).not.toHaveBeenCalled();

    }));

    it('Should call popup on duplicate view name',
      inject(function (modalWindowService, PipelineDataStore, DuplicateViewService) {
        ctrl.renameValue = 'TestViewName';
        spyOn(modalWindowService.popupInformation, 'open');
        spyOn(DuplicateViewService, 'resolvePromise');
        var items = [{ViewName: 'TestViewName', PersonaName: 'Super Administrator'},
          {ViewName: 'DefaultView', PersonaName: 'Loann Officer'}];
        PipelineDataStore.PipelineViewListDataStore.items = items;
        ctrl.okClick();
        expect(modalWindowService.popupInformation.open).toHaveBeenCalled();
        expect(DuplicateViewService.resolvePromise).not.toHaveBeenCalled();

      }));

    it('Should call duplicate view service resolvePromise',
      inject(function (PipelineDataStore, DuplicateViewService, modalWindowService, PipelineViewListData) {
        ctrl.renameValue = 'TestViewName1';
        spyOn(DuplicateViewService, 'resolvePromise');
        spyOn(PipelineViewListData, 'resolvePromise');
        spyOn(modalWindowService.popupInformation, 'open');
        spyOn(modalWindowService, 'closeDuplicateWindow');
        PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid =
          [{ViewName: 'TestViewName', PersonaName: 'Super Administrator'}];
        ctrl.okClick();
        expect(modalWindowService.popupInformation.open).not.toHaveBeenCalled();
        expect(DuplicateViewService.resolvePromise).toHaveBeenCalled();
        expect(PipelineViewListData.resolvePromise).toHaveBeenCalled();
        expect(modalWindowService.closeDuplicateWindow).toHaveBeenCalled();

      }));
  });
})();
