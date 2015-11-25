(function() {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('ngenShow', ngenShow);

  function ngenShow($animate, $window) {
    return {
      scope: {
        'ngenShow': '=',
        'afterShow': '&',
        'afterHide': '&'
      },
      link: function (scope, element, attrs, ctrl) {
        scope.$watch('ngenShow', function (show, oldShow) {
          if (show) {
            $animate.removeClass(element, 'ng-hide').then(scope.afterShow);
          }
          if (!show) {
            $animate.addClass(element, 'ng-hide').then(scope.afterHide);
          }
        });
      }
    };
  }
}());
