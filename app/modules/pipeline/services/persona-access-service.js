(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PersonaAccessService', PersonaAccessService);
  function PersonaAccessService(Restangular, PipelineDataStore, _, SetMenuStateService) {
    return {
      resolvePromise: function () {
        return Restangular.all('user/getuseraccessrights').post().then(function (response) {
          _.each(Restangular.stripRestangular(response), function (item) {
            PipelineDataStore.PersonaAccess[item.SectionName] =
              item.AccessRights;
          });
          var menuStates = [{
            MenuItemTag: 'PI_Import',
            Enabled: PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Import,
            Visible: PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Import
          }];
          SetMenuStateService.setThickClientMenuState(menuStates);
        });
      }
    };
  }
}());
