(function () {
  'use strict';
  describe('Test Field Search Controller: FieldSearchCtrl', function () {
    var scope, ctrl, rootScope, httpBackend, restURL, searchResultPath, thickClient,
      searchDetailPath, msgService, fsConstants, searchService, timeout;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller, encompass,
                                ENV, FSCONSTANTS, WarningMsgConfigService, SearchService, $timeout) {
      scope = $rootScope.$new();
      ctrl = $controller('FieldSearchCtrl', {
        $scope: scope
      });
      rootScope = $rootScope;
      httpBackend = _$httpBackend_;
      restURL = ENV.restURL;
      searchResultPath = FSCONSTANTS.SEARCHRESULTAPI;
      searchDetailPath = FSCONSTANTS.SEARCHDETAILSAPI;
      msgService = WarningMsgConfigService;
      fsConstants = FSCONSTANTS;
      searchService = SearchService;
      timeout = $timeout;
      thickClient = encompass;
    }));

    function getSearchResultData() {
      var searchResultDataInit = [];

      window._.range(20).map(function () {
        searchResultDataInit.push({
          name: null,
          type: null,
          status: null
        });
      });

      return searchResultDataInit;
    }

    it('Field search controller should have a search section with three fields', function () {
      expect(ctrl.searchFieldsKendo).toBeTruthy();
    });

    //Testing clearAll()
    it('Field search controller should clear the entire page when called with clearAll', function () {
      ctrl.showGrid = true;
      ctrl.showOthers = true;
      ctrl.showChannel = true;
      ctrl.bottomTextAreaTitle = 'test';
      ctrl.searchFieldsKendo.id1 = '4000';
      ctrl.searchResultColumn = ctrl.searchResultColumn2;
      ctrl.searchResultData = [{
        name: 'testName1',
        type: 'testType1',
        'status': 'active',
        'Id': '1'
      }, {
        name: 'testName2',
        type: 'testType2',
        'status': 'inactive',
        'Id': '2'
      }];
      ctrl.typesResultData = [{
        'type': 'testType1'
      }, {
        'type': 'testType2'
      }];
      ctrl.statusResultData = [{
        'status': 'active'
      }, {
        'status': 'inactive'
      }];
      ctrl.clearAll();

      //Assertions
      expect(ctrl.showGrid).toBeFalsy();
      expect(ctrl.showOthers).toBeFalsy();
      expect(ctrl.showChannel).toBeFalsy();
      expect(ctrl.bottomTextAreaTitle).toEqual('Result Details:');
      expect(ctrl.searchFieldsKendo.id1).toEqual('');
      expect(ctrl.searchResultColumn).toEqual(ctrl.searchResultColumn1);
      var srData = getSearchResultData();
      expect(ctrl.searchResultData).toEqual(srData);
    });

    //Testing conditionalFieldsClicked()
    it('Field search controller should perform a search when a condition field is clicked', function () {
      ctrl.typesResultData = null;
      ctrl.statusResultData = null;
      ctrl.conditionalFieldsClicked('360');

      //Assertion for three input boxes
      expect(ctrl.searchFieldsKendo.id1).toEqual('360');
      expect(ctrl.searchFieldsKendo.id2).toEqual('');
      expect(ctrl.searchFieldsKendo.id3).toEqual('');

      //Assertion for the bottom panel
      expect(ctrl.showGrid).toBeFalsy();
      expect(ctrl.showOthers).toBeFalsy();
      expect(ctrl.showChannel).toBeFalsy();
      expect(ctrl.bottomTextAreaTitle).toEqual('Result Details:');

      //Assertion for search result rest apis called
      var srPayload = {
          'FieldData': ['360'],
          'Paging': 'false',
          'Sort': 'false'
        },
        mockToReturn = {};

      httpBackend.expectPOST(restURL + '/' + searchResultPath, srPayload).respond(mockToReturn);
      httpBackend.flush();
    });

    //Testing displaySearchItems()
    it('Field search controller should display the search details in bottom', function () {
      //Set up data
      searchService.searchFields = '4000,1009';
      searchService.selectedItems = [{
        'Name': ''
      }];
      searchService.selectedItems.Name = 'testRule';
      searchService.selectedItems.Type = fsConstants.FIELDTRIGGERS;
      searchService.selectedItems.Id = '1';

      ctrl.displaySearchItems();

      //Assertion for search detail rest apis called
      var settingData = {
        'Id': searchService.selectedItems[0].Id,
        'Type': searchService.selectedItems[0].Type
      };
      var sdPayload = {
          'FieldData': searchService.searchFields.split(','),
          'SettingData': settingData
        },
        mockToReturn = {};

      httpBackend.expectPOST(restURL + '/' + searchDetailPath, sdPayload).respond(mockToReturn);
      httpBackend.flush();

    });

    it('Field search controller should display message popup when rule is deleted.', inject(function (SearchDetailsService) {
      //Arrange - Setup Data
      searchService.searchFields = '4000,1009';
      searchService.selectedItems = [
        {
          Name: 'Test Rule 1',
          Type: fsConstants.FIELDTRIGGERS,
          Id: '1'
        },
        {
          Name: 'Test Rule 2',
          Type: fsConstants.FIELDTRIGGERS,
          Id: '2'
        }
      ];

      spyOn(SearchDetailsService, 'getSearchDetailsPromise').and.callThrough();
      var settingData = {Id: searchService.selectedItems[0].Id, Type: searchService.selectedItems[0].Type};
      var sdPayload = {'FieldData': searchService.searchFields.split(','), 'SettingData': settingData};
      var mockReponse = {
        code: 404,
        summary: 'Bad Request',
        details: 'Can not find the rule associated with field search rule id 1'
      };
      //Act - Function Call
      ctrl.displaySearchItems();

      //Assert - Fake function call.
      httpBackend.expectPOST(restURL + '/' + searchDetailPath, sdPayload).respond(404, mockReponse);
      httpBackend.flush();
    }));

    //Testing findSearchFieldID()
    it('Field search controller should call openBusinessRuleFindFieldDialog', function () {
      spyOn(thickClient, 'openBusinessRuleFindFieldDialog');
      ctrl.findSearchFieldID('id2');

      //Assertion
      expect(ctrl.clickedInputId).toEqual('id2');
      expect(thickClient.openBusinessRuleFindFieldDialog).toHaveBeenCalledWith(null, ctrl.populateFieldId);
    });

    //Testing populateFieldId()
    it('PopulateFieldId should populate the search input box', function () {
      //Set up the data
      var jsonParams = '{"FieldId":"1109","DialogResult":"OK","ErrorCode":0,"ErrorMessage":null}';
      ctrl.clickedInputId = 'id3';

      //Call the method
      ctrl.populateFieldId(jsonParams);

      //Assertions
      expect(ctrl.searchFieldsKendo[ctrl.clickedInputId]).toEqual('1109');
    });

    //Testing fieldTriggerColumns
    it('fieldTriggerColumns should have 2 elements', function () {
      expect(ctrl.fieldTriggerColumns.length).toEqual(2);
      expect(ctrl.fieldTriggerColumns[0].field).toEqual('ActionSource');
      expect(ctrl.fieldTriggerColumns[0].title).toEqual('Activation Source');
      expect(ctrl.fieldTriggerColumns[0].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.fieldTriggerColumns[1].field).toEqual('Actions');
      expect(ctrl.fieldTriggerColumns[1].title).toEqual('Action');
      expect(ctrl.fieldTriggerColumns[1].headerAttributes.style).toEqual('font-weight: bold');
    });

    //Testing fieldDataEntryColumns
    it('fieldDataEntryColumns should have 5 elements', function () {
      expect(ctrl.fieldDataEntryColumns.length).toEqual(5);
      expect(ctrl.fieldDataEntryColumns[0].field).toEqual('Id');
      expect(ctrl.fieldDataEntryColumns[0].title).toEqual('ID');
      expect(ctrl.fieldDataEntryColumns[0].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.fieldDataEntryColumns[1].field).toEqual('Description');
      expect(ctrl.fieldDataEntryColumns[1].title).toEqual('Description');
      expect(ctrl.fieldDataEntryColumns[1].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.fieldDataEntryColumns[2].field).toEqual('RuleType');
      expect(ctrl.fieldDataEntryColumns[2].title).toEqual('Rule Type');
      expect(ctrl.fieldDataEntryColumns[2].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.fieldDataEntryColumns[3].field).toEqual('Details');
      expect(ctrl.fieldDataEntryColumns[3].title).toEqual('Details');
      expect(ctrl.fieldDataEntryColumns[3].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.fieldDataEntryColumns[4].field).toEqual('PreRequiredFields');
      expect(ctrl.fieldDataEntryColumns[4].title).toEqual('Pre-Required Fields');
      expect(ctrl.fieldDataEntryColumns[4].headerAttributes.style).toEqual('font-weight: bold');
    });

    //Testing inputFormListColumns
    it('inputFormListColumns should have one element', function () {
      expect(ctrl.inputFormListColumns.length).toEqual(1);
      expect(ctrl.inputFormListColumns[0].field).toEqual('FormListItem');
      expect(ctrl.inputFormListColumns[0].title).toEqual('Form List');
      expect(ctrl.inputFormListColumns[0].headerAttributes.style).toEqual('font-weight: bold');
    });

    //Testing automatedConditionsColumns
    it('automatedConditionsColumns should have two elements', function () {
      expect(ctrl.automatedConditionsColumns.length).toEqual(2);
      expect(ctrl.automatedConditionsColumns[0].field).toEqual('ConditionType');
      expect(ctrl.automatedConditionsColumns[0].title).toEqual('Condition Type');
      expect(ctrl.automatedConditionsColumns[0].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.automatedConditionsColumns[1].field).toEqual('ConditionName');
      expect(ctrl.automatedConditionsColumns[1].title).toEqual('Condition Name');
      expect(ctrl.automatedConditionsColumns[1].headerAttributes.style).toEqual('font-weight: bold');
    });

    //Testing kendoSplitterOptions
    it('kendoSplitterOptions should define panes and orientation', function () {
      expect(ctrl.kendoSplitterOptions.panes).toEqual('[ {size:\'50%\'}, {size:\'50%\'}]');
      expect(ctrl.kendoSplitterOptions.orientation).toEqual('vertical');
    });

    //Testing personaAccessToFieldsColumns
    it('personaAccessToFieldsColumns should have two elements', function () {
      expect(ctrl.personaAccessToFieldsColumns.length).toEqual(2);
      expect(ctrl.personaAccessToFieldsColumns[0].field).toEqual('Persona');
      expect(ctrl.personaAccessToFieldsColumns[0].title).toEqual('Persona');
      expect(ctrl.personaAccessToFieldsColumns[0].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.personaAccessToFieldsColumns[1].field).toEqual('Rights');
      expect(ctrl.personaAccessToFieldsColumns[1].title).toEqual('Rights');
      expect(ctrl.personaAccessToFieldsColumns[1].headerAttributes.style).toEqual('font-weight: bold');
    });

    //Testing personaAccessToLoansColumns
    it('personaAccessToLoansColumns should should have two elements', function () {
      expect(ctrl.personaAccessToLoansColumns.length).toEqual(2);
      expect(ctrl.personaAccessToLoansColumns[0].field).toEqual('Persona');
      expect(ctrl.personaAccessToLoansColumns[0].title).toEqual('Persona');
      expect(ctrl.personaAccessToLoansColumns[0].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.personaAccessToLoansColumns[1].field).toEqual('AccessToLoans');
      expect(ctrl.personaAccessToLoansColumns[1].title).toEqual('Persona Access to Loans');
      expect(ctrl.personaAccessToLoansColumns[1].headerAttributes.style).toEqual('font-weight: bold');
    });

    //Testing the booleans
    it('Field search controller should initialize some values', function () {
      expect(ctrl.dataInLocalStorage).toBeFalsy();
      expect(ctrl.showChannel).toBeFalsy();
      expect(ctrl.showLower).toBeTruthy();
      expect(ctrl.showOthers).toBeFalsy();
      expect(ctrl.showSearchItem).toBeFalsy();
      expect(ctrl.bottomTextAreaTitle).toEqual('Result Details:');
      expect(ctrl.statusResultData.length).toEqual(1);
      expect(ctrl.statusResultData[0].status).toEqual('');
      expect(ctrl.typesResultData.length).toEqual(1);
      expect(ctrl.typesResultData[0].type).toEqual('');
    });

    //Testing performFieldSearch
    it('performFieldSearch should call searchFieldFnForRestApi', function () {
      //Setup data
      var fieldIds = '200';
      ctrl.searchFieldsKendo = {
        id1: '200',
        id2: '',
        id3: ''
      };

      //Calling performFieldSearch
      ctrl.performFieldSearch(fieldIds);

      //Assertion
      expect(searchService.searchFields).toEqual(fieldIds);
      var srPayload = {
          'FieldData': ['200'],
          'Paging': 'false',
          'Sort': 'false'
        },
        mockToReturn = {};

      httpBackend.expectPOST(restURL + '/' + searchResultPath, srPayload).respond(mockToReturn);
      httpBackend.flush();
    });

    //Testing searchFieldFnForRestApi
    it('searchFieldFnForRestApi should issue REST call', function () {
      //Setup data
      ctrl.searchFieldsKendo = {
        id1: '112',
        id2: '113',
        id3: ''
      };
      var srPayload = {
          'FieldData': ['112', '113'],
          'Paging': 'false',
          'Sort': 'false'
        },
        mockToReturn = {
          'FieldData': [{
            'FieldId': '112',
            'FieldType': 'STRING',
            'FieldDescription': null
          }, {
            'FieldId': '113',
            'FieldType': 'DECIMAL_2',
            'FieldDescription': null
          }],
          'SettingData': [{
            'Name': 'Pre-req fields reg test',
            'Type': 'Field Data Entry',
            'Status': 'Inactive',
            'Id': '69'
          }],
          'TotalRules': '1'
        };

      //Calling searchFieldFnForRestApi
      ctrl.searchFieldFnForRestApi();

      //Flush the request
      httpBackend.expectPOST(restURL + '/' + searchResultPath, srPayload).respond(mockToReturn);
      httpBackend.flush();

      //Assertion
      expect(searchService.searchFields).toEqual('112,113');
      expect(ctrl.searchResultRequestPayload.FieldData).toEqual(['112', '113']);
      expect(ctrl.searchResultData).toEqual(mockToReturn.SettingData);
      expect(ctrl.searchBusinessRules).toEqual(mockToReturn.TotalRules);
      expect(ctrl.statusResultData.length).toEqual(1);
      expect(ctrl.statusResultData[0].status).toEqual(mockToReturn.SettingData[0].Status);
      expect(ctrl.typesResultData[0].type).toEqual(mockToReturn.SettingData[0].Type);
      expect(ctrl.searchHistory[0]).toEqual({
        searchedItem: searchService.searchFields
      });
      expect(ctrl.resultTitle).toEqual('Field ID 112 (STRING),113 (DECIMAL_2)');

    });

    //Testing searchResultColumn1
    it('searchResultColumn1 should have three elements', function () {
      expect(ctrl.searchResultColumn1.length).toEqual(3);
      expect(ctrl.searchResultColumn1[0].field).toEqual('name');
      expect(ctrl.searchResultColumn1[0].title).toEqual('Name');
      expect(ctrl.searchResultColumn1[0].sortable).toBeFalsy();
      expect(ctrl.searchResultColumn1[0].filterable).toBeFalsy();
      expect(ctrl.searchResultColumn1[0].width).toEqual('35%');
      expect(ctrl.searchResultColumn1[0].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.searchResultColumn1[1].field).toEqual('type');
      expect(ctrl.searchResultColumn1[1].title).toEqual('Type');
      expect(ctrl.searchResultColumn1[1].sortable).toBeFalsy();
      expect(ctrl.searchResultColumn1[1].filterable).toBeFalsy();
      expect(ctrl.searchResultColumn1[1].width).toEqual('35%');
      expect(ctrl.searchResultColumn1[1].headerAttributes.style).toEqual('font-weight: bold');
      expect(ctrl.searchResultColumn1[2].field).toEqual('status');
      expect(ctrl.searchResultColumn1[2].title).toEqual('Status');
      expect(ctrl.searchResultColumn1[2].sortable).toBeFalsy();
      expect(ctrl.searchResultColumn1[2].filterable).toBeFalsy();
      expect(ctrl.searchResultColumn1[2].width).toEqual('35%');
      expect(ctrl.searchResultColumn1[2].headerAttributes.style).toEqual('font-weight: bold');
    });

    //Testing upperGridOptions
    it('upperGridOptions should have seven properties defined.', function () {
      var ugOptions;

      //Calling upperGridOptions
      ugOptions = ctrl.upperGridOptions();

      //Assertion
      expect(ugOptions.dataSource.data).toEqual(ctrl.searchResultData);
      expect(ugOptions.scrollable).toBeTruthy();
      expect(ugOptions.sortable).toBeTruthy();
      expect(ugOptions.selectable).toBeTruthy();
      expect(ugOptions.filterable.mode).toEqual('row');
      expect(ugOptions.dataBound).toEqual(ctrl.onDataBound);
      expect(ugOptions.columns).toEqual(ctrl.searchResultColumn);
    });

    //Testing searchHistoryOptions
    it('searchHistoryOptions should have five properties defined.', function () {
      var shOptions;

      //Calling searchHistoryOptions
      shOptions = ctrl.searchHistoryOptions();

      //Assertion
      expect(shOptions.dataSource.data).toEqual(ctrl.searchHistory);
      expect(shOptions.scrollable).toBeTruthy();
      expect(shOptions.navigatable).toBeTruthy();
      expect(shOptions.selectable).toEqual('row');
      expect(shOptions.columns.length).toEqual(1);
      expect(shOptions.columns[0].field).toEqual('searchedItem');
      expect(shOptions.columns[0].headerAttributes.style).toEqual('display: none');
    });

    afterEach(function () {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
  });
})();
