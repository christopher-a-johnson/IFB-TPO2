(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').factory('FormBuilderModalWindowService', FormBuilderModalWindowService);

  /* @ngInject */
  function FormBuilderModalWindowService($kWindow) {
    var popupHandle;

    return {
      showPopup: function (config, layoutConfiguration) {
        var popupConfiguration = {
          modal: true,
          title: config.title,
          resizable: config.resizable,
          width: config.width,
          height: config.height,
          animation: config.animation,
          templateUrl: config.templateUrl,
          controller: config.controller,
          resolve: {
            LayoutConfiguration: function () {
              return layoutConfiguration;
            }
          }
        };
        popupHandle = $kWindow.open(popupConfiguration);
        return popupHandle;
      },
      closePopup: function (result) {
        if (typeof popupHandle !== 'undefined' && popupHandle !== null) {
          popupHandle.close(result);
        }
      }
    };

  }
})();
