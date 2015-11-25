/**
 * Created by MVora on 9/11/2015.
 */

(function () {

  'use strict';
  describe('Drag Operator directive Test', function () {

    var scope, compile, rootScope, html, element;
    html = '<span class="adf-filter-operator drag-enter" ng-drop="true">' +
    '<span class="adf-filter-item">Filter1</span>' +
    '<span class="adf-filter-item">Filter2</span>' +
    '<span class="adf-filter-item">Filter3</span>' +
    '<ngen-drag-operator></ngen-drag-operator></span>';

    //Load shared module
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function ($compile, $rootScope) {

      rootScope = $rootScope;
      scope = rootScope.$new();
      compile = $compile;
      element = compileDirective(html);
      scope.filters = '[{"FieldId":"143"},{"FieldId":"123"}]';

    }));
    function compileDirective(html) {
      var elem = angular.element(html);
      var compiled = compile(elem);
      compiled(scope);
      angular.element(document).find('body').append(elem);
      scope.$digest();
      return elem;
    }

    it('should highlight the attached expression tags only and other expression tags should not be highlighted when' +
    ' drag the parenthesis over on the operator', function () {
      angular.element('.adf-filter-operator').addClass('drag-enter');
      scope.highlightItemsOperatorHover();
      expect(angular.element('.adf-filter-item:eq(0)').hasClass('adf-filter-item-hover')).toBe(true);
      expect(angular.element('.adf-filter-item:eq(1)').hasClass('adf-filter-item-hover')).toBe(true);
      expect(angular.element('.adf-filter-item:eq(2)').hasClass('adf-filter-item-hover')).toBe(false);
    });
    it('should remove the highlight on the attached expression tags when no drag on the operator', function () {
      angular.element('.adf-filter-operator').removeClass('drag-enter');
      scope.highlightItemsOperatorHover();
      expect(angular.element('.adf-filter-item:eq(0)').hasClass('adf-filter-item-hover')).toBe(false);
      expect(angular.element('.adf-filter-item:eq(1)').hasClass('adf-filter-item-hover')).toBe(false);
    });
  });

})();
