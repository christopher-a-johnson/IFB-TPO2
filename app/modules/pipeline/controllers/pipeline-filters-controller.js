(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').controller('PipelineFiltersController', PipelineFiltersController);

  /* @ngInject */
  function PipelineFiltersController(applicationLoggingService, encompass, PipelineDataStore,
                                     PipelineConst, PipelineEventsConst, $rootScope, $timeout) {
    var vm = this;
    vm.dataStore = PipelineDataStore;

    function setNotifyUserCallback(resp) {
      var param = JSON.parse(resp);
      if ((typeof param.ErrorCode !== 'undefined') && param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.NotifyUserCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    vm.notifyUser = function () {
      if (PipelineDataStore.notifyButtonEnabled) {
        $timeout(function () {
          encompass.notifyUsers('', setNotifyUserCallback);
        }, 0, false);
      }
    };

    vm.advanceFilter = function () {
      // we might not need the variable at all
      PipelineDataStore.AdvanceFilterShow = !PipelineDataStore.AdvanceFilterShow;
      $rootScope.$broadcast(PipelineEventsConst.OPEN_ADVANCED_FILTER, PipelineDataStore.AdvanceFilterShow);
    };

    vm.clearAllFilters = function () {
      if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
        PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: new Date().getTime(), ACTION: 'CLEAR'};
      }
      PipelineDataStore.PipelineGridData.filters.length = 0;
      PipelineDataStore.AdvanceFilterShow = false;
      $rootScope.$broadcast(PipelineEventsConst.CLEAR_ALL_GRID_FILTER_EVENT);
    };
  }
}());
