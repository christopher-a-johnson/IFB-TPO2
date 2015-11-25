/* jshint ignore: start */
/* jscs: disable */
(function () {
  'use strict';

  angular.module('elli.encompass.web.fieldsearch')
    .controller('FieldSearchCtrl', FieldSearchCtrl);

  /*@ngInject*/
  function FieldSearchCtrl($scope, $window, SearchService, localStorageService, SearchResultService, modalService, SaveStateService,
                           FSCONSTANTS, SearchDetailsService, applicationLoggingService, encompass, $document) {

    var vm = this;

    vm.analysisshowOthersHtml = '';

    vm.bottomTextAreaTitle = 'Result Details:';

    vm.clearAll = clearAll;

    vm.conditionalFieldsClicked = conditionalFieldsClicked;

    vm.dataInLocalStorage = false;

    var performSearch = false;

    var rowClicked = false;

    vm.displaySearchItems = displaySearchItems;

    vm.doubleClicked = false;

    vm.fieldDataEntryColumns = [
      {
        field: 'Id', title: 'ID', headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'Description', title: 'Description', headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'RuleType', title: 'Rule Type', headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'Details', title: 'Details', headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'PreRequiredFields', title: 'Pre-Required Fields', headerAttributes: {
        style: "font-weight: bold"
      }
      }
    ];

    //Read warning messages to be displayed by fieldsearch page
    //vm.warningMessages = WarningMsgConfigService.messages;

    vm.fieldTabs = new kendo.data.ObservableArray([]);

    vm.fieldTriggerColumns = [
      {
        field: 'ActionSource', title: 'Activation Source', headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'Actions', title: 'Action', headerAttributes: {
        style: "font-weight: bold"
      }
      }
    ];

    vm.findSearchFieldID = findSearchFieldID;

    vm.inputFormListColumns = [
      {
        field: 'FormListItem', title: 'Form List', headerAttributes: {
        style: "font-weight: bold"
      }
      }
    ];

    vm.automatedConditionsColumns = [
      {
        field: 'ConditionType', title: 'Condition Type', headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'ConditionName', title: 'Condition Name', headerAttributes: {
        style: "font-weight: bold"
      }
      }
    ];

    vm.kendoSplitterOptions = {
      panes: "[ {size:'50%'}, {size:'50%'}]",
      orientation: 'vertical'
    };

    vm.launchMap = launchMap;

    vm.lowerLeftGridDisplay = '';

    vm.myModalService = modalService;

    vm.onDataBound = onDataBound;

    vm.onGridDoubleClick = onGridDoubleClick;

    vm.onKeynavigation = onKeynavigation;

    vm.onRowSelected = onRowSelected;

    vm.performFieldSearch = performFieldSearch;

    vm.personaAccessToFieldsColumns = [
      {
        field: 'Persona', title: 'Persona', headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'Rights', title: 'Rights', headerAttributes: {
        style: "font-weight: bold"
      }
      }
    ];

    vm.personaAccessToLoansColumns = [
      {
        field: 'Persona', title: 'Persona', headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'AccessToLoans', title: 'Persona Access to Loans', headerAttributes: {
        style: "font-weight: bold"
      }
      },
    ];

    vm.populateFieldId = populateFieldId;

    vm.resizeKendoSplitter = resizeKendoSplitter;

    vm.searchFieldsKendo = {
      id1: '',
      id2: '',
      id3: ''
    };

    vm.searchFieldFnForRestApi = searchFieldFnForRestApi;

    //Search History
    vm.searchHistory = [];

    vm.searchHistoryClicked = searchHistoryClicked;

    vm.searchHistoryOptions = searchHistoryOptions;

    vm.searchResultRequestPayload = {
      'FieldData': [],
      'Paging': 'false',
      //'PageIndex': '0', //<!—only needed if Paging is true -->
      //'PageSize': '20', //<!—only needed if Paging is true -->
      'Sort': 'false'
      //“FilterItem”:some string <!—can be avoided if no filter item is there -->
    };

    vm.searchResultColumn1 = [
      {
        field: 'name', title: 'Name', sortable: false, filterable: false, width: "35%", headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'type', title: 'Type', sortable: false, filterable: false, width: "35%", headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: 'status', title: 'Status', sortable: false, filterable: false, width: "35%", headerAttributes: {
        style: "font-weight: bold"
      }
      }

    ];
    //Search result column definition
    vm.searchResultColumn2 = [
      {
        field: "Name", title: "Name", sortable: true, filterable: false, width: "35%", headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: "Type", title: "Type", sortable: true, filterable: {
        cell: {
          template: function (input) {
            input.element.kendoDropDownList(
              {
                dataSource: vm.typesResultData,
                dataTextField: "type",
                dataValueField: "Type",
                optionLabel: 'Show All',
                animation: false
              });
          },
          showOperators: false
        }
      }, headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {
        field: "Status", title: "Status", sortable: true, filterable: {
        cell: {
          template: function (input) {

            input.element.kendoDropDownList(
              {
                dataSource: vm.statusResultData,
                dataTextField: "status",
                dataValueField: "Status",
                optionLabel: 'Show All',
                animation: false
              });
          },
          showOperators: false
        }
      }, headerAttributes: {
        style: "font-weight: bold"
      }
      },
      {field: 'Id', filterable: false, hidden: true}
    ];

    vm.searchResultColumn = vm.searchResultColumn1;

    vm.searchResultData = [
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''},
      {name: "", type: '', "status": ''}
    ];

    vm.selectedId = '';

    vm.showChannel = false;

    vm.showLower = true;

    vm.showOthers = false;

    vm.showSearchItem = false;

    vm.statusResultData = [{'status': ''}];

    vm.typesResultData = [{'type': ''}];

    vm.upperGrid = "upperGrid";

    vm.upperGridOptions = upperGridOptions;

    //Retrieve the data from local storage
    retrieveSavedState();

    //Save state
    saveFieldSearchState();

    function clearBottomPanel() {
      vm.showGrid = false;
      vm.showChannel = false;
      vm.bottomTextAreaTitle = 'Result Details:';
      vm.showOthers = false;
      vm.lowerLeftGridDisplay = 'analysislowerleft-inline';
    }

    function resetMainGrid() {
      var searchResultData = [];

      _.range(20).map(function () {
        searchResultData.push({
          name: null,
          type: null,
          status: null
        });
      });

      vm.searchResultData = searchResultData;

      vm.searchResultColumn = vm.searchResultColumn1;

      vm.resultTitle = null;


      while (vm.typesResultData !== null && vm.typesResultData.length > 0) {
        vm.typesResultData.pop();
      }

      while (vm.statusResultData !== null && vm.statusResultData.length > 0) {
        vm.statusResultData.pop();
      }
    }

    function clearAll() {
      for (var key in vm.searchFieldsKendo) {
        vm.searchFieldsKendo[key] = '';
      }
      resetMainGrid();
      clearBottomPanel();
      resizeKendoSplitter(null);
    }


    function conditionalFieldsClicked(fieldId) {
      vm.searchFieldsKendo = {id1: fieldId, id2: '', id3: ''};
      vm.performFieldSearch(fieldId);
    };

    function displaySearchItems() {
      vm.showSearchItem = true;
      vm.showGrid = false;
      var name = SearchService.selectedItems[0].Name;
      var type = SearchService.selectedItems[0].Type;
      var id = SearchService.selectedItems[0].Id;
      var settingData = {"Id": id, "Type": type};
      var searchDetailsPayload = {"FieldData": SearchService.searchFields.split(','), "SettingData": settingData};
      SearchDetailsService.getSearchDetailsPromise(searchDetailsPayload).then(function success(response) {
        if (type === FSCONSTANTS.FIELDTRIGGERS) {
          var actionDataPro = 'ActionData';
          var newFTResp = reformatDataForDisplay(actionDataPro, response);
          populateDetailsResult(actionDataPro, vm.fieldTriggerColumns, newFTResp, true, false, type);
        } else if (type === FSCONSTANTS.PERSONAFIELDS) {
          var assignRightsPro = 'AssignRights';
          populateDetailsResult(assignRightsPro, vm.personaAccessToFieldsColumns, response, true, false, type);
        } else if (type === FSCONSTANTS.PERSONALOANS) {
          var loanFilePro = 'LoanFileAccess';
          populateDetailsResult(loanFilePro, vm.personaAccessToLoansColumns, response, true, false, type);
        } else if (type === FSCONSTANTS.MILESTONECOMPLETION) {
          populateDetailsResult(null, null, response, false, false, type);
        } else if (type === FSCONSTANTS.LOANFORMPRINTING) {
          populateDetailsResult(null, null, response, false, false, type);
        } else if (type === FSCONSTANTS.INPUTFORMLIST) {
          var inputFormListPro = "FormList";
          populateDetailsResult(inputFormListPro, vm.inputFormListColumns, response, true, false, type)
        } else if (type === FSCONSTANTS.PIGGYBACKLOAN) {
          populateDetailsResult(null, null, response, false, true, type);
        } else if (type === FSCONSTANTS.PRINTAUTOSELECTION) {
          populateDetailsResult(null, null, response, false, false, type);
        } else if (type == FSCONSTANTS.ALERTS) {
          populateDetailsResult(null, null, response, false, true, type);
        } else if (type === FSCONSTANTS.LOANCUSTOMFIELDS) {
          populateDetailsResult(null, null, response, false, true, type);
        } else if (type === FSCONSTANTS.HTMLEMAILTMPLS) {
          populateDetailsResult(null, null, response, false, true, type);
        } else if (type === FSCONSTANTS.COMPANYSTATUSONLINE) {
          populateDetailsResult(null, null, response, false, true, type);
        } else if (type === FSCONSTANTS.AUTOCONDITIONS) {
          var autoConditionsPro = 'FieldEvents';
          populateDetailsResult(autoConditionsPro, vm.automatedConditionsColumns, response, true, false, type);
        } else if (type === FSCONSTANTS.FIELDDATAENTRY) {
          var newResp = reformatDataForDisplay('FieldRules', response);
          populateDetailsResult('FieldRules', vm.fieldDataEntryColumns, newResp, true, false, type);
        } else if (type === FSCONSTANTS.LOCKFIELDS) {
          populateDetailsResult(null, null, response, false, true, type);
        } else if (type === FSCONSTANTS.BORROWERCUSTOMFIELDS) {
          populateDetailsResult('CustomData', null, response, false, true, type);
        } else if (type === FSCONSTANTS.BUSINESSCUSTOMFIELDS) {
          populateDetailsResult('CustomData', null, response, false, true, type);
        } else if (type === FSCONSTANTS.TPOCUSTOMFIELDS) {
          populateDetailsResult('CustomData', null, response, false, true, type);
        }

      }, function error(reason) {
          applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE + JSON.stringify(reason.data));
          if (!vm.doubleClicked && reason.status === 404 &&
          reason.data.details === 'Can not find the rule associated with field search rule id ' + settingData.Id) {
          // REST Status 404 Rule Not Found ie. for Invalid RuleID.
          alert('Rule deleted in current session');
        }
      });

      //Have to call this if change event is declared in gridOptions.
      //For now, it is not needed as the change event is declared in the HTML template
      // $scope.$digest();
    }

    function doubleClickCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode === 1) { // ErrorCode = 1 is for Invalid RuleID.
          applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE +
          'Response Error From Encompass Interaction:' + "Rule is deleted from current session");
        return; //we are not displaying alert now. As it display one from single click /  keyboard nav.
      }
      else if (param.ErrorCode != 0) {
          applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE +
          'Response Error From Encompass Interaction:' + param.ErrorCode);
          alert('Response Error From Encompass Interaction: ' + param.ErrorCode);
      }
    }

    function findSearchFieldID(inputId) {
      //window.location.href = "http://fieldsearch.elliemae.com/;ruleType:FindFieldID;ruleParam:" + inputId;
      //TODO: Thin in Thick
      vm.clickedInputId = inputId;
      encompass.openBusinessRuleFindFieldDialog(null, vm.populateFieldId);
    }

    function launchMap() {
      vm.searchFieldFn();
      $window.open('http://10.112.106.11/vis/');
    }

    function onDataBound(e) {
      // check if there was a row that was selected
      if (vm.selectedId == '')
        return;

      var view = this.dataSource.view(); // get all the rows

      for (var i = 0; i < view.length; i++) {
        // iterate through rows
        if (view[i].id == vm.selectedId) {
          // get the grid
          var grid = e.sender; // get the grid
          // find row with the selectedId
          grid.select(grid.table.find("tr[data-uid='" + view[i].uid + "']"));
          break;
        }
      }
    }

    var DELAY = 400,
      clicks = 0,
      timer = null;

    $scope.$on("kendoWidgetCreated", function ($event, widget) {
      if (widget === vm.upperGrid) {
        vm.upperGrid.element.on('click', function (e) {
          clicks++;  //count clicks
           if (clicks === 1) {
            timer = setTimeout(function () {
              clicks = 0;
              vm.onRowSelected(e);
            }, DELAY);
          }
          else {
            clearTimeout(timer);  //prevent single-click action
            clicks = 0;
            vm.onGridDoubleClick(e);
          }
        })
        vm.upperGrid.element.on('dblclick', function (e) {
          e.preventDefault();  //cancel system double-click event
        });
      }
    });

    function onGridDoubleClick($event) {
      try {
        //var grid = $(event.target).closest('.k-grid').data('kendoGrid');
        vm.doubleClicked = true;
        var selectedRows = vm.upperGrid.select();
        var selectedDataItems = [];
        for (var i = 0; i < selectedRows.length; i++) {
          var dataItem = vm.upperGrid.dataItem(selectedRows[i]);
          selectedDataItems.push(dataItem);
        }
        SearchService.selectedItems = selectedDataItems;
        vm.SelectedId = SearchService.selectedItems[0].id;
        var timer = setTimeout(function () {
          clearBottomPanel();
          vm.displaySearchItems();
        }, 200);

        var ruleId = selectedDataItems[0].Id;
        var jsonParams = "{ FsRuleId: " + ruleId + "}";
        encompass.openFieldSearchRuleEditor(jsonParams, doubleClickCallback);
      }
      catch (e) {
        //applicationLoggingService.error(e.message);
          applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE + JSON.stringify(e.message));
      }
    }

    //function to handle keydown and keyup in kendo grid as kendo grid by default dosent' support row -keyboard navigation
    function onKeynavigation($event) {

      var curRow, newRow;

      //get currently selected row
      curRow = vm.upperGrid.select();

      //abort if no row selected
      if (!curRow.length)
        return;

      //get newRow up or down.
      if ($event.which == 38) {
        newRow = curRow.prev();
      } else if ($event.which == 40) {
        newRow = curRow.next();
      } else {
        return;
      }
      //Top or Bottom exceeded, abort.
      if (!newRow.length)
        return;
      //Select new row
      vm.upperGrid.select(newRow);
      //Call the row selected event to display details
      vm.onRowSelected($event);
    }

    var currentdataUid = null;
    var selecteddataUid;

    function onRowSelected(kendoEvent) {
      if (vm.upperGrid.select !== undefined && rowClicked == true) {
        var selectedRows = vm.upperGrid.select();
        if (selectedRows.length > 0) {
          var selectedDataItems = [];
          for (var i = 0; i < selectedRows.length; i++) {
            var dataItem = vm.upperGrid.dataItem(selectedRows[i]);
            selecteddataUid = dataItem.uid;
            selectedDataItems.push(dataItem);
          }
          SearchService.selectedItems = selectedDataItems;
          vm.SelectedId = SearchService.selectedItems[0].id;
          clearBottomPanel();
          vm.displaySearchItems();
          vm.doubleClicked = false;
        }
      }
      rowClicked = false;
    }

    function performFieldSearch(fieldIds) {
      SearchService.searchFields = fieldIds;
      searchFieldFnForRestApi();
    }

    function populateFieldId(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode != 0) {
        applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE +
        'Response Error From Encompass Interaction:' +param.ErrorCode);
        alert('Response Error From Encompass Interaction:' + param.ErrorCode);
      } else {
        vm.searchFieldsKendo[vm.clickedInputId] = param.FieldId;
      }
    }

    function populateDetailsResult(dataPro, usedColumns, response, displayGrid, showOthers, type) {
      var srtd = 'SearchResultTypeData';
      var channelPro = 'Channels';
      var condFldPro = 'ConditionFields';
      var fieldIdPro = 'FieldId';
      var fieldIdDescPro = 'FieldDescription';
      var ruleCondPro = 'RuleCondition';
      var fldDataPro = 'FieldData';
      var resultFldsPro = 'ResultFields';
      var alertPro = 'Alert';
      var customPro = 'CustomField';
      var htmlEmailTmplPro = 'Template';

      vm.bottomTextAreaTitle = response[srtd]['Name'] || 'Result Details:';
      vm.lowerLeftGridDisplay = 'analysislowerleft-inline';

      if (!showOthers) {
        vm.channel = 'Channel: ' + response[srtd][channelPro];
        vm.conditionFields = _.pluck(response[srtd][condFldPro], fieldIdPro);
        vm.fieldIdDescs = _.pluck(response[srtd][condFldPro], fieldIdDescPro);
        vm.ruleCondition = 'Rule Condition: ' + response[srtd][ruleCondPro];
        vm.resultFields = _.pluck(response[srtd][resultFldsPro], fieldIdPro);
        vm.resultFieldIdDesc = _.pluck(response[srtd][resultFldsPro], fieldIdDescPro);
        vm.showGrid = displayGrid;
        vm.showOthers = showOthers;
        vm.showChannel = true;
        vm.lowerLeftGridDisplay = vm.showGrid ? 'analysislowerleft' : 'analysislowerleft-inline';

        if (vm.showGrid) {
          /* remove all from Field Tabs before populating new stuff */
          while (vm.fieldTabs !== null && vm.fieldTabs.length > 0) {
            vm.fieldTabs.pop();
          }

          if (response[fldDataPro] !== null) {
            //The searched field ids are not returned for Input Form List, automated conditions and Persona Access to Loans
            if (type === FSCONSTANTS.PERSONAFIELDS || type === FSCONSTANTS.FIELDDATAENTRY || type === FSCONSTANTS.FIELDTRIGGERS) {
              _.each(response[fldDataPro], function (fieldItem) {
                vm.fieldTabs.push({
                  fieldId: fieldItem[fieldIdPro],
                  fieldData: fieldItem[dataPro],
                  fieldColumns: usedColumns
                });
              });
            } else {
              var responseFieldData = [];
              var searchedIds = SearchService.searchFields.split(',');
              if (type === FSCONSTANTS.AUTOCONDITIONS) {
                responseFieldData = response[fldDataPro][dataPro];
              } else if (type === FSCONSTANTS.INPUTFORMLIST) {
                responseFieldData = response[dataPro];
              } else {
                responseFieldData = response[fldDataPro][0][dataPro]
              }
              _.each(searchedIds, function (fieldId) {
                vm.fieldTabs.push({
                  fieldId: fieldId,
                  fieldData: responseFieldData,
                  fieldColumns: usedColumns
                });
              });
            }
          } else {
            /* When the reponse is null, we still show searched field ids and fake data in bottom tabs */
            _.map(SearchService.searchFields.split(','), function (fieldId) {
              vm.fieldTabs.push({
                fieldId: fieldId,
                fieldData: [{title: 'No Results Found'}],
                fieldColumns: [{field: 'title', title: '&nbsp;'}]
              });
            });
          }
        }
      } else {
        vm.showOthers = showOthers;
        vm.showChannel = false;
        vm.textHtml = '';
        vm.analysisShowOthersHtml = "analysisshowothershtml";
        if (type === FSCONSTANTS.PIGGYBACKLOAN) {
          var verf = response[srtd]['Verifications'];
          if (verf == null) {
            verf = '';
          }
          vm.textHtml = 'Field IDs: ' + response[srtd]['Fields'] + '<br><br>' +
          'Verifications: ' + verf;
        } else if (type == FSCONSTANTS.ALERTS) {
          //TODO: Waiting for platform about how the workflow alert could be retrieved.
          var alertType = response[srtd]['AlertType'];
          if (alertType === 'CustomAlert') {
            var alertCustom = response[srtd]['AlertCustom']
            vm.textHtml = 'Alert: ' + alertCustom['AlertName'] + '<br><br>' +
            'Trigger Date Field ID: ' + alertCustom['TriggerDateFieldID'] + '<br><br>' +
            'Conditions: ' + alertCustom['Conditions'];
          } else if (alertType === 'RegulationAlert') {
            var alertRegulation = response[srtd]['AlertRegulation'];
            var fieldsData = alertRegulation['Fields'];
            var fieldsHtml = '';
            _.each(fieldsData, function (eachData) {
              fieldsHtml += 'Field ID: ' + eachData['FieldId'] + '; '
              + 'Field Description: ' + eachData['FieldDescription'] + '<br><br>';
            });
            vm.textHtml = 'Alert: ' + alertRegulation['AlertName'] + '<br><br>' + fieldsHtml;
          }
        } else if (type === FSCONSTANTS.LOANCUSTOMFIELDS) {
          var custField = response[srtd][customPro];
          if (custField !== null) {
            var fieldId = custField['FieldId']
            vm.textHtml = 'Field ID: ' + fieldId + '<br><br>' +
            'Description: ' + custField['Description'] + '<br><br>' +
            'Calculation: ' + fieldId + '=' + custField['Calculation'];
          }
        } else if (type === FSCONSTANTS.COMPANYSTATUSONLINE) {
          vm.textHtml = 'Trigger Fields: ' + response[srtd]['TriggerFields'] + '<br><br>' +
          'Email Templates: ' + response[srtd]['EmailTemplates'];
        } else if (type === FSCONSTANTS.HTMLEMAILTMPLS) {
          var contentFields = response[srtd][htmlEmailTmplPro]['Content'];
          var contentResult = '';
          if (contentFields != null) {
             _.each(contentFields, function (eachContent,index) {
              if ((contentFields.length - index) === 1)
                contentResult += eachContent['Field'] ;
              else
              contentResult += eachContent['Field'] + '; '
            });
          } else contentResult = '';

          vm.textHtml = 'Template Type: ' + response[srtd][htmlEmailTmplPro]['Type'] + '<br><br>' +
          'Template Name: ' + response[srtd][htmlEmailTmplPro]['Name'] + '<br><br>' +
          'Content Fields: ' + contentResult;

        } else if (type === FSCONSTANTS.LOCKFIELDS) {
          var respData = [], tabName = '';
          if (response[srtd]['LockRequestForm'] != null && response[srtd]['LockRequestForm'].length != 0) {
            respData = response[srtd]['LockRequestForm'];
            tabName = 'Lock Request Form';

            _.each(respData, function (eachItem, index) {
              vm.textHtml += 'Original Field ID: ' + respData[index]['AdditionalField'] + '; ' +
              'Description: ' + respData[index]['Description'] + '; ' +
              'New Field ID: ' + respData[index]['NewFieldId'] + '; ' +
              'Type: ' + respData[index]['Type'] + '<br><br>';
            });

            vm.textHtml += tabName + '<br><br>';
          }

          if (response[srtd]['LoanSnapshot'] != null && response[srtd]['LoanSnapshot'].length != 0) {
            respData = response[srtd]['LoanSnapshot'];
            tabName = 'Loan Snapshot';

            _.each(respData, function (eachItem, index) {
              vm.textHtml += 'Original Field ID: ' + respData[index]['AdditionalField'] + '; ' +
              'Description: ' + respData[index]['Description'] + '; ' +
              'New Field ID: ' + respData[index]['NewFieldId'] + '; ' +
              'Type: ' + respData[index]['Type'] + '<br><br>';
            });

            vm.textHtml += tabName + '<br><br>';
          }

        } else if (type === FSCONSTANTS.BORROWERCUSTOMFIELDS ||
          type === FSCONSTANTS.BUSINESSCUSTOMFIELDS) {
          var borrowerData = response[srtd][dataPro];
          if (borrowerData != null) {
            _.each(borrowerData, function (eachItem, index) {
              var tabName = 'Custom Tab Name: ' + eachItem['CustomTabName'];
              var customFields = eachItem['CustomFields'];
              var aLineData = '';
              _.each(customFields, function (eachData, dataIndex) {
                var commonData = 'Field Description: ' + eachData['FieldDescription'] + '; ' +
                  'Field Type: ' + eachData['FieldType'] + '; ';
                if (type === FSCONSTANTS.BORROWERCUSTOMFIELDS) {
                  //NGENC-1876
                  var blfId = eachData['LoanFieldId'];
                  var blfDesc = eachData['LoanFieldDescription'];
                  var bbWays = eachData['BothWays'];
                  if (blfId === '') {
                    blfDesc = '';
                    bbWays = '';
                  }
                  aLineData += commonData +
                  'Loan Field ID: ' + blfId + '; ' +
                  'Loan Field Description: ' + blfDesc + '; ' +
                  'Both Ways: ' + bbWays + '<br><br>';
                } else {
                  aLineData += commonData + '<br><br>';
                }
              });
              vm.textHtml += tabName + '<br><br>' + aLineData;
            })
          }

          //Data from CustomCategoryData
          if (type === FSCONSTANTS.BUSINESSCUSTOMFIELDS) {
            var customData = response[srtd]['CustomCategoryData'];
            if (customData != null) {
              _.each(customData, function (eachCategory, cIndex) {
                var category = eachCategory['Category'];
                var categoryFld = eachCategory['CategoryField'];
                var aData = '';
                _.each(categoryFld, function (eachData, dataIndex) {
                  var lfId = eachData['LoanFieldId'];
                  var lfDesc = eachData['LoanFieldDescription'];
                  var bWays = eachData['BothWays'];
                  if (lfId === '') {
                    lfDesc = '';
                    bWays = '';
                  }
                  aData +=
                    'Field Description: ' + eachData['FieldDescription'] + '; ' +
                    'Field Type: ' + eachData['FieldType'] + '; ' +
                    'Loan Field ID: ' + eachData['LoanFieldId'] + '; ' +
                    'Loan Field Description: ' + lfDesc + '; ' +
                    'Both Ways: ' + bWays + '<br><br>';
                });

                vm.textHtml += 'Category: ' + category + '<br><br>' + aData;
              })
            }
          }
        } else if (type === FSCONSTANTS.TPOCUSTOMFIELDS) {
          var tpoData = response[srtd][dataPro];
          if (tpoData != null) {
            _.each(tpoData, function (eachItem, index) {
              var tpoTabName = 'Custom Tab Name: ' + eachItem['CustomTabName'];
              var tpoCustomFields = eachItem['CustomFields'];
              var aLineData = '';
              _.each(tpoCustomFields, function (eachData, dataIndex) {
                var commonData = 'Field Description: ' + eachData['FieldDescription'] + '; ' +
                  'Field Type: ' + eachData['FieldType'] + '; ';
                var tpoId = eachData['LoanFieldId'];
                var tpoDesc = eachData['LoanFieldDescription'];
                //Commented bothways as per NGENC-2226 Comment
                //var tpobWays = eachData['BothWays'];
                if (tpoId === '') {
                  tpoDesc = '';
                  //Commented bothways as per NGENC-2226 Comment
                  //tpobWays = '';
                }
                aLineData += commonData +
                'Loan Field ID: ' + tpoId + '; ' +
                'Loan Field Description: ' + tpoDesc + '<br><br>';
                //Commented bothways as per NGENC-2226 Comment
                //'Both Ways: ' + tpobWays + '<br><br>';
              });
              vm.textHtml += tpoTabName + '<br><br>' + aLineData;
            })
          }

        }
      }
      //NGENC-2750: Comment out. Cause perf issue.
      //applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE + vm.textHtml);
      resizeKendoSplitter(null);
    }

    function populateStatusFromResult() {
      /* Empty Array */

      while (vm.statusResultData !== null && vm.statusResultData.length > 0) {
        vm.statusResultData.pop();
      }
      /* Populate new Values */
      _(vm.searchResultData).pluck('Status').uniq().value().map(function (item) {
        vm.statusResultData.push({status: item});
      });
    }

    function populateTypesFromResult() {
      /* Empty Array */

      while (vm.typesResultData !== null && vm.typesResultData.length > 0) {
        vm.typesResultData.pop();
      }
      /* Populate new Values */
      _(vm.searchResultData).pluck('Type').uniq().sortBy(function (item) {
        return item;
      }).value().map(function (item) {
        vm.typesResultData.push({type: item})
      });
    }

    //Reformatting data for Field Data Entry and Field Trigger rule as WPS returns data in a random order.
    //For each searched field id, get its data from WPS response.
    function reformatDataForDisplay(dataPro, resp) {
      var searchedIds = SearchService.searchFields.split(',');
      var reformatResult = [];
      if (resp['FieldData'] !== null) {
        //Loop each searched ids
        _.each(searchedIds, function (fieldId, index) {
          var foundData = _.find(resp['FieldData'], function (fieldItem) {
            if (fieldItem["FieldId"].toUpperCase() === fieldId.toUpperCase()) {
              return fieldItem;
            }
          });

          //When the field id appears in advance coding, but not in section 4 of the rule add/edit screen
          if (typeof foundData === 'undefined' || foundData === null) {
            foundData = {};
            foundData["FieldId"] = fieldId;
            foundData[dataPro] = null;
          }
          reformatResult.push(foundData);
        });

        var newResponse = {};
        newResponse['SearchResultTypeData'] = resp['SearchResultTypeData'];
        newResponse['FieldData'] = reformatResult;
        return newResponse;
      } else return resp;
    }

    //Function to process 'resize' event triggered by kendo splitter
    function resizeKendoSplitter(kendoEvent) {
      setTimeout(function () {
        SearchService.broadcastSearch(FSCONSTANTS.SPLITTEREVENT);
      }, 0);
    }

    function retrieveSavedState() {
      var savedSearchItemsData = SaveStateService.getSearchItemsState();
      var savedSearchResultData = SaveStateService.getSearchResultState();
      var savedSearchFieldIds = SaveStateService.getStateWithName(FSCONSTANTS.LSSEARCHFIELDIDSKEY);
      var savedSearchHistory = SaveStateService.getStateWithName(FSCONSTANTS.LSSEARCHHISTORYKEY);
      var savedTextArea = SaveStateService.getStateWithName(FSCONSTANTS.LSTEXTAREAKEY);
      var savedTextAreaOthers = SaveStateService.getStateWithName(FSCONSTANTS.LSTEXTAREAOTHERSKEY);
      SearchService.searchFields = _(savedSearchFieldIds).values().compact().value().join(',');
      if (localStorageService.isSupported) {

        //Retrieve the bottom grid and tab data
        if (savedSearchItemsData !== null && typeof savedSearchItemsData !== 'undefined') {
          vm.showGrid = savedSearchItemsData[0];
          vm.lowerLeftGridDisplay = vm.showGrid ? 'analysislowerleft' : 'analysislowerleft-inline';
          vm.fieldTabs = savedSearchItemsData[1];
          vm.showSearchItem = savedSearchItemsData[2];
        }

        //Retrieve the state for bottom text area
        if (savedTextArea !== null && typeof savedTextArea !== 'undefined') {
          vm.bottomTextAreaTitle = savedTextArea[0] || 'Result Details:';
          vm.channel = savedTextArea[1];
          vm.resultFields = savedTextArea[2];
          vm.ruleCondition = savedTextArea[3];
          vm.conditionFields = savedTextArea[4];
          vm.showChannel = savedTextArea[5];
          vm.fieldIdDescs = savedTextArea[6];
          vm.resultFieldIdDesc = savedTextArea[7];
        }

        //Retrieve the state for bottom text area -- for vm.showOthers
        if (savedTextAreaOthers !== null && typeof savedTextAreaOthers !== 'undefined') {
          vm.showOthers = savedTextAreaOthers[0];
          vm.textHtml = savedTextAreaOthers[1];
          vm.analysisShowOthersHtml = "analysisshowothershtml";
        }

        //Retrieve the state fot the top grid
        if (savedSearchResultData !== null && typeof savedSearchResultData !== 'undefined') {
          vm.resultTitle = savedSearchResultData[1];
          if (vm.resultTitle !== null) {
            vm.searchResultData = savedSearchResultData[0];
            vm.statusResultData = savedSearchResultData[2];
            vm.SelectedId = savedSearchResultData[3];
            vm.typesResultData = savedSearchResultData[4];
            vm.dataInLocalStorage = true;
          }
        }

        //Retrieve the state for search field ids inputs
        if (savedSearchFieldIds !== null && typeof savedSearchFieldIds !== 'undefined') {
          for (var key in savedSearchFieldIds) {
            vm.searchFieldsKendo[key] = savedSearchFieldIds[key];
          }
        }

        //Retrieve the state for search history
        if (savedSearchHistory !== null && typeof savedSearchHistory !== 'undefined') {
          vm.searchHistory = savedSearchHistory;
        }
      } else {
        alert('Warning: Local Storage is not supported in this browser!');
      }
    }

    //Save state
    function saveFieldSearchState() {
      if (localStorageService.isSupported) {
        //Save state for bottom text area
        $scope.$watchCollection('[vm.bottomTextAreaTitle,vm.channel,vm.resultFields,vm.ruleCondition,vm.conditionFields,vm.showChannel,vm.fieldIdDescs,vm.resultFieldIdDesc]', function (newValues) {
          SaveStateService.saveStateWithName(FSCONSTANTS.LSTEXTAREAKEY, newValues);
        });

        //Save state for bottom text area -- vm.showOthers
        $scope.$watchCollection('[vm.showOthers,vm.textHtml]', function (newValues) {
          SaveStateService.saveStateWithName(FSCONSTANTS.LSTEXTAREAOTHERSKEY, newValues);
        });

        //Save state for bottom tab and grid
        $scope.$watchCollection('[vm.showGrid,vm.fieldTabs,vm.showSearchItem]', function (newValues) {
          SaveStateService.saveSearchItemsState(newValues);
        });

        //Save state for search field ids inputs
        $scope.$watchCollection('vm.searchFieldsKendo', function (newSearchFieldsKendo, oldSearchFieldsKendo) {
          SaveStateService.saveStateWithName(FSCONSTANTS.LSSEARCHFIELDIDSKEY, newSearchFieldsKendo);
        });

        //Save state for search history
        $scope.$watchCollection('vm.searchHistory', function (newSearchHistory, oldSearchHistory) {
          SaveStateService.saveStateWithName(FSCONSTANTS.LSSEARCHHISTORYKEY, newSearchHistory)
        });

        //Save state for upper grid data
        $scope.$watchCollection('[vm.searchResultData,vm.resultTitle,vm.statusResultData,vm.SelectedId,vm.typesResultData]', function (newResultValues) {
          SaveStateService.saveSearchResultState(newResultValues);
        });
      } else {
        alert('Warning: Local Storage is not supported in this browser!');
      }

    }

    function searchFieldFnForRestApi() {
      /* Clear Bottom Panel */
      clearBottomPanel();
      /* Clear Grid */
      resetMainGrid();
      var fieldIds = '';
      var fieldIdArr = [];
      performSearch = true;

      for (var key in vm.searchFieldsKendo) {
        var value = vm.searchFieldsKendo[key];
        if (!!value && value != '') {
          if (fieldIdArr.indexOf(value) == -1) {
            fieldIdArr.push(value);
            if (fieldIds != '')
              fieldIds += "," + value;
            else fieldIds += value;
          }
          else {
            // duplicate field id's
            performSearch = false;
            //call modalService method to display warning message
            modalService.showModalDialog(FSCONSTANTS._FldSearchMessageType, FSCONSTANTS._DuplicateIdMessage, null, null, null);
            break;
          }
        }
      }
      if (fieldIdArr.length == 0) {
        //empty field Array
        performSearch = false;
        modalService.showModalDialog(FSCONSTANTS._FldSearchMessageType, FSCONSTANTS._NoFldIdMessage, null, null, null);
      }
      if (performSearch) {
        SearchService.searchFields = fieldIds;
        vm.searchResultRequestPayload.FieldData = fieldIdArr;
        //NGENC-2750: Comment out. Cause perf issue.
        //applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE + "Payload:" + vm.searchResultRequestPayload.FieldData);
        //alert("Payload:"+vm.searchResultRequestPayload.FieldData);
        SearchResultService.getSearchResultPromise(vm.searchResultRequestPayload).then(function success(searchResultObject) {

          //TODO: Adding to the log
          //alert('success;'+JSON.stringify(searchResultObject));

          //Update search history
          var searchHis = vm.searchHistory;
          searchHis.unshift({searchedItem: SearchService.searchFields});
          vm.searchHistory = searchHis;

          //Update search result title
          var fieldData = searchResultObject.FieldData;
          var fieldIDsType = '';
          _.each(fieldData, function (fieldIdObj, index) {
            var tempId = fieldIdObj.FieldId + ' (' + fieldIdObj.FieldType;
            if (index + 1 != fieldData.length) {
              fieldIDsType += tempId + '),';
            } else fieldIDsType += tempId + ')';
          });
          vm.resultTitle = "Field ID " + fieldIDsType;

          //Update top grid data
          vm.searchResultData = searchResultObject.SettingData;

          vm.searchBusinessRules = searchResultObject.TotalRules;
          //Check and display BusinessRules message
          if ((vm.searchBusinessRules !== null) && (vm.searchBusinessRules == 0)) {
            if (fieldIdArr.length == 1) {
              vm.warningMessage = FSCONSTANTS._OneInvalidBusRuleMessage;
              vm.type = FSCONSTANTS._FldSearchMessageType;
              vm.warningMessage = vm.warningMessage.replace('1%', fieldIdArr[0]);
              modalService.showModalDialog(vm.type, vm.warningMessage, null, null, null);
            }
            else if (fieldIdArr.length == 2) {
              vm.warningMessage = FSCONSTANTS._TwoInvalidBusRuleMessage;
              vm.type = FSCONSTANTS._FldSearchMessageType;
              vm.warningMessage = vm.warningMessage.replace('1%', fieldIdArr[0]);
              vm.warningMessage = vm.warningMessage.replace('2%', fieldIdArr[1]);
              modalService.showModalDialog(vm.type, vm.warningMessage, null, '170', null);
            }
            else if (fieldIdArr.length == 3) {
              vm.warningMessage = FSCONSTANTS._ThreeInvalidBusRuleMessage;
              vm.type = FSCONSTANTS._FldSearchMessageType;
              vm.warningMessage = vm.warningMessage.replace('1%', fieldIdArr[0]);
              vm.warningMessage = vm.warningMessage.replace('2%', fieldIdArr[1]);
              vm.warningMessage = vm.warningMessage.replace('3%', fieldIdArr[2]);
              modalService.showModalDialog(vm.type, vm.warningMessage, null, '170', null);
            }
          }

          //Update the status and type dropdown
          if (vm.searchResultData !== null) {
            populateStatusFromResult();
            populateTypesFromResult();
            resizeKendoSplitter(null);
          }
          vm.searchResultColumn = vm.searchResultColumn2;

        }, function error(reason) {

          applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE + JSON.stringify(reason.data));
          if (typeof reason === 'undefined' || reason === null) {
            return void 0;
          }
          if (typeof reason.data === 'undefined' || reason.data === null) {
            return void 0;
          }
          if (typeof reason.data.details === 'undefined' || reason.data.details === null) {
            return void 0;
          }
          var errorMessage = JSON.stringify(reason.data.details);
          try {
            if (fieldIdArr.length === 1) {
              //Handle error cases for one fieldId
              //Invalid Fieldid
              if (errorMessage.indexOf("Invalid") !== -1) {
                vm.warningMessage = FSCONSTANTS._OneInvalidFldMessage;
                vm.type = FSCONSTANTS._FldSearchMessageType;
                vm.warningMessage = vm.warningMessage.replace('1%', fieldIdArr[0]);
                modalService.showModalDialog(vm.type, vm.warningMessage, null, null, null);
              }
            }
            else if (fieldIdArr.length === 2) {
              //Handle error cases for two fieldIds
              //Handle the case where both fieldId's are invalid
              var invalidFieldIdArr = [];
              var arrayMessage = errorMessage.split("),");
              if (arrayMessage.length !== 0) {
                for (var i = 0; i < fieldIdArr.length; i++) {
                  if (arrayMessage[i].indexOf("Invalid") !== -1)
                    invalidFieldIdArr.push(fieldIdArr[i]);
                }
                if (invalidFieldIdArr.length == 2) {

                  vm.warningMessage = FSCONSTANTS._TwoInvalidFldsMessage;
                  vm.type = FSCONSTANTS._FldSearchMessageType;
                  vm.warningMessage = vm.warningMessage.replace('1%', invalidFieldIdArr[0]);
                  vm.warningMessage = vm.warningMessage.replace('2%', invalidFieldIdArr[1]);

                  modalService.showModalDialog(vm.type, vm.warningMessage, null, null, null);
                }
                else if (invalidFieldIdArr.length == 1) {
                  vm.warningMessage = FSCONSTANTS._OneInvalidFldMessage;
                  vm.type = FSCONSTANTS._FldSearchMessageType;
                  vm.warningMessage = vm.warningMessage.replace('1%', invalidFieldIdArr[0]);
                  modalService.showModalDialog(vm.type, vm.warningMessage, null, null, null);
                }
              }
            }
            else if (fieldIdArr.length === 3) {
              //Handle error cases for three fieldIds
              var invalidFieldIdArr = [];
              var arrayMessage = errorMessage.split("),");
              if (arrayMessage.length !== 0) {
                for (var i = 0; i < fieldIdArr.length; i++) {
                  if (arrayMessage[i].indexOf("Invalid") !== -1)
                    invalidFieldIdArr.push(fieldIdArr[i]);
                }
                if (invalidFieldIdArr.length == 3) {
                  vm.warningMessage = FSCONSTANTS._ThreeInvalidFldsMessage;
                  vm.type = FSCONSTANTS._FldSearchMessageType;
                  vm.warningMessage = vm.warningMessage.replace('1%', invalidFieldIdArr[0]);
                  vm.warningMessage = vm.warningMessage.replace('2%', invalidFieldIdArr[1]);
                  vm.warningMessage = vm.warningMessage.replace('3%', invalidFieldIdArr[2]);
                  modalService.showModalDialog(vm.type, vm.warningMessage, null, null, null);
                }
                else if (invalidFieldIdArr.length == 2) {
                  vm.warningMessage = FSCONSTANTS._TwoInvalidFldsMessage;
                  vm.type = FSCONSTANTS._FldSearchMessageType;
                  vm.warningMessage = vm.warningMessage.replace('1%', invalidFieldIdArr[0]);
                  vm.warningMessage = vm.warningMessage.replace('2%', invalidFieldIdArr[1]);
                  modalService.showModalDialog(vm.type, vm.warningMessage, null, null, null);
                }
                else if (invalidFieldIdArr.length == 1) {
                  vm.warningMessage = FSCONSTANTS._OneInvalidFldMessage;
                  vm.type = FSCONSTANTS._FldSearchMessageType;
                  vm.warningMessage = vm.warningMessage.replace('1%', invalidFieldIdArr[0]);
                  modalService.showModalDialog(vm.type, vm.warningMessage, null, null, null);
                }
              }
            }
          }
          catch (e) {
            applicationLoggingService.log(FSCONSTANTS.LOGGINGNAMESPECAEVALUE + JSON.stringify(e.message));
          }
        })
      }
      ;
    }

    function searchHistoryClicked(event) {
      var grid = $(event.target).closest('.k-grid').data('kendoGrid');
      var selectedRows = grid.select();
      var dataItem = grid.dataItem(selectedRows[0]);
      if (dataItem && dataItem.searchedItem && dataItem.searchedItem != "") {
        var fieldIds = dataItem.searchedItem.split(',');
        vm.clearAll();
        vm.searchFieldsKendo = {id1: fieldIds[0], id2: fieldIds[1], id3: fieldIds[2]};
        vm.performFieldSearch(dataItem.searchedItem);
      }
    }

    function searchHistoryOptions() {
      return {
        dataSource: {
          data: vm.searchHistory
        },
        navigatable: true,
        scrollable: true,
        selectable: "row",
        columns: [{
          field: "searchedItem",
          headerAttributes: {
            style: "display: none"
          }
        }]
      };
    }

    function upperGridOptions() {
      return {
        dataSource: {
          data: vm.searchResultData
        },
        scrollable: true,
        sortable: true,
        selectable: true,
        change: function() {
          rowClicked = true;
        },
        filterable: {
          mode: "row"
        },

        dataBound: vm.onDataBound,

        columns: vm.searchResultColumn
      };
    }

    if (vm.dataInLocalStorage) {
      vm.searchResultColumn = vm.searchResultColumn2;
    }
  }
})();
