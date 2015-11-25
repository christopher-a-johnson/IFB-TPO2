(function() {
  'use strict';

  angular.module('elli.encompass.web.pipeline').directive('pipelineGridToolbar', pipelineGridToolbar);

  function pipelineGridToolbar() {
    return ({
      link: link,
      restrict: 'A',
      templateUrl: 'modules/pipeline/views/pipeline-grid-toolbar.html'
    });

    // Todo: bind javascript events to scope here...
    function link(scope, element, attributes) {}
  }

}());
