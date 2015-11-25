(function () {
  'use strict';
  /* Service for communicating between search controllers */
  angular.module('elli.encompass.web.fieldsearch').factory('SearchService', SearchService);
  /* @ngInject */
  function SearchService($rootScope) {
    var service = {};
    service.searchFields = '';
    service.selectedItems = {};
    service.broadcastSearch = function (eventName) {
      $rootScope.$broadcast(eventName);
    };
    return service;
  }

  /* Service for getting search result */
  angular.module('elli.encompass.web.fieldsearch').factory('SearchResultService', SearchResultService);

  /* @ngInject */
  function SearchResultService(Restangular, FSCONSTANTS) {
    var service = {};
    var searchUrl = Restangular.all(FSCONSTANTS.SEARCHRESULTAPI);

    service.getSearchResultPromise = function (searchResultRequestPayload) {
      return searchUrl.customPOST(searchResultRequestPayload, null, null, {
        'handled': true
      });
    };
    return service;
  }

  /* Service for getting search result details */
  angular.module('elli.encompass.web.fieldsearch').factory('SearchDetailsService', SearchDetailsService);

  /* @ngInject */
  function SearchDetailsService(Restangular, FSCONSTANTS) {
    var service = {};
    var searchDetailsUrl = Restangular.all(FSCONSTANTS.SEARCHDETAILSAPI);
    service.getSearchDetailsPromise = function (searchDetailsRequestPayload) {
      return searchDetailsUrl.customPOST(searchDetailsRequestPayload, null, null, {
        'handled': true
      });
    };
    return service;
  }

  /* Service for saving app states */
  angular.module('elli.encompass.web.fieldsearch').factory('SaveStateService', SaveStateService);

  /*@ngInject*/
  function SaveStateService(localStorageService, FSCONSTANTS, $window) {
    var service = {};

    if (localStorageService.isSupported) {

      service.saveSearchItemsState = function (newValues) {
        localStorageService.set(FSCONSTANTS.LSSEARCHITEMSKEY, newValues);
      };

      service.saveSearchResultState = function (newResultValues) {
        localStorageService.set(FSCONSTANTS.LSSEARCHRESULTKEY, newResultValues);
      };

      service.saveStateWithName = function (name, newValues) {
        localStorageService.set(name, newValues);
      };

      service.getSearchItemsState = function () {
        return localStorageService.get(FSCONSTANTS.LSSEARCHITEMSKEY);
      };

      service.getSearchResultState = function () {
        return localStorageService.get(FSCONSTANTS.LSSEARCHRESULTKEY);
      };

      service.getStateWithName = function (name) {
        return localStorageService.get(name);
      };
    } else {
      $window.alert('Warning: Local Storage is not supported in this browser!');
    }
    return service;
  }

  angular.module('elli.encompass.web.fieldsearch').constant('WarningMsgConfigService', {
    messages: [
      {
        'id': 'fs-message0',
        'Message': 'Encompass was unable to find field ‘1%’ on any input form. ' +
        'Confirm that you entered a valid field ID and try again.',
        'Type': 'warning'
      }, {
        'id': 'fs-message1',
        'Message': 'Encompass was unable to find fields ‘1%’ or ‘2%’ on any input form. ' +
        'Confirm that you entered valid field IDs and try again.',
        'Type': 'warning'
      }, {
        'id': 'fs-message2',
        'Message': 'Encompass was unable to find fields ‘1%’, ‘2%’ or ‘3%’ on any input form. ' +
        'Confirm that you entered valid field IDs and try again.',
        'Type': 'warning'
      }, {
        'id': 'fs-message3',
        'Message': 'You have entered duplicate field ID\'s. Search values must be unique.',
        'Type': 'warning'
      }, {
        'id': 'fs-message4',
        'Message': 'Encompass was unable to find a business rule, calculated field, template, ' +
        'or alert that applies to field ‘1%’.',
        'Type': 'warning'
      }, {
        'id': 'fs-message5',
        'Message': 'Encompass was unable to find a business rule, calculated field, template, ' +
        'or alert that applies to fields ‘1%’ and ‘2%’.<br>(To find a business rule or other items ' +
        'that apply to one specific field, search for one field ID at a time.)',
        'Type': 'warning'
      }, {
        'id': 'fs-message6',
        'Message': 'Encompass was unable to find a business rule, calculated field, template, ' +
        'or alert that applies to fields ‘1%’, ‘2%’, and ‘3%’.<br>(To find a business rule or other items ' +
        'that apply to one specific field, search for one field ID at a time.)',
        'Type': 'warning'
      }, {
        'id': 'fs-message7',
        'Message': 'Please enter at least one field ID to search for.',
        'Type': 'warning'
      }
    ]
  });

})();
