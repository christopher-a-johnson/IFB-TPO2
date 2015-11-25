(function () {
  'use strict';
  describe('Test formlist toolbar Controller: FormBuilderToolbarCtrl', function () {
    var scope, ctrl, rootScope, formBuilderService;
    var formListConst;
    var imagesConst;
    var scriptsConst;
    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($rootScope, $controller, FormBuilderService, ImagesConst, ScriptsConst, FormListConst) {
      scope = $rootScope.$new();
      formBuilderService = FormBuilderService;
      imagesConst = ImagesConst;
      scriptsConst = ScriptsConst;
      formListConst = FormListConst;
      ctrl =   $controller;
      rootScope = $rootScope;
    }));

    function initializeCtrl() {
      return ctrl('FormBuilderToolbarCtrl', {
        $scope: scope
      });
    }

    it('Should check for list page', function() {
      formBuilderService.setCurPage(formListConst.FORM_LIST_PAGE);
      var newCtrl = initializeCtrl();
      expect(newCtrl.importButtonName).toBe(formListConst.FORM_LIST_IMPORT_BUTTON);
      expect(newCtrl.listPage).toBe(true);
      expect(newCtrl.assetLibPage).toBe(false);
    });

    it('Should check for image page', function() {
      formBuilderService.setCurPage(imagesConst.IMAGES_PAGE);
      var newCtrl = initializeCtrl();
      expect(newCtrl.importButtonName).toBe(imagesConst.IMAGES_IMPORT_BUTTON);
      expect(newCtrl.listPage).toBe(false);
      expect(newCtrl.assetLibPage).toBe(true);
    });

    it('Should check for script page', function() {
      formBuilderService.setCurPage(scriptsConst.SCRIPTS_PAGE);
      var newCtrl = initializeCtrl();
      expect(newCtrl.importButtonName).toBe(scriptsConst.SCRIPTS_IMPORT_BUTTON);
      expect(newCtrl.listPage).toBe(false);
      expect(newCtrl.assetLibPage).toBe(true);
    });

    //TODO: move the code to directive
    xit('Should toggle upload section on import click', function() {
      var newCtrl = initializeCtrl();
      newCtrl.toggleUploadSection();
      expect(newCtrl.showUpload).toBe(true);
    });

    it('Open Standard Window PopUp', inject(function (FormBuilderModalWindowService) {
      var newCtrl = initializeCtrl();
      spyOn(FormBuilderModalWindowService, 'showPopup');
      newCtrl.standardFormsButtonClick();
      expect(FormBuilderModalWindowService.showPopup).toHaveBeenCalled();
    }));
  });
})();
