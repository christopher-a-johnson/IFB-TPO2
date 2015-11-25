(function () {
  'use strict';
  describe('Test Field Search Services', function () {
    var httpBackend, rootscope, restURL, searchResultPath, searchDetailPath, restangular;

    //Loan app module
    beforeEach(module('elli.encompass.web'));

    //Assign injected services/mocked http to the local variables
    beforeEach(inject(function (_$httpBackend_, $rootScope, ENV, FSCONSTANTS, Restangular) {
      httpBackend = _$httpBackend_;
      rootscope = $rootScope;
      restURL = ENV.restURL;
      searchResultPath = FSCONSTANTS.SEARCHRESULTAPI;
      searchDetailPath = FSCONSTANTS.SEARCHDETAILSAPI;
      restangular = Restangular;
    }));

    it('Should contain a SearchService', inject(function (SearchService) {
      expect(SearchService).not.toEqual(null);
    }));

    /*  it('SearchService should broadcast the event', inject(function(SearchService) {
     spyOn(rootscope, '$broadcast');
     SearchService.broadcastSearch('testEvent');
     //Assertion
     expect(rootscope.$broadcast).toHaveBeenCalledWith('testEvent');

     }));
     */

    it('Should contain a SearchResultService', inject(function (SearchResultService) {
      expect(SearchResultService).not.toEqual(null);
    }));

    it('SearchResultService should issue a REST API call', inject(function (SearchResultService) {
      var srPayload = {
          'FieldData': ['1'],
          'Paging': 'false',
          'Sort': 'false'
        },
        mockToReturn = {};

      //Request expectations provide a way to make assertions about requests made by the application
      //And to define responses for those requests.
      //The test will fail if the expected requests are not made or they are made in the wrong order.
      httpBackend.expectPOST(restURL + '/' + searchResultPath, srPayload).respond(mockToReturn);
      SearchResultService.getSearchResultPromise(srPayload);

      //The $httpBackend used in production always responds to requests asynchronously.
      //If we preserved this behavior in unit testing, we'd have to create async unit tests, which are hard to write, to follow and to maintain.
      //But neither can the testing mock respond synchronously; that would change the execution of the code under test.
      //For this reason, the mock $httpBackend has a flush() method, which allows the test to explicitly flush pending requests.
      //This preserves the async api of the backend, while allowing the test to execute synchronously.
      httpBackend.flush();

    }));

    it('Should contain a SearchDetailsService', inject(function (SearchDetailsService) {
      expect(SearchDetailsService).not.toEqual(null);
    }));

    it('SearchDetailsService should issue a REST API call', inject(function (SearchDetailsService) {
      var sdPayload = {
          'FieldData': ['4000'],
          'SettingData': {
            'Id': '196',
            'Type': 'Print Auto Selection'
          }
        },
        mockToReturn = {};

      httpBackend.expectPOST(restURL + '/' + searchDetailPath, sdPayload).respond(mockToReturn);
      SearchDetailsService.getSearchDetailsPromise(sdPayload);

      httpBackend.flush();

    }));

    it('Should contain a SaveStateService', inject(function (SaveStateService) {
      expect(SaveStateService).not.toEqual(null);
    }));

    it('SaveStateService should save/retrieve state to local storage', inject(function (SaveStateService) {
      SaveStateService.saveSearchItemsState(['newItemValue']);
      SaveStateService.saveStateWithName('testStateName', 'testStateValue');
      SaveStateService.saveSearchResultState(['newResultValue']);

      expect(SaveStateService.getSearchItemsState()[0]).toEqual('newItemValue');
      expect(SaveStateService.getStateWithName('testStateName')).toEqual('testStateValue');
      expect(SaveStateService.getSearchResultState()[0]).toEqual('newResultValue');
    }));

    it('Should contain a WarningMsgConfigService', inject(function (WarningMsgConfigService) {
      expect(WarningMsgConfigService).not.toEqual(null);
    }));

    /*  it('WarningMsgConfigService should set a base URL to load message json file', inject(function(ENV, WarningMsgConfigService) {
     expect(restangular.configuration.baseUrl).toEqual(restURL);
     expect(WarningMsgConfigService.configuration.baseUrl).toEqual('/app/src/components/fieldsearch');

     }));
     */

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
  });
})();
