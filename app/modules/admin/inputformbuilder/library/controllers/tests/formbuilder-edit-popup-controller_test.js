(function () {
  'use strict';
  describe('Test formbuilder edit popup Controller: FormBuilderEditPopupCtrl', function () {
    var ctrl, newCtrl, formBuilderModalWindowService;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function ($controller, FormBuilderModalWindowService) {
      formBuilderModalWindowService = FormBuilderModalWindowService;
      spyOn(FormBuilderModalWindowService, 'closePopup');
      ctrl = $controller;
      newCtrl = initializeCtrl();
    }));
    function initializeCtrl() {
      return ctrl('FormBuilderEditPopupCtrl', {
        LayoutConfiguration: {}
      });
    }
    it('should call ClosePopup inside modalYesClick', function () {
      newCtrl.modalYesClick();
      expect(formBuilderModalWindowService.closePopup).toHaveBeenCalledWith(true);
    });
    it('should call ClosePopup inside modalNoClick', function () {
      newCtrl.modalNoClick();
      expect(formBuilderModalWindowService.closePopup).toHaveBeenCalledWith(true);
    });
  });
})();
