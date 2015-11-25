(function() {
  'use strict';

  angular.module('elli.encompass.web.pipeline').directive('loanFolder', loanFolder);

  function loanFolder() {
    return ({
      link: link,
      restrict: 'A',
      templateUrl: 'modules/pipeline/views/loan-folder.html'
    });

    // Todo: bind javascript events to scope here...
    function link(scope, element, attributes) {}
  }

}());
