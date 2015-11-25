/**
 * Created by KDeshmukh on 7/2/2015.
 */

(function () {
  'use strict';
  describe('Multi select dropdown test', function () {
    var scope, compile, rootScope, html, element, $document;
    html = '<ngen-multi-select data="data" label="headerText"></ngen-multi-select>';
    //Load shared module
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function ($compile, $rootScope, _$document_) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      compile = $compile;
      $document = _$document_;
      scope.enterFunc = function () {
      };
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

    it('should produce dropdown header', function () {
      expect(element.find('button').length).toEqual(1);
    });
    it('should set the header text of dropdown', function () {
      scope.headerText = 'Select Options';
      var directive = '<ngen-multi-select data="data" label="headerText"></ngen-multi-select>';
      var ele = compileDirective(directive);
      expect(ele.find('#headerText').text()).toEqual(scope.headerText);

    });
    it('should set the data for dropdown', function () {
      scope.headerText = 'Select Options';
      scope.data = [{'DisplayName': 'Locked', 'Value': 'Locked'}, {'DisplayName': 'UnLocked', 'Value': 'Unlocked'}];
      var directive = '<ngen-multi-select data="data"  selected="Locked" label="headerText"></ngen-multi-select>';
      var ele = compileDirective(directive);
      expect(ele.find('li').length).toEqual(2);
    });

    it('check if dropdown is opened', function () {
      scope.headerText = 'Select Options';
      scope.data = [{'DisplayName': 'Locked', 'Value': 'Locked'}, {'DisplayName': 'UnLocked', 'Value': 'Unlocked'}];
      var directive = '<ngen-multi-select data="data" selected="Locked" label="headerText"></ngen-multi-select>';
      var ele = compileDirective(directive);
      ele.find('button').click();
      expect(ele.find('.ng-hide').length).toBe(0);
    });
    it('Trigger  check event on all checkboxes', function () {
      scope.headerText = 'Select Options';
      scope.data = [{'DisplayName': 'Locked', 'Value': 'Locked'}, {'DisplayName': 'UnLocked', 'Value': 'Unlocked'}];
      var directive = '<ngen-multi-select data="data" selected="Locked" label="headerText"></ngen-multi-select>';
      var ele = compileDirective(directive);
      ele.find('button').click();
      var li = ele.find('input[type=checkbox]');
      li.eq(0).trigger('click');
      expect(li.length).toBe(2);
    });

  });
})();
