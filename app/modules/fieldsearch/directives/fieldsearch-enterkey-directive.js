(function () {
  'use strict';

  function processEnterKey(FSCONSTANTS) {
    return {
      link: /*@ngInject*/function postLink(scope, element, attrs) {

        element.on(FSCONSTANTS.ENTERKEYEVENT, function (event) {
          if (event.which === 13) {
            scope.$apply(function () {
              scope.$eval(attrs.fieldSearchEnterkey);
            });

            event.preventDefault();
          }
        });
      }
    };
  }

  angular.module('elli.encompass.web.fieldsearch')
    .directive('fieldSearchEnterkey', processEnterKey);

})();
