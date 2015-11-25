/**
 * Created by KDeshmukh on 7/24/2015.
 */
/*
 * Directive clears the selected parentheses when clicked outside
 * */
(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('ngenClickOutsideParen', ClickOutside);

  function ClickOutside($document, $timeout) {
    return {
      restrict: 'A',
      link: function (scope, element) {

        $document.bind('click', function (event) {
          //If selected element
          var isClickedElement = element
              .find(event.target)
              .length > 0;
          if (isClickedElement) {
            return;
          }
          else {
            if (event.target.innerHTML !== '(' && event.target.innerHTML !== ')' && scope.filter.parenColor) {
              if (scope.filter.parenColor.hasOwnProperty('selected')) {
                $timeout(function () {
                  scope.filter.parenColor.selected = undefined;
                }, 0);
              }
            }
          }
        });
      }
    };
  }
}());
