/**
 * Created by URandhe on 8/5/2015.
 */
(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').directive('formbuilderGridHighlight', gridHighlight);

  /* @ngInject*/
  function gridHighlight(kendoGridHelper, $timeout) {
    return ({
      link: link,
      restrict: 'A',
      scope: {
        minFilterLength: '=minFilterLength',
        excludeCols: '=excludeCols',
        filterText: '=filterText'
      }
    });

    function link(scope, element, attrs, ctrl) {
      var gridElem = scope.$parent.$eval(attrs.kOptions);
      gridElem.dataBound = function (e) {
        kendoGridHelper.modifyPagerLayout();
        $timeout(function () {
          if (scope.filterText) {
            var userTxt = scope.filterText;
            var listItems = e.sender.element.find('.k-grid-content [ng-bind]');
            if (listItems.length > 0 && userTxt.length > ((scope.minFilterLength || 1) - 1)) {
              $(listItems).each(function (i, e) {
                if (scope.excludeCols.indexOf($(e).attr('ng-bind').replace('dataItem.', '')) < 0) {
                  var liTxt = $(e).text();
                  var highlightedTxt = '<span class = "filter-highlight">$&</span>';
                  listItems[i].innerHTML = liTxt.replace(new RegExp(userTxt, 'gi'), highlightedTxt);
                }
              });
            }
          }
        }, 0);
      };
    }
  }

}());
