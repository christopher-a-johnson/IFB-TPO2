(function () {
  'use strict';

  angular.module('elli.encompass.web.shared').controller('ErrorModalController', ErrorModalController);

  /* @ngInject */
  function ErrorModalController(modalWindowService, customMessage) {
    var vm = this;

    vm.message = customMessage;

    vm.errorModalOkClick = function () {
      modalWindowService.closeErrorModalWindow(true);
    };

    /* Initialization code */
    function initialize() {
    }

    initialize();
  }
}());
