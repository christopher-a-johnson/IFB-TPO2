(function() {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('SetMenuStateService', SetMenuStateService);

  function SetMenuStateService(encompass, PipelineConst, applicationLoggingService) {
    function setMenuStatesCallBack(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.SetMenuStates + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    return {
      setThickClientMenuState: function(menuStates) {
        encompass.setMenuState(JSON.stringify({
          MenuState: menuStates
        }), setMenuStatesCallBack);
      }
    };
  }
}());
