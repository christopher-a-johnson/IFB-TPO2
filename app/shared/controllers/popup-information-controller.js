(function () {
  'use strict';

  angular.module('elli.encompass.web.shared').controller('PopupInformationController', PopupInformationController);

  /* @ngInject */
  function PopupInformationController(modalWindowService, options) {
    var vm = this;

    vm.message = options.message;
    vm.icon = options.icon;

    vm.infoModalOkClick = function () {
      modalWindowService.popupInformation.close(true);
    };
    /* Initialization code */
    function initialize() {
    }

    initialize();
  }
}());
