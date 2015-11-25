(function() {
  'use strict';

  angular.module('elli.encompass.web.pipeline').directive('pipelineFilters', pipelineFilters);

  function pipelineFilters() {
    return ({
      link: link,
      restrict: 'A',
      templateUrl: 'modules/pipeline/views/pipeline-filters.html'
    });

    // Todo: bind javascript events to scope here...
    function link(scope, element, attributes) {}
  }

}());
