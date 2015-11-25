(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('ngenResize', autoResize);

  function autoResize($window, _, PipelineEventsConst) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        var w = angular.element($window);
        var targetContainer = angular.element('#' + attr.ngenResize);

        scope.$on(PipelineEventsConst.PIPELINE_WINDOW_RESIZE_EVENT, function (e) {
          resizeContainer();

          function getOffsetHeight() {
            var deduct = 0;
            var deductOtherElements = targetContainer.parent().children().not(targetContainer);
            /* Calculates total height of all the sibling elements of target container element except it self */
            _.each(deductOtherElements, function (item) {
              var deductElement = angular.element(item);
              if (deductElement.css('position') !== 'fixed' && deductElement.css('display') !== 'none') {
                deduct += deductElement.outerHeight();
              }
            });
            var topPadding = targetContainer.parent().outerHeight() - targetContainer.parent().height();
            return deduct + topPadding;
          }

          function resizeContainer() {
            scope.style = function () {
              return {
                'height': (w.innerHeight() - getOffsetHeight() - attr.gridOffsetHeight) + 'px'
              };
            };
            element.height(w.innerHeight() - getOffsetHeight());
            var dataArea = element.find('.k-grid-content');
            if (dataArea) {
              var otherElements = element.children().not('.k-grid-content'),
                otherElementsHeight = 0;
              _.each(otherElements, function (item) {
                otherElementsHeight += angular.element(item).outerHeight();
              });
              dataArea.height(element.innerHeight() - otherElementsHeight - attr.gridOffsetHeight); //hard-coded extra offset height for the thick client
            }
          }
        });

        w.bind('resize', function () {
          scope.$emit(PipelineEventsConst.PIPELINE_WINDOW_RESIZE_EVENT);
        });
      }
    };
  }
}());
