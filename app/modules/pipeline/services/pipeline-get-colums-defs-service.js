(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PipelineGetColumnDef', PipelineGetColumnDef);

  /* @ngInject */
  function PipelineGetColumnDef(Restangular, $q, localStorageService, PipelineDataStore, _) {
    return {
      resolvePromise: function () {
        var deferred = $q.defer();
        var localData = localStorageService.get('PipelineGetColumnDef');
        var localMilestoneProperties = localStorageService.get('PipelineGetMilestoneProperties');
        if (!angular.equals({}, localData) && localMilestoneProperties) {
          PipelineDataStore.MilestoneProperties = localMilestoneProperties;
          deferred.resolve(localData);
          transformFieldDefinition();
          return deferred.promise;
        } else {
          //console.log('Looking up data');
          return Restangular.one('pipeline/view/fielddefinitions').get().then(function (response) {
            localStorageService.set('PipelineGetColumnDef', Restangular.stripRestangular(response.FieldDefs));
            localStorageService.set('PipelineGetMilestoneProperties', Restangular.stripRestangular(response.MilestoneProperties));
            PipelineDataStore.MilestoneProperties = Restangular.stripRestangular(response.MilestoneProperties);
            transformFieldDefinition();
          });
        }
      }
    };
    function transformFieldDefinition() {
      // 1.	It will not load the data every time as data store variable is validated before transformation
      // 2.	Reason why we did not implemented on pipeline page load (pipeline module’s resolve method),
      // because it will increase page load time and again it is not sure that user will access Advance search all the time.
      if (PipelineDataStore.FieldDefinition.items.length === 0) {
        var fieldDefs = [];
        var colDefs = localStorageService.get('PipelineGetColumnDef');
        _.each(colDefs, function (colDef) {
          if (typeof colDef !== 'undefined' && colDef !== null) {
            fieldDefs.push(colDef);
          }
        });
        angular.copy(fieldDefs, PipelineDataStore.FieldDefinition.items);
      }
    }
  }
})();
