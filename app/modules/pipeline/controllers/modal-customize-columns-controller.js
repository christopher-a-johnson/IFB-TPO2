(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('ModalCustomizeColumnsController', ModalCustomizeColumnsController);

  /* @ngInject */
  function ModalCustomizeColumnsController(modalWindowService, CustomizeColumnService, PipelineDataStore, PipelineEventsConst,
                                           _, PipelineConst, $rootScope, $templateCache, $timeout) {
    var vm = this;
    vm.dataStore = PipelineDataStore;
    vm.customizeColumnData = PipelineDataStore.CustomizeColumnData;
    vm.moveDownAccessMode = true;
    vm.moveUpAccessMode = true;
    vm.onFilterDataBind = false;
    vm.selectedColumnsCount = PipelineDataStore.PipelineGridData.data.columns.length;
    vm.onCheckBoxSelect = onCheckBoxSelect;
    vm.selectedUID = null;
    vm.selectedIndex = 0;
    vm.columnStateChanged = false;
    vm.onCustomColumnGridDataBound = function (e) {
      var custColGrid = e.sender;
      resetUpDownButtons(); // reset buttons - pagination
      $timeout(function () {
        if (custColGrid._data.length > 0 && vm.onFilterDataBind) {
          var uid = vm.selectedUID !== null ? vm.selectedUID : custColGrid._data[0].uid;
          custColGrid.select('[data-uid="' + uid + '"]');
          angular.element('tr' + '[data-uid="' + uid + '"]').attr('tabindex', 1);
          angular.element('tr' + '[data-uid="' + uid + '"]').focus();
        }
      }, 0);
    };

    vm.customizeColumnGridOptions = {
      dataSource: {
        data: vm.customizeColumnData.items,
        sort: {field: 'OrderIndex', dir: 'asc'},
        pageSize: 100
      },
      selectable: 'row',
      dataBound: vm.onCustomColumnGridDataBound,
      columns: [
        {
          field: 'Name', id: 'ID',
          template: $templateCache.get('modules/pipeline/views/customize-column-popup-checkbox-column.html'),
          width: '22px'
        },
        {
          field: 'Header', id: 'Columns'
        }
      ],
      change: onColumnSelect,
      height: 295,
      pageable: {
        buttonCount: 5
      }
    };

    vm.onSearchContentKeyDown = function (event) {
      if (typeof vm.columnName === 'undefined' || vm.columnName.length === 0) {
        var checkedColumns = [];
        var uncheckedColumns = [];
        var updatedColumns = [];
        checkedColumns = _.where(vm.customizeColumnsGrid.dataSource._data, {columnSelected: true});
        uncheckedColumns = _.where(vm.customizeColumnsGrid.dataSource._data, {columnSelected: false});
        _.each(_.union(checkedColumns, uncheckedColumns), function (element, index) {
          element.OrderIndex = index;
          updatedColumns.push(element);
        });
        //Get selected row uid and index
        var grid = vm.customizeColumnsGrid;
        var row = grid.select();
        var uid = row.data('uid');
        var rowIdx = angular.element('tr', grid.tbody).index(row);
        //Set uid and index of row
        vm.selectedUID = uid;
        vm.selectedIndex = rowIdx;
        // Copy updated columns to data sore items
        angular.copy(updatedColumns, vm.customizeColumnData.items);
        grid.dataSource.filter([]);
        grid.dataSource.pageSize(100);
      } else if (event.keyCode === 13) {
        // Todo: This throws digest in progress when you hit enter on invalid input
        searchCustomizeColumns();
      }
    };

    vm.searchColumn = searchCustomizeColumns;

    vm.customizeColumnOk = function () {
      if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
        PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: new Date().getTime(), ACTION: 'CUSTOMIZE COL CHANGED'};
      }
      var checkedColumns = [];
      var newCheckedColumns = [];
      checkedColumns.length = 0;
      checkedColumns = _.where(vm.customizeColumnsGrid.dataSource._data, {columnSelected: true});
      //At least one column required in pipeline grid
      if (checkedColumns.length === 0) {
        modalWindowService.popupInformation.open({
          message: PipelineConst.CustColumnMinSelectionMessage,
          title: PipelineConst.PopupTitle
        });
        resetUpDownButtons();
        return;
      }
      checkedColumns = _.sortBy(checkedColumns, 'OrderIndex');
      _.each(checkedColumns, function (element, index) {
        element.OrderIndex = index;
        newCheckedColumns.push(element);
      });
      checkedColumns = newCheckedColumns;
      angular.copy(getSelectedColumns(checkedColumns), PipelineDataStore.PipelineGridData.data.columns);
      PipelineDataStore.PipelineGridData.data.columns[0].hidden = true;
      modalWindowService.modalCustomizeColumns.close(true);
      $rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT);
      if (vm.columnStateChanged) {
        $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      }
      resetUpDownButtons();
    };

    vm.customizeColumnCancel = function () {
      modalWindowService.modalCustomizeColumns.close(false);
      resetUpDownButtons();
    };

    vm.moveUp = function () {
      movingRows(true);
    };

    vm.moveDown = function () {
      movingRows(false);
    };

    function movingRows(up) {
      if (typeof vm.customizeColumnsGrid !== 'undefined') {
        if (up) {
          vm.moveUpAccessMode = true;
        } else {
          vm.moveDownAccessMode = true;
        }
        var grid = vm.customizeColumnsGrid;
        var row = grid.select();
        var uid = row.data('uid');
        var dataItem = grid.dataItem(row);
        if (dataItem) {
          var rowIdx = angular.element('tr', grid.tbody).index(row);
          var OriginalOrderIndex = dataItem.OrderIndex;
          var nextOrPrevIdx = rowIdx + (up ? -1 : 1);
          //do not allow moving bellow first or after last item in the view
          if (rowIdx < 0 || rowIdx === grid.dataSource.view().length) {
            return;
          }
          vm.onFilterDataBind = true;
          //Set uid and row index of selected row
          vm.selectedUID = uid;
          vm.selectedIndex = nextOrPrevIdx;
          dataItem.OrderIndex = grid.dataSource.view()[nextOrPrevIdx].OrderIndex;
          //update the index of the next/prev of the selected item
          grid.dataSource.view()[nextOrPrevIdx].OrderIndex = OriginalOrderIndex;
          //re-paint the widget
          $timeout(function () {
            grid.dataSource.fetch();
            if (up) {
              vm.moveUpAccessMode = false;
            } else {
              vm.moveDownAccessMode = false;
            }
          }, 0);
        }
      }
    }

    /* Initialization code */
    function initialize() {
      CustomizeColumnService.resolvePromise();
    }

    function resetUpDownButtons() {
      //Disable up down arrow button
      vm.moveDownAccessMode = true;
      vm.moveUpAccessMode = true;
    }

    initialize();

    function searchCustomizeColumns() {
      $timeout(function () {
        var columnName = typeof(vm.columnName) === 'undefined' ? '' : vm.columnName;
        var grid = vm.customizeColumnsGrid;
        grid.dataSource.query({
          filter: {field: 'Header', operator: 'contains', value: columnName}
        });
        // Checking dataItems for the empty or no match found
        if (grid.dataItems().length === 0) {
          grid.dataSource.filter([]);
          modalWindowService.popupInformation.open({
            message: 'No matches were found for "' + columnName + '".',
            title: 'No Matches'
          });
        }
        else {
          vm.onFilterDataBind = true;
          // Resetting to initial
          vm.selectedUID = null;
          vm.selectedIndex = 0;
          grid.dataSource.sort([{field: 'OrderIndex', dir: 'asc'}]);
          grid.dataSource.pageSize(100);
        }
      }, 0);
    }

    function onCheckBoxSelect(sender) {
      vm.columnStateChanged = true;
      if (sender.currentTarget.checked) {
        if (vm.selectedColumnsCount >= 50) {
          modalWindowService.popupInformation.open({
            message: PipelineConst.MaximumColumnsMessage,
            title: PipelineConst.MaximumColumns
          });
          sender.currentTarget.checked = false;
          return;
        }
        vm.selectedColumnsCount += 1;
      }
      else {
        vm.selectedColumnsCount -= 1;
      }
    }

    function onColumnSelect() {
      $timeout(function () {
        var grid = vm.customizeColumnsGrid;
        var row = grid.select();
        var uid = row.data('uid');
        if (typeof uid !== 'undefined') {
          toggleUpArrowButton(false);
          toggleDownArrowButton(false);
          var lastIndex = grid.dataSource.view().length - 1;
          var rowIndex = row[0].rowIndex;
          if (rowIndex === 0) {
            //Disable up arrow button
            toggleUpArrowButton(true);
          } else if (rowIndex === lastIndex) {
            //Disable down arrow button
            toggleDownArrowButton(true);
          }
        }
      }, 0);
    }

    function getColumn(item) {
      return {
        'Alignment': null,
        'OrderIndex': item.OrderIndex,
        'PipelineField': {
          'Header': item.Header,
          'Name': item.Name,
          'FieldId': item.FieldId,
          'SortOrderSpecified': false
        },
        'Required': null,
        'SortOrder': 'None',
        'SortPriority': null,
        'Width': '-1'
      };
    }

    function toggleUpArrowButton(flag) {
      $timeout(function () {
        vm.moveUpAccessMode = flag;
      }, 0);
    }

    function toggleDownArrowButton(flag) {
      $timeout(function () {
        vm.moveDownAccessMode = flag;
      }, 0);
    }

    function getSelectedColumns(checkedColumns) {
      var selectedColummnsArr = [];
      _.each(checkedColumns, function (item) {
        var existingSelectedColumn = _.findWhere(PipelineDataStore.PipelineGridData.data.columns, {FieldId: item.FieldId});
        if (typeof existingSelectedColumn !== 'undefined') {
          selectedColummnsArr.push(existingSelectedColumn);
          existingSelectedColumn = null;
        }
        else {
          var checkedColumn = getColumn(item);
          var col = CustomizeColumnService.getUpdatedColumns(checkedColumn);
          selectedColummnsArr.push(col);
        }
      });
      return selectedColummnsArr;
    }
  }
}());
