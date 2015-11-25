(function () {
  'use strict';

  angular.module('elli.encompass.web.shared').directive('ngenGridNavigation', gridNavigation);

  function gridNavigation(kendo) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        var gridRowCount = 0;
        var theadIndex = 1;
        if (angular.isDefined(attr.ngengridrowmaxcount)) {
          gridRowCount = attr.ngengridrowmaxcount;
        }
        scope.$on('kendoWidgetCreated', function (e, grid) {
          if (grid instanceof kendo.ui.Grid && angular.isDefined(grid.table)) {
            // to Add blank row ,we need to use ngengridrowmaxcount attribute with html element
            if (gridRowCount > 0) {
              var emptyStartIndex = grid.dataItems().length;
              if (emptyStartIndex < gridRowCount) {
                var elm = '<div><table>';
                while (emptyStartIndex < gridRowCount) {
                  if (emptyStartIndex % 2 === 0) {
                    elm += '<tr><td></td><td></td></tr>';
                  }
                  else {
                    elm += '<tr class="k-alt"><td></td><td></td></tr>';
                  }
                  emptyStartIndex++;
                }
                elm = elm + '</table> </div>';

                angular.element(elm).insertAfter(grid.table);
              }
            } // end blank row code
            var keyDownEvent = downEvent;
            var mouseClick = mouseEvent;
            var theadKeyDown = theadKeyClick;
            var lastTr;
            grid.table.on('keydown', keyDownEvent);
            grid.table.on('mousedown', mouseClick);
            element.find('.k-grid-header table').on('keydown', theadKeyDown);

            /*Removing Grid selection form grid to enable date selection.So to avoid multiple selection firing on UP/Down Keys*/
            element.find('.k-grid-header .k-widget').on('focus', function () {
              grid.clearSelection();
            });
            /*Removing Grid selection form grid to enable date selection.So to avoid multiple selection firing on UP/Down Keys*/
            element.find('.k-grid-header .k-textbox').on('focus', function () {
              grid.clearSelection();
            });
            /*Removing PageIndex property applied by Kendo to Kendo GRId to enable TAB naviagtion*/
            element.find('.k-pager-wrap a').removeAttr('tabindex');
          }
          function theadKeyClick(e) {
            e.cancelBubble = true;
            var theadRowLength = grid.thead.find('tr').length;
            var contentSelectedRow = grid.table.find('tr').is('.k-state-selected');
            var keyCode = e.which;
            var keyDownCode = 40;
            if (contentSelectedRow) {
              if (keyCode === keyDownCode && theadIndex <= theadRowLength && !e.shiftKey) {
                theadIndex++;
                angular.element(e.currentTarget).trigger({type: 'keydown', which: 40, keyCode: 40});
              }
              if (keyCode === keyDownCode && theadIndex < theadRowLength && e.shiftKey) {
                theadIndex = theadRowLength + 2;
                angular.element(e.currentTarget).trigger({type: 'keydown', which: 40, keyCode: 40});
              }
              if (keyCode === keyDownCode && (theadIndex > theadRowLength)) {
                var tr = grid.table.find('#aria_active_cell').closest('tr');
                if (theadIndex === theadRowLength + 1) {
                  grid.clearSelection();
                }
                grid.select(tr);
                theadIndex = 1;
              }
            }
          }

          function mouseEvent(e) {
            var mouseRightClickCode = 3, keyCode = e.which, mouseLeftClickCode = 1;
            var td = angular.element(e.currentTarget).find('#aria_active_cell');
            var tr = angular.element(e.currentTarget).find('#aria_active_cell').closest('tr');
            if (keyCode === mouseRightClickCode) {
              if (tr.text() !== '') {
                if (!tr.is('.k-state-selected')) {
                  grid.clearSelection();
                  grid.select(tr);
                }
              }
            }
            else if (keyCode === mouseLeftClickCode) {
              if (tr.text() !== '') {
                if (tr.is('.k-state-selected')) {
                  td.removeClass('k-state-focused');
                }
              }
            }
          }

          function downEvent(e) {
            var keyCode = e.keyCode, shiftKey = e.shiftKey;
            var keyUpCode = 38, keyDownCode = 40, spaceKeyCode = 32, ctrlKey = e.ctrlKey, keyCodeA = 65;
            if (keyCode === keyUpCode || keyCode === keyDownCode) {
              e.stopImmediatePropagation();
              //currentTarget  is used to get current grid.
              var tr = angular.element(e.currentTarget).find('#aria_active_cell').closest('tr');

              if (!shiftKey && tr.text() !== '') {
                grid.clearSelection();
              }

              if (tr[0] !== lastTr && tr.is('.k-state-selected')) {
                var select = grid.select();
                // up
                if (keyCode === keyUpCode && tr.next().is('.k-state-selected')) {
                  select = select.filter(function () {
                    return this !== tr[0].nextSibling;
                  });
                }

                // down
                if (keyCode === keyDownCode && tr.prev().is('.k-state-selected')) {
                  select = select.filter(function () {
                    return this !== tr[0].previousSibling;
                  });
                }
                if (tr.text() !== '') {
                  grid.clearSelection();
                  grid.select(select);
                }

              } else if (tr.text() !== '') {
                grid.select(tr);
              }
              lastTr = tr[0];
            }
            //Space bar key press detection for checking checkbox if it is in row
            else if (keyCode === spaceKeyCode) {
              e.stopImmediatePropagation();
              e.preventDefault();
              //currentTarget  is used to get current grid.
              var currentRow = angular.element(e.currentTarget).find('#aria_active_cell').closest('tr');
              var checkBox = currentRow.find('input[type=checkbox]');
              if (checkBox && checkBox.click) {
                checkBox.trigger('click');
                grid.select();
                if (grid.current()) {
                  grid.current().focus(); //set focus to current selected grid row
                }
              }
            }
            else if (ctrlKey && keyCode === keyCodeA) {
              e.stopImmediatePropagation();
              grid.select(grid.items());
              e.preventDefault();
            }
          }

        });
      }
    };
  }
}());
