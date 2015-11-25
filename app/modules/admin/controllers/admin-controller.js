(function () {
  'use strict';
  angular.module('elli.encompass.web.admin').controller('AdminCtrl', AdminController);

  /* @ngInject */
  function AdminController($state) {
    var vm = this;

    vm.showFormList = showFormList;

    function showFormList() {
      $state.go('admin.formlist');
    }
  }
}());
