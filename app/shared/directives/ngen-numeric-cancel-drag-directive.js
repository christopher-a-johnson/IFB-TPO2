/**
 * Created by rkumar3 on 9/8/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('ngenNumericCancelDrag', numericCancelDrag);
  function numericCancelDrag(kendo) {
    return {
      restrict: 'A',
      link: function (scope, element) {

        scope.$on('kendoWidgetCreated', function (e, numericBox) {
          if (numericBox instanceof kendo.ui.NumericTextBox) {

            element.siblings('input').attr('ng-cancel-drag', 'ng-cancel-drag');
          }
        });
      }
    };
  }
}());
