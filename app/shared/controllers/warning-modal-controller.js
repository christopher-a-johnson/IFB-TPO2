(function () {
  'use strict';

  angular.module('elli.encompass.web.shared').controller('WarningModalController', WarningModalController);

  /* @ngInject */
  function WarningModalController(modalWindowService, customMessage, PipelineDataStore, popupIcon) {
    var vm = this;

    vm.message = customMessage;
    vm.pipelineDataStore = PipelineDataStore;
    vm.popupIcon = popupIcon;

    vm.warningModalOkClick = function () {
      modalWindowService.closeWarningModalWindow(true);
    };

    /* Initialization code */
    function initialize() {
    }

    initialize();
  }
}());
