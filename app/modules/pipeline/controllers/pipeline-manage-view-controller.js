(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline')
    .controller('PipelineManageViewController', PipelineManageViewController);

  function PipelineManageViewController(applicationLoggingService, DeletePipelineView, modalWindowService,
                                        PipelineConst, PipelineEventsConst, PipelineViewListData, PipelineDataStore,
                                        SetDefaultViewData, _, PipelineGetLoans, $timeout, $rootScope) {
    var vm = this;
    var windowInstance;
    vm.isDuplicateDisabled = true;
    vm.isDeleteDisabled = true;
    vm.isRenameDisabled = true;
    vm.isSetAsdefaultDisabled = true;
    vm.gridSelectionChange = gridSelectionChange;
    vm.pipelineViewListData = PipelineDataStore.PipelineViewListDataStore;
    vm.pipelineViewButtons = PipelineDataStore;
    vm.duplicateViewClick = duplicateViewClick;
    vm.onKeynavigation = onKeynavigation;
    vm.setDefault = function () {
      if (PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid !== null) {
        var selectedItem = PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0];
        var payload = {'ViewName': selectedItem.ViewName, 'PersonaName': selectedItem.PersonaName};
        SetDefaultViewData.resolvePromise(payload);
      }
    };
    vm.closePopUp = function () {
      modalWindowService.closeManageView(false);
      PipelineGetLoans.setAutoRefresh();
    };
    function onManageViewDataBinding(e) {
      /*To Add empty rows*/
      disableAllButtons();
      var grid = e.sender;
      if (PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid !== null) {
        $timeout(function () {
          grid.select('tr:contains("' +
            PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0].ViewName + '")');
        }, 0);
      }
    }

    vm.renameClick = function () {
      if (PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid !== null) {
        var selectedItem = PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0];
        modalWindowService.showRenameViewPopup(selectedItem.ViewName, PipelineConst.RenameView);
      }
    };

    vm.mangeViewGridOptions = {
      dataSource: {
        data: vm.pipelineViewListData.items,
        sort: {
          field: 'Name',
          dir: 'asc'
        }
      },
      selectable: 'row, multiple',
      columns: [
        {
          field: 'Name',
          title: 'Name'
        },
        {
          field: 'Default',
          title: 'Default'
        }
      ],
      sortable: {
        mode: 'single',
        allowUnsort: false
      },
      dataBinding: onManageViewDataBinding,
      height: 298
    };
    /* Initialization code */
    function initialize() {
      PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = null;
      PipelineViewListData.resolvePromise();
    }

    function isEmptyRowSelected() {
      var result = false;
      _.each(PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid, function (item) {
        if (!result && item && item.ViewName === '') {
          result = true;
        }
      });
      return result;
    }

    function gridSelectionChange(data) {
      PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = data;
      if (PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid.length > 0) {
        if (isEmptyRowSelected()) {
          /*For empty row selection*/
          var grid = vm.ManageViewGrid;
          grid.clearSelection();
          disableAllButtons();
          return;
        }
        if (PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid.length === 1) {
          toggleSetAsDefaultButton();
          toggleRenameButton();
          toggleDuplicateButton();
        }
        else {
          vm.isRenameDisabled = true;
          vm.isSetAsdefaultDisabled = true;
          vm.isDuplicateDisabled = true;
        }
        toggleDeleteButton();

      }
      else {
        disableAllButtons();
      }
    }

    initialize();
    function isDefault() {
      return PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0].IsDefault;
    }

    function isSystemType() {
      return PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0].Type === PipelineConst.System;
    }

    function disableAllButtons() {
      vm.isDuplicateDisabled = true;
      vm.isDeleteDisabled = true;
      vm.isRenameDisabled = true;
      vm.isSetAsdefaultDisabled = true;
    }

    function toggleSetAsDefaultButton() {
      vm.isSetAsdefaultDisabled = isDefault();
    }

    function toggleDeleteButton() {
      var item;
      for (var cnt = 0; cnt < PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid.length; cnt++) {
        item = PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[cnt];
        if (item.Type === PipelineConst.System || item.IsDefault) {
          vm.isDeleteDisabled = true;
          break;
        }
        else {
          vm.isDeleteDisabled = false;
        }
      }
    }

    function toggleDuplicateButton() {
      vm.isDuplicateDisabled = false;
    }

    function toggleRenameButton() {
      vm.isRenameDisabled = isSystemType();
    }

    /**
     * @ngdoc method
     * @name reloadView
     * @methodOf elli.encompass.web.pipeline
     * @description
     * If the current view is deleted, select the default view or the first item in view list and reload the view
     */
    function reloadView() {
      var deletedView = PipelineDataStore.PipelineViewListDataStore.items.filter(function (e) {
        return e.ViewName === PipelineDataStore.PipelineViewListDataStore.selectedItem.ViewName;
      });

      //check if the current loaded view is deleted
      if (deletedView.length <= 0) {
        PipelineDataStore.PipelineViewListDataStore.selectedItem =
          (_.findWhere(PipelineDataStore.PipelineViewListDataStore.items, {IsDefault: true}) ||
          PipelineDataStore.PipelineViewListDataStore.items[0]);
        $rootScope.$broadcast(PipelineEventsConst.LOAD_VIEW_EVENT);
      }
    }

    vm.openDeleteDialog = function () {
      try {
        windowInstance = modalWindowService.showConfirmationPopup(PipelineConst.ConfirmationMessage,
          PipelineConst.PopupTitle, PipelineConst.WarningIcon);
        windowInstance.result.then(function (result) {
          if (!result) {
            var selectedItem = PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0];
            var selectedViews = {};
            selectedViews.Name = selectedItem.ViewName;
            DeletePipelineView.resolvePromise(selectedViews).then(function () {
              PipelineViewListData.resolvePromise().then(function () {
                reloadView();
              });
            });
          }
        });
      } catch (ex) {
        applicationLoggingService.error(PipelineConst.DeleteButtonError + ex.message);
      }
    };
    function duplicateViewClick() {
      if (PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid !== null) {
        var selectedItem = PipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0];
        modalWindowService.showDuplicateViewPopup(selectedItem.ViewName, 'Duplicate View');
      }
    }

    function onKeynavigation($event) {
      var kGrid;
      kGrid = vm.ManageViewGrid;
      if ($event.which === 27) {
        vm.closePopUp();
      }
    }
  }
})();
