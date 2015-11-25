(function() {
  'use strict';

  angular.module('elli.encompass.web.pipeline').directive('pipelineGrid', pipelineGrid);

  function pipelineGrid() {
    return ({
      link: link,
      restrict: 'A',
      templateUrl: 'modules/pipeline/views/pipeline-grid.html'
    });

    // Todo: bind javascript events to scope here...
    function link(scope, element, attributes) {}
  }

}());
