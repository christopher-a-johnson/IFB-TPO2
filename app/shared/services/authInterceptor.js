(function () {
  'use strict';
  angular.module('elli.encompass.web.shared')
    .factory('authInterceptor', function ($q, $rootScope, $stateParams, modalService, SessionStorage, encompass,
                                          ENCOMPASSWEBCONSTANTS, $injector) {
      function userNotAuthenticated(rejection) {
        var authenticated = false;
        if (typeof rejection !== 'undefined' && !!rejection) {
          authenticated = ['The HTTP request is unauthorized with client authentication scheme',
            'Unexpected server error: Session has timed out or is invalid', 'Unauthorized', 'Invalid Session ID']
            .some(function (condition) {
              if (typeof rejection.summary !== 'undefined' && !!rejection.summary
                && rejection.summary.lastIndexOf(condition, 0) === 0) {
                return true;
              }
              if (typeof rejection.details !== 'undefined' && !!rejection.details &&
                rejection.details.lastIndexOf(condition, 0) === 0) {
                return true;
              }
              if (typeof rejection.data !== 'undefined' && !!rejection.data) {
                if (typeof  rejection.data.summary !== 'undefined' && !!rejection.data.summary
                  && rejection.data.summary.lastIndexOf(condition, 0) === 0) {
                  return true;
                }
                if (typeof rejection.data.details !== 'undefined' && !!rejection.data.details
                  && rejection.data.details.lastIndexOf(condition, 0) === 0) {
                  return true;
                }
              }
            });
        }
        return authenticated;
      }

      return {
        responseError: function responseError(rejection) {
          if (typeof rejection.status !== 'undefined' && rejection.status === 0) {
            modalService.showModalDialog('warning', ENCOMPASSWEBCONSTANTS.AUTH_EXPIRED_WARNING, null, null, null);
            return $q.reject(rejection);
          }
          if (userNotAuthenticated(rejection)) {
            if ($rootScope.isThickClient) {
              var Restangular = $injector.get('Restangular');
              var $http = $injector.get('$http');
              var defer = $q.defer(); // create and return new promise
              encompass.getSessionId(null, function (response) {
                var params = JSON.parse(response);
                var newSessionId = params.SessionId;
                var currentSessionId = SessionStorage.get(ENCOMPASSWEBCONSTANTS.SESSION_ID);
                if (newSessionId === currentSessionId) { // encompass gives you same id if it is valid even if you ask multiple times
                  modalService.showModalDialog('warning', ENCOMPASSWEBCONSTANTS.AUTH_EXPIRED_WARNING, null, null, null);
                  defer.reject(rejection); // reject original request
                } else {
                  SessionStorage.set(ENCOMPASSWEBCONSTANTS.SESSION_ID, newSessionId);
                  Restangular.setDefaultHeaders({'Elli-Nextgen-Session': newSessionId});
                  rejection.config.headers['Elli-Nextgen-Session'] = newSessionId;
                  $http(rejection.config).then(function (response) {
                    defer.resolve(response); // resolve the newly created promise
                  });
                }
              });
              return defer.promise; // return the newly created promise
            } else {
              var $state = $injector.get('$state');
              $state.go('login');
              return $q.reject(rejection);
            }
          }
          return $q.reject(rejection);
        }
      };
    });
})();

