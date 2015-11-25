(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').factory('LoanDuplicationTemplate', LoanDuplicationTemplate);
  /* @ngInject */
  function LoanDuplicationTemplate(Restangular, PipelineDataStore, _) {
    return {
      resolvePromise: function () {
        return Restangular.all('pipeline/loan/duplicatetemplate').withHttpConfig({cache: true}).getList().then(function (response) {
          var templates = Restangular.stripRestangular(response);
          if (templates.length > 0 && templates[0].trim() !== '') {
            templates = _.flatten([' ', templates]);
          }
          angular.copy(templates, PipelineDataStore.LoanDuplicationTemplates.items);
        });
      }
    };
  }
})();
