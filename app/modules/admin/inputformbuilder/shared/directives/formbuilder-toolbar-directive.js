(function() {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').directive('formbuilderToolbar', formbuilderToolbar);

  function formbuilderToolbar() {
    return ({
      link: link,
      restrict: 'A',
      scope: {},
      controllerAs:'fbToolbarCtrl',
      controller: 'FormBuilderToolbarCtrl',
      templateUrl: 'modules/admin/inputformbuilder/shared/views/formbuilder-toolbar.html'
    });

    // Todo: bind javascript events to scope here...
    function link(scope, element, attributes) {

      //Slide toggle file upload Dom Manipulation
      var el = angular.element(element[0].querySelector('#ImportButtonToggle'));
      function ToggleDiv() {
        $('.fileUploadDiv').slideToggle('slow', function() {
          if ($('.fileUploadDiv').is(':hidden')) {
            $($('#formListToolbar').find('.k-i-arrowhead-s')).removeClass('k-i-arrowhead-s').addClass('k-i-arrowhead-e');
          }
          else {
            $($('#formListToolbar').find('.k-i-arrowhead-e')).removeClass('k-i-arrowhead-e').addClass('k-i-arrowhead-s');
          }
        });

      }
      el.bind('click', ToggleDiv);

    }
  }

}());
