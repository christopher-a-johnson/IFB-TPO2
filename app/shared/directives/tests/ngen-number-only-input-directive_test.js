/**
 * Created by dpatel on 7/1/2015.
 */
(function () {
  'use strict';
  describe('Number Only Input Directive', function () {
      var scope, compile, rootScope, ctrl, form;
      beforeEach(module('elli.encompass.web'));

      beforeEach(inject(function ($compile, $rootScope, _$document_, $controller) {
        rootScope = $rootScope;
        scope = rootScope.$new();
        compile = $compile;
        ctrl = $controller;
        var element = angular.element(
          '<form name="form">' +
          '<input ng-model="filter.valueFrom" number-only-input type="text" name="inputCtrl" />' +
          '</form>'
        );
        scope.filter = {valueForm: null};
        $compile(element)(scope);
        scope.$digest();
        form = scope.form;
      }));

      it('Should validate input value of text box for numeric.', function () {
        // To check with valid number
        form.inputCtrl.$setViewValue('123');
        expect(scope.filter.valueFrom).toEqual(123);
        expect(form.inputCtrl.$valid).toBe(true);
      });

      it('Should validate input value of text box for non numeric.', function () {
        // To check with invalid input
        form.inputCtrl.$setViewValue('123asn');
        expect(scope.filter.valueFrom).toEqual(123);
        expect(form.inputCtrl.$valid).toBe(true);
      });
    }
  );
})();
