/**
 * Created by MGurushanthappa on 7/7/2015.
 */
(function () {
  'use strict';
  describe('Formbuilder modal window service', function () {
    // The variables that we need in each unit test.
    var rootScope, $document, httpBackend, env;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($rootScope, _$document_, $httpBackend, ENV) {
      rootScope = $rootScope;
      $document = _$document_;
      httpBackend = $httpBackend;
      env = ENV;
    }));

    beforeEach(function () {
      jasmine.addMatchers({
        toHaveModalsOpen: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              var modalDomEls = actual.find('div.k-window-content');
              var result = {};
              result.pass = modalDomEls.length === expected;
              return result;
            }
          };
        }
      });
    });

    it('should open and dismiss a modal pop up ', inject(function (FormBuilderModalWindowService) {
      var modalInstance;
      var layoutConfiguration = {};
      var popupConfiguration = {
        modal: true,
        title: 'Hi',
        resizable: false,
        width: 100,
        height: 100,
        animation: false,
        templateUrl: 'modules/admin/inputformbuilder/shared/views/formbuilder-delete-record-popup.html',
        controller: 'FormBuilderDeleteRecordController as vm'

      };
      modalInstance = FormBuilderModalWindowService.showPopup(popupConfiguration, layoutConfiguration);
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);

      FormBuilderModalWindowService.closePopup(true);
      expect($document).toHaveModalsOpen(0);
    }));
  });
})();
