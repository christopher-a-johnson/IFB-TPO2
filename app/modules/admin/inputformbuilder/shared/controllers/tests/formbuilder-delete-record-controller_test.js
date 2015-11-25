(function () {
  'use strict';
  describe('Test formbuilder delete record Controller: FormBuilderDeleteRecordController', function () {
    var ctrl, newCtrl, httpBackend, formBuilderModalWindowService, env, scope;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($controller, $httpBackend, FormBuilderModalWindowService,
                                ENV, $rootScope) {
      env = ENV;
      formBuilderModalWindowService = FormBuilderModalWindowService;
      httpBackend = $httpBackend;
      httpBackend.when('GET', env.restURL + '/api/fb/FormsUsingScriptFile.json').respond([{}]);
      spyOn(FormBuilderModalWindowService, 'closePopup');
      ctrl = $controller;
      newCtrl = initializeCtrl();
      scope = $rootScope.$new();
    }));
    function initializeCtrl() {
      return ctrl('FormBuilderDeleteRecordController', {
        $scope: scope,
        LayoutConfiguration: {}
      });
    }

    it('should Close Popup after cancelDeleteOperation event', function () {
      newCtrl.cancelDeleteOperation();
      expect(formBuilderModalWindowService.closePopup).toHaveBeenCalledWith(true);
    });
    it('should Close Popup after deleteRecord event', function () {
      newCtrl.deleteRecord();
      expect(formBuilderModalWindowService.closePopup).toHaveBeenCalledWith(false);
    });
  });
})();
