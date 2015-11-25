(function () {
  'use strict';
  describe('Test formbuilder confirm file name Controller: FormBuilderConfirmPopupController', function () {
    var ctrl, newCtrl, formBuilderModalWindowService;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function ($controller, FormBuilderModalWindowService) {
      formBuilderModalWindowService = FormBuilderModalWindowService;
      spyOn(FormBuilderModalWindowService, 'closePopup');
      ctrl = $controller;
      newCtrl = initializeCtrl();
    }));
    function initializeCtrl() {
      return ctrl('FormBuilderConfirmPopupController', {
        LayoutConfiguration: {}
      });
    }
    it('ClosePopup should be called inside modalYesClick', function () {
      newCtrl.modalYesClick();
      expect(formBuilderModalWindowService.closePopup).toHaveBeenCalledWith(false);
    });
    it('ClosePopup should be called inside modalNoClick', function () {
      newCtrl.modalNoClick();
      expect(formBuilderModalWindowService.closePopup).toHaveBeenCalledWith(true);
    });
  });
})();
