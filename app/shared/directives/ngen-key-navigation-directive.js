(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('ngenKeyNavigation', KeyNavigation);

  function KeyNavigation(_, $timeout) {
    return {
      restrict: 'EA',
      link: function (scope, element) {
        // Get all tab index
        var tabIndexElementArr = element.find('[tabindex]');
        var tabIndexArr = [];
        var maxTabIndex = 0;
        var minTabIndex = 0;

        _.each(tabIndexElementArr, function (item) {
          tabIndexArr.push(item.tabIndex);
        });
        // Get max and Min teb index
        var tabIndexSortedArr = tabIndexArr.sort();
        maxTabIndex = tabIndexSortedArr[tabIndexSortedArr.length - 1];
        minTabIndex = tabIndexSortedArr[0];
        // Focus where tabindex = 1
        var autoFocusElements = element.find('[tabindex=1]');
        $timeout(function () {
          if (autoFocusElements !== undefined && autoFocusElements.length > 0) {
            autoFocusElements[0].focus();
          }
        }, 0);

        // Handle keydown event for Enter and ESC
        element.on('keydown', function (e) {
          // Enter KEY
          if (e.keyCode === 13) {
            var defaultElements = element.find('[is-default-enterkey-action]');
            if (defaultElements.length !== 0) {
              if (defaultElements[0].attributes['is-default-enterkey-action'].value === 'true') {
                defaultElements[0].click();
              }
            }
          }
          // ESC KEY
          else if (e.keyCode === 27) {
            var escapeElements = element.find('[close-on-escapekey-action]');
            if (escapeElements.context.attributes['close-on-escapekey-action'] !== undefined) {
              if (escapeElements.context.attributes['close-on-escapekey-action'].value === 'true') {
                angular.element(element[0].parentNode).data('kendoWindow').close();
              }
            }
          }
          // In this if condition handle the code for both TAB KEY && (SHIFT + TAB) KEY
          else if (e.keyCode === 9) {
            var currTabIndex = e.target.tabIndex;
            if (e.target.parentNode.className === 'k-grid-content') {
              currTabIndex = e.target.parentNode.parentNode.tabIndex;
            }

            if (e.shiftKey && currTabIndex === minTabIndex) {
              var lastElement = element.find(' [ tabindex = ' + maxTabIndex + ' ] ');
              lastElement.focus();
            } else if (!e.shiftKey && currTabIndex === maxTabIndex) {
              var firstElement = element.find(' [ tabindex = ' + minTabIndex + ' ] ');
              firstElement.focus();
            }
            else {
              var nextTabIndexArr = e.shiftKey ? tabIndexArr.indexOf(currTabIndex) - 1 :
              tabIndexArr.indexOf(currTabIndex) + 1;

              var nextElement = null;
              if (e.shiftKey) { // for shift + tab
                for (var i = nextTabIndexArr; i > minTabIndex; nextTabIndexArr++) {
                  nextElement = element.find(' [ tabindex = ' + tabIndexArr[nextTabIndexArr] + ' ] ');
                  if (nextElement[0].className !== undefined &&
                    nextElement[0].className.indexOf('k-state-disabled') === -1) {
                    break;
                  }
                }
              } else { // for tab
                for (var j = nextTabIndexArr; j < tabIndexArr.length; nextTabIndexArr++) {
                  nextElement = element.find(' [ tabindex = ' + tabIndexArr[nextTabIndexArr] + ' ] ');
                  if (nextElement[0].className !== undefined &&
                    nextElement[0].className.indexOf('k-state-disabled') === -1) {
                    break;
                  }
                }
              }
              if (nextElement === null) {
                return;
              }
              if (nextElement[0].attributes['kendo-grid'] !== undefined) {
                var grid = nextElement.data('kendoGrid');
                //optional: focus the grid table
                var row = grid.select();
                if (row.length === 0) {
                  var firstRow = grid.tbody.find('tr:first');
                  grid.select(firstRow);
                }
                grid.table.focus();
              }
              else {
                nextElement.focus();
              }
            }
            e.preventDefault();
          }
        });
      }// link End
    };
  }
}());
