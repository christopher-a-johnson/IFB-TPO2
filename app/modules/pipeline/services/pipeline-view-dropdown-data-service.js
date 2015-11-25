(function (app) {
  'use strict';
  app.factory('PipelineViewDropdownData', function (Restangular, kendo, _) {
    var service = {
      items: [],
      selectedItem: null
    };

    service.resolvePromise = function () {
      /* Todo: Temp code, remove when integrating with wps */
      var restangular = Restangular.withConfig(function (Configurer) {
        Configurer.setBaseUrl('/api/v1');
        Configurer.setRequestSuffix('.json');
      });

      return restangular.all('PipelineViewDropdownData').getList().then(function (response) {
        angular.copy(response, service.items);
        service.selectedItem = _.findWhere(service.items, {isDefault: true}).id;
      });
    };

    return service;
  });
})(angular.module('elli.encompass.web.pipeline'));
