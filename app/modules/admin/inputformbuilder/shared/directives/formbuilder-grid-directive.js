(function() {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').directive('formbuilderGrid', formbuilderGrid);

  function formbuilderGrid() {
    return ({
      link: link,
      restrict: 'A',
      scope: {},
      controllerAs:'fbGridCtrl',
      controller: 'FormBuilderGridCtrl',
      templateUrl: 'modules/admin/inputformbuilder/shared/views/formbuilder-grid.html'
    });

    // Todo: bind javascript events to scope here...
    function link(scope, element, attributes) {}
  }

}());
