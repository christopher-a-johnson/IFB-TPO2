(function () {
  'use strict';
  angular.module('elli.encompass.web', [
    'ui.bootstrap', 'ui.router',
    'restangular', 'cfp.hotkeys',
    'wc.Directives',
    'kendo.directives', 'kendo.window',
    'ngDraggable',
    'ngAnimate',
    'LocalStorageModule',
    'elli.encompass.web.config',
    'elli.encompass.web.login',
    'elli.encompass.web.fieldsearch',
    'elli.encompass.web.templates',
    'modalServiceModule',
    /*'elli.encompass.web.pipeline',*/
    // @if BUILD_PIPELINE_ONLY='NO'
    'elli.encompass.web.admin',
    // @endif
    'elli.encompass.web.shared'
  ]);
  angular.module('elli.encompass.web').config(appConfig);
  angular.module('elli.encompass.web').run(appStart);
  /* @ngInject */
  function appConfig($urlRouterProvider, $httpProvider, RestangularProvider, ENV, ENCOMPASSWEBCONSTANTS, $locationProvider,
                     hotkeysProvider) {
    $urlRouterProvider.when('app/#/FieldSearch', 'app/FieldSearch'); // Workaround for field search in 15.2 NGENC-1278
    $urlRouterProvider.otherwise(ENCOMPASSWEBCONSTANTS.LOGIN_STATE); // Set default state for web page version
    RestangularProvider.setBaseUrl(ENV.restURL); // setup Restangular base url
    $httpProvider.interceptors.push('authInterceptor'); // add interceptor for auth failures
    $httpProvider.interceptors.push('httpResponseErrorInterceptor'); // add interceptor to log all http failures
    $locationProvider.html5Mode({enabled: true, requireBase: true}); // enable HTML5 Mode for user friendly urls...
    hotkeysProvider.includeCheatSheet = false; // disable angular hotkeys cheatsheet
  }

  angular.module('elli.encompass.web').constant('ENCOMPASSWEBCONSTANTS', {
    SESSION_ID: 'SessionId',
    DEFAULT_STATE: 'admin',
    LOGIN_STATE: 'login',
    AUTH_EXPIRED_WARNING: 'Connection to Encompass server lost. Log in again to continue.'
  });

  /* @ngInject */
  function appStart($rootScope, $state, encompass, applicationLoggingService, Restangular, SessionStorage, ENCOMPASSWEBCONSTANTS,
                    modalService) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      if (toState.name !== 'login') {
        var sessionId = null;
        $rootScope.isThickClient = toParams.thick || false;
        if ($rootScope.isThickClient) { // this is thick client
          window.ERROR_HANDLING_CONSTANTS.LOG_ERRORS_TO_ENCOMPASS = true; // enable logging for thick client
          console.log('loading state', toState);
          encompass.getSessionId(null, function (response) {
            var params = JSON.parse(response);
            sessionId = params.SessionId;
            if (sessionId) {
              SessionStorage.set(ENCOMPASSWEBCONSTANTS.SESSION_ID, sessionId);
              Restangular.setDefaultHeaders({'Elli-Nextgen-Session': sessionId});
            } else {
              return modalService.showModalDialog('warning', ENCOMPASSWEBCONSTANTS.AUTH_EXPIRED_WARNING, null, null, null);
            }
          });
        } else {
          sessionId = SessionStorage.get(ENCOMPASSWEBCONSTANTS.SESSION_ID);
          if (sessionId) {
            Restangular.setDefaultHeaders({'Elli-Nextgen-Session': sessionId});
          } else {
            $state.go('login', {next: toState.name});
            event.preventDefault();
          }
        }
      }
    });
    $rootScope.$on('$stateNotFound', function (event, toState) { // tap all stateNotFound errors and log them
      applicationLoggingService.error('State Transition Error: event:' + event.name + ', toState:' + toState.name);
      event.preventDefault();
    });
    $rootScope.$on('$stateChangeError', function (event, toState) { // tap all stateChange errors and log them
      applicationLoggingService.error('State Change Error: event:' + event.name + ', toState:' + toState.name);
      event.preventDefault();
    });
  }

  /* Rename localStorageService to SessionStorage, as it always confuses people */
  angular.module('elli.encompass.web').factory('SessionStorage', function (localStorageService) {
    return localStorageService;
  });

  angular.module('elli.encompass.web').constant('_', window._);
  angular.module('elli.encompass.web').constant('kendo', window.kendo);
}());
