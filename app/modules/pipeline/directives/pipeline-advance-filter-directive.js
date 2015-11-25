(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').directive('advanceFilter', function () {
    return ({
      restrict: 'E',
      scope: {},
      templateUrl: 'modules/pipeline/views/pipeline-advance-filter.html',
      controller: 'pipelineAdvanceFilterController as vm',
      bindToController: true,
      link: function (scope, elem, attrs) {
        scope.$on('toggleFilter', function (event, filterLen) {
          if (filterLen > 0) {
            angular.element(elem).find('.panel-body').slideDown(300);
          }
        });
      }
    });
  });
}());
