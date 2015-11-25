(function () {
  'use strict';

  angular.module('elli.encompass.web.config', [])
    .constant('ENV', {
      name: window.NGEN_CONSTANTS.ENV,
      restURL: window.NGEN_CONSTANTS.RESTURL,
      osbRestURL: window.NGEN_CONSTANTS.OSBRESTURL
    });
}());
