(function () {
  'use strict';
  describe('Kendo Window', function () {
    // The variables that we need in each unit test.
    var rootScope, scope, ctrl, restUrl, kWindow, $document, $timeout, $templateCache, $q;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($rootScope, $controller, ENV, $kWindow, _$document_,
                                _$timeout_, _$q_, _$templateCache_) {
      //httpBackend = _$httpBackend_;
      ctrl = $controller;
      rootScope = $rootScope;
      scope = $rootScope.$new();
      restUrl = ENV.restURL;
      kWindow = $kWindow;
      $document = _$document_;
      $timeout = _$timeout_;
      $q = _$q_;
      $templateCache = _$templateCache_;
    }));

    beforeEach(function () {
      jasmine.addMatchers({
        toBeResolvedWith: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              var result = {};
              var resolved;
              result.message = function () {
                var temp = 'Expected "' + angular.mock.dump(actual) + '" to be resolved with "' + expected + '".';
                return temp;
              };

              actual.then(function (actualResult) {
                resolved = actualResult;
              });

              rootScope.$digest();
              var passed = resolved === expected;
              result.pass = passed;
              return result;
            }
          };
        },

        toHaveModalOpenWithContent: function (util, customEqualityTesters) {
          return {
            compare: function (actual, content, selector) {
              var result = {};
              var contentToCompare, modalDomEls = actual.find('div.k-window-content ');
              result.message = function () {
                var temp1 = '"Expected "' + angular.mock.dump(modalDomEls) + '" to be open with "' + content + '".';
                return temp1;
              };
              contentToCompare = selector ? modalDomEls.find(selector) : modalDomEls;
              var passed = modalDomEls.css('display') === 'block' && contentToCompare.html() === content;

              result.pass = passed;
              return result;
            }
          };
        },

        toHaveModalsOpen: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              var modalDomEls = actual.find('div.k-window-content');
              var result = {};
              result.pass = modalDomEls.length === expected;
              return result;
            }
          };
        },

        toHaveBackdrop: function () {
          var backdropDomEls = this.actual.find('body > div.modal-backdrop');
          this.message = function () {
            return 'Expected "' + angular.mock.dump(backdropDomEls) + '" to be a backdrop element".';
          };

          return backdropDomEls.length === 1;
        }
      });
    });

    it('should resolve returned promise on close', function () {
      var modalInstance = kWindow.open({template: '<div>Content</div>'});
      rootScope.$digest();
      expect($document).toHaveModalOpenWithContent('Content', 'div');
      modalInstance.close('closing in test');
      $timeout.flush();
      expect(modalInstance.result).toBeResolvedWith('closing in test');
    });

    it('should open and dismiss a modal with a minimal set of options', function () {
      var modalInstance;
      modalInstance = kWindow.open({
        template: '<div>Content</div>'
      });
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);
      expect($document).toHaveModalOpenWithContent('Content', 'div');
      //Dismiss popup
      modalInstance.dismiss('closing in test');
      expect($document).toHaveModalsOpen(0);
    });

    it('should not throw an exception on a second dismiss', function () {
      var modalInstance;
      modalInstance = kWindow.open({
        template: '<div>Content</div>'
      });
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);
      expect($document).toHaveModalOpenWithContent('Content', 'div');
      //Dismiss second popup
      modalInstance.dismiss('closing in test');
      expect($document).toHaveModalsOpen(0);
    });

    it('should not throw an error on closing a second popup', function () {
      var modalInstance;
      modalInstance = kWindow.open({
        template: '<div>Content</div>'
      });
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);
      expect($document).toHaveModalOpenWithContent('Content', 'div');
      //Close second popup
      modalInstance.close('closing in test');
      expect($document).toHaveModalsOpen(0);
    });

    it('should open a modal from templateUrl', function () {
      $templateCache.put('content.html', '<div>URL Content</div>');
      var modal = kWindow.open({
        templateUrl: 'content.html'
      });
      rootScope.$digest();
      expect($document).toHaveModalsOpen(1);
      expect($document).toHaveModalOpenWithContent('URL Content', 'div');
      modal.dismiss(modal, 'closing in test');
      expect($document).toHaveModalsOpen(0);
    });
  });
})();
