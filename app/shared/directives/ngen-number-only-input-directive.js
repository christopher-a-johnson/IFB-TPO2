(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('numberOnlyInput', numberOnlyInput);

  function numberOnlyInput() {
    return {
      require: 'ngModel',
      restrict: 'A',
      link: function (scope, element, attr, ctrl) {
        function inputValue(val) {
          if (val) {
            var digits = val.replace(/[^0-9.]/g, '');

            if (digits !== val) {
              ctrl.$setViewValue(digits);
              ctrl.$render();
            }
            return parseFloat(digits);
          }
          return undefined;
        }

        ctrl.$parsers.push(inputValue);
      }
    };
  }
}());
