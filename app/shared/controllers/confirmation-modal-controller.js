(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').controller('ConfirmationModalController', ConfirmationModalController);
  function ConfirmationModalController(modalWindowService, customMessage, PipelineDataStore, popupIcon,
                                       SetMenuStateService) {
    var vm = this;
    vm.message = customMessage;
    vm.pipelineViewButtons = PipelineDataStore;
    vm.displayApplyToAll = false;
    vm.checklabel = 'Apply to all items';
    vm.applyCheck = false;
    vm.popupIcon = popupIcon;
    if ((PipelineDataStore.moveToFolderApplyCheckDisabled === false) ||
      (PipelineDataStore.deleteLoansApplyCheckDisabled === false)) {
      vm.displayApplyToAll = true;
    }

    vm.modalNoClick = function () {
      PipelineDataStore.applyCheckClicked = vm.applyCheck;
      modalWindowService.closeConfirmationWindow(true);
    };

    vm.modalYesClick = function () {
      if (PipelineDataStore.infoIconDisabled === true) {
        PipelineDataStore.saveButtonDisabled = true;
        PipelineDataStore.resetButtonDisabled = true;
        var menuStates = [{
          MenuItemTag: 'PI_SaveView',
          Enabled: !PipelineDataStore.saveButtonDisabled,
          Visible: true
        }, {
          MenuItemTag: 'PI_ResetView',
          Enabled: !PipelineDataStore.resetButtonDisabled,
          Visible: true
        }];
        SetMenuStateService.setThickClientMenuState(menuStates);
      }
      if (vm.applyCheck) {
        PipelineDataStore.applyCheckClicked = true;
      }
      modalWindowService.closeConfirmationWindow(false);
    };

    vm.applyAllCheckChange = function () {
      if (vm.applyCheck && PipelineDataStore.ConfirmModalApplyAllMessage) {
        vm.message = PipelineDataStore.ConfirmModalApplyAllMessage;
      }
      else {
        vm.message = customMessage;
      }
    };

    /* Initialization code */
    function initialize() {
    }

    initialize();
  }

}());
