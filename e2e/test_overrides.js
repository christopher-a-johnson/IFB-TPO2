(function () {
  'use strict';
  angular.module('elli.encompass.web').run(function (SessionStorage) {
    SessionStorage.set('isThinClient', true);
  });
})();
