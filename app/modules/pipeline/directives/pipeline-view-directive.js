(function() {
  'use strict';

  angular.module('elli.encompass.web.pipeline').directive('pipelineView', pipelineView);

  function pipelineView() {
    return ({
      link: link,
      restrict: 'A',
      templateUrl: 'modules/pipeline/views/pipeline-view.html'
    });

    // Todo: bind javascript events to scope here...
    function link(scope, element, attributes) {}
  }

}());
