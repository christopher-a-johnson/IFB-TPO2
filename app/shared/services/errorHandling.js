(function () {
  'use strict';
  /**
   * Module to handle all the exceptions that arises in the application
   * Exception Logging Service - handles & logs all uncaught Javascript exceptions. e.g., object is undefined
   * Application Logging Service - handles & logs application related errors & debug messages.
   * HttpResponseErrorInterceptor - handles HTTP response errors
   */
  angular.module('elli.encompass.web.shared').factory('applicationLoggingService', function ($log, $window) {
    var appLogService = {
      //Logs the Error to the (Console, EncompassLog & Server) and displays them in the screen
      //$window.logError(message, showOnScreen, consoleOnly)
      error: function (errorMessage) {
        var errorDetails = {
          'message': errorMessage.data || errorMessage,
          'url': $window.location.href || '',
          'type': 'error'
        };
        $window.logError(errorDetails, true, false);
      },

      //Logs the info/message to the (Console, EncompassLog & Server) and displays them in the screen
      debug: function (debugMessage) {
        var debugDetails = {
          'message': debugMessage || '',
          'type': 'debug'
        };
        $window.logError(debugDetails, true, false);
      },

      //Logs the info/message to the Console, EncompassLog & Server, but does not display them in the UI
      log: function (info) {
        var detailedInfo = {
          'message': info || '',
          'type': 'info'
        };
        $window.logError(detailedInfo, false, false);
      },

      //Logs the info/message to the browser's Console ONLY, and does not display them in the UI
      //this should be used only for DEV purpose to log the details in the browser console.
      //Instead of this function, just use "console.log" directly for testing/DEV purposes
      consoleLog: function () {
        $window.logError(arguments, false, true);
      }
    };

    return appLogService;
  });

  /**
   * this interceptor uses the application logging service to log any server-side errors from $http requests
   * and display the error message in the screen
   */
  angular.module('elli.encompass.web.shared')
    .factory('httpResponseErrorInterceptor', function ($q, $rootScope, $stateParams, modalService, SessionStorage, encompass,
                                                       ENCOMPASSWEBCONSTANTS, $injector, applicationLoggingService) {
      return {
        request: function (config) {
          config.requestTimestamp = new Date().getTime();
          return config;
        },
        response: function (response) {
          if (window.ERROR_HANDLING_CONSTANTS.LOG_API_RESPONSE_TIME) {
            if (response.config.url.indexOf('.html') === -1) {
              applicationLoggingService.debug('Duration: ' + (new Date().getTime() - response.config.requestTimestamp).toString()
                + 'ms ~~~ API: ' + response.config.url);
            }
          }
          return response;
        },
        responseError: function responseError(rejection) {
          if (window.ERROR_HANDLING_CONSTANTS.LOG_API_RESPONSE_TIME) {
            applicationLoggingService.debug('Duration: ' + (new Date().getTime() - rejection.config.requestTimestamp).toString()
              + 'ms *** API (Failed): ' + rejection.config.url);
          }

          if (typeof rejection !== 'undefined' && !!rejection && typeof  rejection.config !== 'undefined' && !!rejection.config
            && typeof rejection.config.headers && !!rejection.config.headers && rejection.config.headers.handled) {
            return $q.reject(rejection);
          }
          if (rejection.status !== null && typeof rejection.config !== 'undefined' && !!rejection.config) {
            var error = 'URL: ' + rejection.config.url +
              '  ; ~ METHOD: ' + rejection.config.method +
              '; ~ STATUS: ' + rejection.status +
              '; ~ DETAILS: ' + (rejection.data ? rejection.data.details + ' - '
              + (rejection.data.summary || '') : rejection.statusText);
            applicationLoggingService.error('HTTP Error - ' + error);
          }
          return $q.reject(rejection);
        }
      };
    });

  /**
   * Override AngularJS built in exception handler, and use exceptionLoggingService
   */
  angular.module('elli.encompass.web.shared').provider('$exceptionHandler', {
    $get: function (exceptionLoggingService) {
      return (exceptionLoggingService);
    }
  });

  /**
   * Exception Logging Service - to log all the uncaught client errors to the server.
   */
  angular.module('elli.encompass.web.shared').factory('exceptionLoggingService', function ($log, $window) {
    function error(exception) {
      $window.logError('DrysdaleWeb - ' + ((exception.stack || exception.name + '-' + exception.description) || ''), true, false);
    }

    return (error);
  });

})();
