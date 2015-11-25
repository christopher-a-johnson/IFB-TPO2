(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('AddFieldController', AddFieldController);

  /* @ngInject */
  function AddFieldController(modalWindowService, PipelineDataStore, $timeout, $rootScope, PipelineEventsConst,
                              PipelineConst) {
    var vm = this;
    vm.dataStore = PipelineDataStore;
    vm.fieldDefinition = PipelineDataStore.FieldDefinition;
    vm.onFilterDataBind = false;
    vm.selectedColumnsCount = PipelineDataStore.PipelineGridData.data.columns.length;
    vm.selectedUID = null;
    vm.selectedIndex = 0;
    vm.fieldsLoaded = false;
    vm.dataStore.FieldDefinition.selectedItem = {};
    function onAddFieldGridDataBound(e) {
      var addFieldGrid = e.sender;
      $timeout(function () {
        if (addFieldGrid._data.length > 0 && vm.onFilterDataBind) {
          // On filter select first other wise to keep item selected.
          var uid = vm.selectedUID !== null ? vm.selectedUID : addFieldGrid._data[0].uid;
          addFieldGrid.select('[data-uid="' + uid + '"]');
          angular.element('tr' + '[data-uid="' + uid + '"]').attr('tabindex', 1);
          angular.element('tr' + '[data-uid="' + uid + '"]').focus();
        }
      }, 0);
    }

    vm.addFieldGridOptions = {
      dataSource: {
        //setting to move the rows up and down.Needs to enable sorting by OrderIndex
        data: vm.fieldDefinition.items,
        sort: {field: 'Category', dir: 'asc'},
        pageSize: 100
      },
      selectable: 'row',
      dataBound: onAddFieldGridDataBound,
      columns: [
        {
          field: 'Category', title: 'Category'
        },
        {
          field: 'Header', title: 'Description'
        },
        {
          field: 'FieldId', title: 'Field ID'
        },
        {
          field: 'BorrowerPair', title: 'Borrower Pair', values: [{text: '', value: 1}, {text: '', value: -1}]
        }
      ],
      change: onColumnSelect,
      rowTemplate: '<tr data-uid=\'#= uid #\'><td title=#: Category # >#: Category #</td><td title=\'#: Header #\'>#: Header #</td>' +
      '<td title=\'#: FieldId #\' >#: FieldId #</td><td title=\'#: BorrowerPair #\'>#: BorrowerPair #</td></tr>',
      sortable: {
        allowUnsort: false
      },
      resizable: true,
      pageable: {
        buttonCount: 5
      },
      height: 445
    };

    vm.onSearchContentKeyDown = function (event) {
      var enterKey = 13;
      if (typeof vm.fieldName === 'undefined' || vm.fieldName.length === 0) {
        var grid = vm.addFieldGrid;
        grid.dataSource.filter([]);
      }
      else if (event.keyCode === enterKey) {
        // Todo: This throws digest in progress when you hit enter on invalid input
        searchField();
      }
    };

    // On find button search Field
    vm.searchField = searchField;

    vm.addFieldOk = function () {
      var grid = vm.addFieldGrid;
      var row = grid.select();
      var uid = row.data('uid');
      var rowIdx = angular.element('tr', grid.tbody).index(row);
      var dataItem = grid.dataItem(row);
      vm.selectedUID = uid;
      vm.selectedIndex = rowIdx;
      angular.copy(dataItem, PipelineDataStore.FieldDefinition.selectedItem);
      $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      modalWindowService.closeAddFieldPopup(true);
    };

    vm.addFieldCancel = function () {
      modalWindowService.closeAddFieldPopup(false);
    };

    /* Initialization code */
    function initialize() {
      vm.fieldsLoaded = false;
      vm.fieldsLoaded = true;
    }

    initialize();

    function searchField() {
      var fieldName = typeof(vm.fieldName) === 'undefined' ? '' : vm.fieldName;
      var grid = vm.addFieldGrid;
      $timeout(function () {
        grid.dataSource.query({
          filter: {
            logic: 'or',
            filters: [
              {field: 'FieldId', operator: 'contains', value: fieldName},
              {field: 'FieldDescription', operator: 'contains', value: fieldName},
              {field: 'Header', operator: 'contains', value: fieldName}]
          }
        });
        // Checking dataItems for the empty or no match found
        if (grid.dataItems().length === 0) {
          grid.dataSource.filter([]);
          modalWindowService.popupInformation.open({
            message: PipelineConst.UnavailableFieldIDMessage,
            title: 'Field Error'
          });
        }
        else {
          vm.onFilterDataBind = true;
          // Resetting to initial
          vm.selectedUID = null;
          vm.selectedIndex = 0;
          grid.dataSource.pageSize(100);
        }
      }, 0);
    }

    function onColumnSelect() {
      $timeout(function () {
        var grid = vm.addFieldGrid;
        var row = grid.select();
        var uid = row.data('uid');
        var rowIdx = angular.element('tr', grid.tbody).index(row);
        vm.selectedUID = uid;
        vm.selectedIndex = rowIdx;
      }, 0);
    }
  }
}());
