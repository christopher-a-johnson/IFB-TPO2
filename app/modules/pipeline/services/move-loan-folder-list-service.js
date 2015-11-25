/**
 * Created by apenmatcha on 5/6/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('MoveLoanFolderList', MoveLoanFolderList);

  /* @ngInject */
  function MoveLoanFolderList(Restangular, _, PipelineDataStore, $rootScope, PipelineEventsConst) {
    return {
      resolvePromise: function () {
        return Restangular.all('pipeline/loan/getfoldersformoveloans').customGET().then(function (response) {
          //TODO: Check why no error codes are returned from WPS
          if (response) {
            PipelineDataStore.MoveLoanFolderList.items =
              angular.copy(response.GetFoldersListForPipelineMoveLoansResponse1.foldersListField);
            PipelineDataStore.MoveLoanFolderList.selectedItem = 1;

            PipelineDataStore.MoveLoanFromFolderList.items = angular.copy(response.FromFolders);

            $rootScope.$broadcast(PipelineEventsConst.MOVE_FOLDER_LIST_LOADED_EVENT);
          }
        });
      }
    };
  }
}());
