/**
 * Created by MVora on 9/10/2015.
 */

(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('ngenDragOperator', ngenDragOperator);

  function ngenDragOperator(_) {
    return {
      restrict: 'AE',
      template: '<div  class="operator-div" ng-drop="true"  ng-drag-move="highlightItemsOperatorHover()" ></div>',

      link: function (scope, ele, attrs) {
        scope.filters = attrs.filterValues;
      },
      /* @ngInject */
      controller: function ($scope) {
        var minMaxIndex = [];
        var operatorSelected, indexOfOperator, filtersItems = null;

        $scope.highlightItemsOperatorHover = function () {
          if (angular.element('.adf-filter-operator').hasClass('drag-enter')) {

            operatorSelected = angular.element('.drag-enter');
            indexOfOperator = angular.element('.adf-filter-operator').index(operatorSelected);

            filtersItems = JSON.parse($scope.filters);
            minMaxIndex = onOperatorHover(indexOfOperator, filtersItems);

            for (var i = 0; i < minMaxIndex.length; i++) {
              angular.element('.adf-filter-item:eq(' + minMaxIndex[i] + ')').addClass('adf-filter-item-hover');
            }
          }
          else {
            angular.element('.adf-filter-item').removeClass('adf-filter-item-hover');
          }
        };

        function onOperatorHover(index, filters) {
          //using the logic of exprCreator function of pipeline-advance-controller.js
          // to find the min and max index to expression to highlight on hover
          var minMaxItemIndex = [];
          _.each(filters, function (val, count) {
            parenInit(filters[index]);
            if ((typeof val.parenEndList === 'undefined') || (typeof val.parenStartList === 'undefined')) {
              parenInit(val);
            }
            if (count >= index && val.parenEndList.indexOf(index) === -1) {
              var indexMin = _.min(filters[index].parenEndList);
              var indexMax = (filters.length <= (index + 1)) ? index : _.max(filters[index + 1].parenStartList);
              if (indexMin === -Infinity || indexMin === Infinity) {
                indexMin = index;
              }
              if (indexMax === -Infinity || indexMax === Infinity) {
                indexMax = index + 1;
              }

              parenInit(filters[indexMax]);
              parenInit(filters[indexMin]);
              if (filters[indexMax].parenEndList.indexOf(indexMin) === -1) {
                minMaxItemIndex.push(indexMin, indexMax);
              }
              else if (filters[index].parenEndList.indexOf(index) === -1) {
                minMaxItemIndex.push(index);
              }
            }

          });

          return minMaxItemIndex;
        }

        function parenInit(filter) {
          if (typeof filter.parenEndList === 'undefined') {
            filter.parenEndList = [];
          }
          if (typeof filter.parenStartList === 'undefined') {
            filter.parenStartList = [];
          }
        }

      }
    };
  }
}());

