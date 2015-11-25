/**
 * Created by apenmatcha on 2/18/2015.
 */
(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('MoveFolderController', MoveFolderController);

  /* @ngInject */
  function MoveFolderController(PipelineDataStore, modalWindowService, _, PipelineEventsConst, $rootScope) {

    var vm = this;
    vm.moveFolderOkClick = moveFolderOkClick;
    vm.moveFolderCancelClick = moveFolderCancelClick;

    vm.moveFolderDropdownOptions = {
      dataSource: _.without(PipelineDataStore.MoveLoanFolderList.items,
        PipelineDataStore.LoanFolderDropdownData.selectedItem)
    };

    function moveFolderOkClick() {
      modalWindowService.closeMoveToFolderWindow();
      $rootScope.$broadcast(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT, {'folder': vm.moveLoanFolder});
    }

    function moveFolderCancelClick() {
      modalWindowService.closeMoveToFolderWindow();
    }

    /* Initialization code */
    function initialize() {
    }

    initialize();
  }
}());
