(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('ngenEllipsis', Ellipsis);

  function Ellipsis($timeout) {
    return {
      restrict: 'EA',
      link: function (scope, element) {
        $timeout(function () {
          if (element[0] !== undefined && element[0].offsetWidth !== undefined
            && element[0].scrollWidth !== undefined
            && element[0].innerText !== undefined && element[0].innerText !== ''
            && element[0].offsetWidth < element[0].scrollWidth) {
            element[0].title = element[0].innerText;
          }
        }, 0);
      }
    };
  }
}());
