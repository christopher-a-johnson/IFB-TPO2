(function () {
  'use strict';

  /** ========== USAGE: ==========
   *  Add directive to HTML like so:
   *  <ngen-multi-select data="ngenMsData" label="Select"></ngen-multi-select>
   *
   *  the controller for HTML should define ngenMSData like so:
   *
   *  vm.ngenMsData = [
   *          {"Value": "PrimaryResidence", "DisplayName": "Primary"},
   *          {"Value": "SecondHome", "DisplayName": "Secondary"},
   *          {"Value": "Investor", "DisplayName": "Investment"}
   *      ]
   *
   *      label="Place Holder Text" - This will be displayed by default
   **/
  /** ng-cancel-drag: Added to li element as it is not inheriting this attribute from parent due to ng-repeat creates
   * it dynamically*/

  /* @ngInject */
  angular.module('elli.encompass.web.shared').directive('ngenMultiSelect', function (_, $document) {
    return {
      restrict: 'E',
      scope: {
        label: '=',
        data: '=',
        selected: '='
      },
      /* inline template for now, once we have new build we will separate into component */
      template: '<div  class="multi-select-select" >' +
      '<button ng-click="toggleSelect()"><span id="headerText" class="pull-left ngen-text-ellipses" title = "{{ label }}">' +
      '{{ label }}</span>' +
      '<div class="k-icon k-i-arrow-s arrow" ></div></button>' +
      '<ul class="multi-select-popup" ng-show="isPopupVisible">' +
      '<li ng-cancel-drag  ng-repeat="item in data" >' +
      '<label><input type="checkbox" ng-checked="isChecked(item.Value)" ng-click="setSelectedItem(item.Value,item.DisplayName, $event)"/>' +
      '<span class="ngen-multiselect-text">{{ item.DisplayName }}</span></label></li></div></div>',
      link: function (scope, element) {
        /*Using Watch : To clear the display text variable when filter criteria is changed*/
        scope.$watch('data', function () {
          scope.displayText = [];
        });
        //Using watch: To cleat selected valued and setting display text empty array when operator type is changed.
        scope.$watch('label', function () {
          if (scope.label === 'Select') {
            scope.selected = [];
            scope.displayText = [];
          }
        });

        scope.isPopupVisible = false;
        scope.toggleSelect = function () {
          scope.isPopupVisible = !scope.isPopupVisible;
        };
        /*Binding Event to document except popup of dropdown. Identifying it by event target click*/
        $document.bind('click', function (event) {
          var isClickedElementChildOfPopup = element
              .find(event.target)
              .length > 0;
          if (isClickedElementChildOfPopup) {
            return;
          }
          scope.isPopupVisible = false;
          scope.$apply();
        });
      },
      /* @ngInject */
      controller: function ($scope) {
        $scope.displayText = [];
        /*Called on checked/unchecked values*/
        $scope.setSelectedItem = function (id, value, obj) {
          /*Check for array else convert to array*/
          if (!angular.isArray($scope.selected)) {
            $scope.selected = [];
          }
          /*Setting Model value*/
          if (_.contains($scope.selected, id)) {
            $scope.selected = _.without($scope.selected, id);
          } else {
            $scope.selected.push(id);
          }
          /*Setting Label Value*/
          if (_.contains($scope.displayText, value)) {
            $scope.displayText = _.without($scope.displayText, value);
            $scope.label = $scope.displayText.length > 0 ? $scope.displayText.join(', ') : 'Select';
          }
          else {
            $scope.displayText.push(value);
            $scope.label = $scope.displayText.join(', ');
          }
          var element = angular.element(obj.currentTarget).parent().parent();
          if ($scope.isChecked(id)) {
            element[0].className = 'item-selected';
          }
          else {
            element[0].className = '';
          }
        };
        $scope.isChecked = function (id) {
          return !!_.contains($scope.selected, id);
        };

      }
    };
  });

})();
