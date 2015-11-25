/**
 * Created by KDeshmukh on 7/31/2015.
 */
(function () {
  'use strict';
  describe('Click on OR outside parenthesis', function () {
    var scope, compile, rootScope, html, element, $document;
    html = '<span id="spnTarget" ngen-click-outside-paren>(</span>';
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

    it('perform click on ( icon', function () {
      scope.filter = {parenColor: {selected: '1'}};
      var directive = '<div id="document"><span id="spnTarget" class="dwi-icon-parenthesis-left" ngen-click-outside-paren>(</span></div>';
      var ele = compileDirective(directive);
      var li = ele.find('spnTarget');
      li.click();
      expect(ele.find('.dwi-icon-parenthesis-left').length).toBe(1);
    });
    it('perform click on ) icon', function () {
      scope.filter = {parenColor: {selected: '1'}};
      var directive = '<div id="document"><span id="spnTarget" class="dwi-icon-parentheses-right" ngen-click-outside-paren>)</span>' +
        '</div>';
      var ele = compileDirective(directive);
      var li = ele.find('spnTarget');
      li.click();
      expect(ele.find('.dwi-icon-parentheses-right').length).toBe(1);
    });

    it('perform click on document or outside parentheses', function () {
      scope.filter = {parenColor: {selected: 'undefined'}};
      var directive = '<div id="document"><span id="spnTarget" class="adf-double-parentheses-normal" ngen-click-outside-paren>)</span>' +
        '</div>';
      var ele = compileDirective(directive);
      var li = ele.find('document');
      li.click();
      expect(ele.find('.adf-double-parentheses-normal').length).toBe(1);
    });

  });
})();
