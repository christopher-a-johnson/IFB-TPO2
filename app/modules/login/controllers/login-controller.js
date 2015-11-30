(function () {
  'use strict';
  angular.module('elli.encompass.web.login').controller('LoginCtrl', LoginCtrl);
  /* @ngInject */
  function LoginCtrl($state, LoginService, ENCOMPASSWEBCONSTANTS, SessionStorage, $stateParams) {
    var vm = this;
    vm.cancel = cancel;
    vm.login = login;
    //QA env: 'qa151c1001' ; Dev env: 'dev150110000361'
    //new realm: dev (dev10000361, dev10000363), and qa (qa10000361, qa10000363)
    cancel();
    /* clear out the session storage and set flag to identify thin client */
    SessionStorage.clearAll();

    function login() {
      LoginService.getLoginPromise(vm.cred).then(function success(createdSession) {
        SessionStorage.set(ENCOMPASSWEBCONSTANTS.SESSION_ID, createdSession.SessionId);
        $state.go($stateParams.next || ENCOMPASSWEBCONSTANTS.DEFAULT_STATE);
      });
    }

    function cancel() {
      vm.cred = {
        UserName: 'devadmin',
        Password: 'password',
        Realm: 'qa15210000363'
      };
    }
  }
})();
