(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').factory('encompass', function ($window, applicationLoggingService, $rootScope, _) {
    function invoker(fn) {
      return function () {
        if ($rootScope.isThickClient) {
          try {
            return fn.apply(this, arguments);
          } catch (ex) {
            applicationLoggingService.error(ex.stack || ex.message);
          }
        }
      };
    }

    var encompass = $window.encompass.interaction;
    _.map(encompass, function (val, key) {
      if (key !== 'writeLog') {
        encompass[key] = invoker(val);
      } else {
        encompass[key] = val;
      }
    });
    return encompass;
  });
})();
