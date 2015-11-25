(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').controller('TPOCompaniesController', TPOCompaniesController);
  function TPOCompaniesController(modalWindowService, PipelineDataStore, TPOCompaniesService, $timeout,
                                  $rootScope, PipelineEventsConst) {
    var vm = this;
    vm.selected = [];
    vm.tpoCompaniesData = PipelineDataStore.TPOCompaniesData;
    vm.tpoCompaniesGridOptions = {
      dataSource: {
        data: vm.tpoCompaniesData.items,
        sort: {
          field: 'nameField',
          dir: 'asc'
        }
      },
      columns: [{field: 'nameField', title: 'Company Name'}],
      sortable: true,
      height: 200,
      selectable: 'row',
      dataBound: clearSelection
    };

    function gridSelectionChange(data) {
      vm.tpoCompaniesData.selected = [];
      vm.tpoCompaniesData.selected.push(data);
    }

    function clearSelection() {
      $timeout(function () {
        vm.tpoCompaniesData.selected = [];
      }, 0);
    }

    vm.gridSelectionChange = gridSelectionChange;
    vm.clearSelection = clearSelection;

    vm.tpoCompaniesOk = function () {
      PipelineDataStore.externalOrg = {
        id: vm.tpoCompaniesData.selected[0].externalIdField,
        name: vm.tpoCompaniesData.selected[0].nameField
      };
      modalWindowService.closeTPOCompaniesPopup();
      $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
    };

    vm.tpoCompaniesCancel = function () {
      modalWindowService.closeTPOCompaniesPopup();
    };

    function initialize() {
      TPOCompaniesService.resolvePromise();
    }

    initialize();
  }
}());
