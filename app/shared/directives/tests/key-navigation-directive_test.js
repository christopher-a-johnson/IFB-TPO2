/**
 * Created by urandhe on 3/17/2015.
 */
(function () {
  'use strict';
  describe('key navigation directive test', function () {
    var scope, compile, rootScope, html, element, $document;

    html = '<div ngen-key-navigation>' +
      '<div><br><div class=""><div class="col-xs-3"><span class="text-left">View Name</span></div>' +
      '<input type="text" maxlength="260" name="viewName" tabindex="1"></div>' +
      '<br></div><br><div><br><div class="ngen-pull-right">' +
      '<button type="button" id="btn1" class="k-button" ng-click="enterFunc()" ' +
      'is-default-enterkey-action="true" tabindex="2">Ok</button>&nbsp;' +
      '<button type="button" id="btn2" class="k-button" tabindex="3">Cancel</button> </div></div></div>';

    //Load shared module
    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($compile, $rootScope, _$document_) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      compile = $compile;
      $document = _$document_;
      scope.enterFunc = function () {
      };
      spyOn(scope, 'enterFunc');
      element = compileDirective(html);
    }));

    function compileDirective(html) {

      var elem = angular.element(html);

      var compiled = compile(elem);
      compiled(scope);
      angular.element(document).find('body').append(elem);
      scope.$digest();
      return elem;
    }

    it('first active element', inject(function ($timeout) {
      var firstElement = element.find('[name=viewName]');
      $timeout(function () {
        expect(firstElement).toBe(document.activeElement);
      }, 0);
    }));

    it('on tab second should get active element', inject(function ($timeout) {
        element.trigger({type: 'keydown', which: 9, keyCode: 9});
        var btn = element.find('#btn1');
        $timeout(function () {
          expect(btn).toBe(document.activeElement);
        }, 0);
      })
    );

    it('on tab third should get active element', inject(function ($timeout) {
      element.trigger({type: 'keydown', which: 9, keyCode: 9});
      var btn = element.find('#btn2');
      $timeout(function () {
        expect(btn).toBe(document.activeElement);
      }, 0);
    }));

    it('on tab first should get active element', inject(function ($timeout) {
      element.trigger({type: 'keydown', which: 9, keyCode: 9});
      var elem = element.find('[name=viewName]');
      $timeout(function () {
        expect(elem).toBe(document.activeElement);
      }, 0);
    }));

    //Test enter key
    it('Enter Key should call a method', function () {
      element.trigger({type: 'keydown', which: 13, keyCode: 13});
      //Assertion
      expect(scope.enterFunc).toHaveBeenCalled();
    });

    it('should dismiss information modal pop up', inject(function (modalWindowService) {
      var modalInstance, modalObj;
      modalInstance = modalWindowService.popupInformation.open({title: 'Hi', message: 'Test'});
      rootScope.$digest();
      modalObj = $document.find('div.k-window-content');
      expect(modalObj.length).toBe(1);
      var elem = $document.find('div.k-window-content div:first');
      elem.trigger({type: 'keydown', which: 27, keyCode: 27});
      modalObj = $document.find('div.k-window-content');
      expect(modalObj.length).toBe(0);
    }));
  });

})();
