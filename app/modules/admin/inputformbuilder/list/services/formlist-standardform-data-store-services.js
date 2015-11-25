/**
 * Created by urandhe on 4/30/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.admin.formbuilder.formlist').factory('StandardFormListData', StandardFormListData);

  /* @ngInject */
  function StandardFormListData(Restangular) {
    return {
      resolvePromise: function () {
        var restangular = Restangular.withConfig(function (Configurer) {
          Configurer.setBaseUrl('/api/fb');
          Configurer.setRequestSuffix('.json');
        });
        return restangular.all('StandardForms').getList();
      }
    };
  }
}());
