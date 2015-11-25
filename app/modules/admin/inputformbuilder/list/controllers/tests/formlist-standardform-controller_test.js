/**
 * Created by urandhe on 5/11/2015.
 */
(function () {
  'use strict';
  describe('Test Standard Form Controller', function () {
    var scope, ctrl, rootScope, env;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function ($controller, $rootScope, $httpBackend, StandardFormListData,
                                ENV) {
      scope = $rootScope.$new();
      env = ENV;
      rootScope = $rootScope;
      ctrl = $controller('StandardFormListCtrl', {
        scope: scope
      });
    }));

    it('Should set selectable to true initially', function () {
      expect(ctrl.option.selectable).toEqual(true);
    });

    it('Should disable Open button initially', function () {
      expect(ctrl.isOpenButtonDisabled).toBe(true);
    });

    it('Should close standard popup window', inject(function (FormBuilderModalWindowService) {
      spyOn(FormBuilderModalWindowService, 'closePopup');
      ctrl.CloseStandardWindowPopUp();
      expect(FormBuilderModalWindowService.closePopup).toHaveBeenCalled();
    }));

  });
})();
