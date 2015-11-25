(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('pipelineAdvanceFilterController', PipelineAdvanceFilterController);

  /* @ngInject */
  function PipelineAdvanceFilterController(_, modalWindowService, PipelineDataStore, $rootScope, SetMenuStateService,
                                           PipelineFilterService, PipelineEventsConst, PipelineConst, $timeout, $anchorScroll) {
    var vm = this;
    vm.ds = PipelineDataStore;
    vm.readyFilters = [];
    vm.multiSelectInvalid = false;
    var dateRecuring = [{name: 'Current week', value: 'CurrentWeek'},
      {name: 'Current month', value: 'CurrentMonth'},
      {name: 'Previous week', value: 'PreviousWeek'},
      {name: 'Previous month', value: 'PreviousMonth'},
      {name: 'Next week', value: 'NextWeek'},
      {name: 'Next month', value: 'NextMonth'},
      {name: 'Is', value: 'Equals'},
      {name: 'Is not', value: 'NotEqual'},
      {name: 'Before', value: 'DateBefore'},
      {name: 'On or Before', value: 'DateOnOrBefore'},
      {name: 'After', value: 'DateAfter'},
      {name: 'On or After', value: 'DateOnOrAfter'},
      {name: 'Date Between', value: 'DateBetween'},
      {name: 'Date Not Between', value: 'DateNotBetween'},
      {name: 'Empty Date Field', value: 'EmptyDate'},
      {name: 'Non-empty Date Field', value: 'NotEmptyDate'}];
    var notDateRecurring = [{name: 'Today', value: 'Today'},
      {name: 'Year-to-date', value: 'YearToDate'},
      {name: 'Previous year', value: 'PreviousYear'},
      {name: 'Next year', value: 'NextYear'},
      {name: 'Last 7 days', value: 'Last7days'},
      {name: 'Last 15 days', value: 'Last15days'},
      {name: 'Last 30 days', value: 'Last30days'},
      {name: 'Last 60 days', value: 'Last60days'},
      {name: 'Last 90 days', value: 'Last90days'},
      {name: 'Last 180 days', value: 'Last180days'},
      {name: 'Last 365 days', value: 'Last365days'},
      {name: 'Next 7 days', value: 'Next7days'},
      {name: 'Next 15 days', value: 'Next15days'},
      {name: 'Next 30 days', value: 'Next30days'},
      {name: 'Next 60 days', value: 'Next60days'},
      {name: 'Next 90 days', value: 'Next90days'},
      {name: 'Next 180 days', value: 'Next180days'},
      {name: 'Next 365 days', value: 'Next365days'}];
    notDateRecurring = _.union(notDateRecurring, dateRecuring);

    var operatorOptions = {
      DATE: notDateRecurring,
      DATETIME: notDateRecurring,
      INTEGER: [
        {name: 'Is', value: 'Equals'},
        {name: 'Is not', value: 'NotEqual'},
        {name: 'Greater than', value: 'GreaterThan'},
        {name: 'Not greater than', value: 'NotGreaterThan'},
        {name: 'Less than', value: 'LessThan'},
        {name: 'Not less than', value: 'NotLessThan'},
        {name: 'Between', value: 'Between'},
        {name: 'Not between', value: 'NotBetween'}
      ],
      DECIMAL: [
        {name: 'Is', value: 'Equals'},
        {name: 'Is not', value: 'NotEqual'},
        {name: 'Greater than', value: 'GreaterThan'},
        {name: 'Not greater than', value: 'NotGreaterThan'},
        {name: 'Less than', value: 'LessThan'},
        {name: 'Not less than', value: 'NotLessThan'},
        {name: 'Between', value: 'Between'},
        {name: 'Not between', value: 'NotBetween'}
      ],
      STRING: [
        {name: 'Is (Exact)', value: 'IsExact'},
        {name: 'Is not', value: 'IsNot'},
        {name: 'Starts with', value: 'StartsWith'},
        {name: 'Doesn\'t starts with', value: 'DoesnotStartWith'},
        {name: 'Contains', value: 'Contains'},
        {name: 'Doesn\'t contain', value: 'DoesnotContain'}
      ],
      YN: [
        {name: 'Yes', value: 'Y'},
        {name: 'No', value: 'N'}

      ],
      DROPDOWN: [
        {name: 'is any of', value: 'IsAnyOf'},
        {name: 'is not any of', value: 'IsNotAnyOf'}
      ],
      DEFAULT: [
        {name: 'Contains', value: 'Contains'},
        {name: 'Equals', value: 'Equals'},
        {name: 'Not equal', value: 'NotEqual'},
        {name: 'Less than', value: 'LessThan'},
        {name: 'Greater than', value: 'GreaterThan'},
        {name: 'Not less than', value: 'NotLessThan'},
        {name: 'Not greater than', value: 'NotGreaterThan'}
      ]
    };
    vm.dateAllowedOnly = {
      'Equals': true,
      'NotEqual': true,
      'DateBefore': true,
      'DateOnOrBefore': true,
      'DateAfter': true,
      'DateOnOrAfter': true,
      'DateBetween': true,
      'DateNotBetween': true
    };
    var baseObj = {
      CriterionName: '',
      'Header': '',//Loan #
      'FieldID': '',
      'FieldType': '',//IsString
      OpType: 'Equals',
      ValueFrom: '',
      JointToken: 'and',
      'LeftParentheses': 0,
      'RightParentheses': 0,
      'ValueTo': '',
      allowClone: false,
      OperatorOptions: operatorOptions.DEFAULT
    };

    vm.addFilter = function (index) {
      var Obj = angular.copy(baseObj);
      vm.filters.splice(index + 1, 0, Obj);
      //Reset parenthesis list only if added filter in middle instead of end
      if ((index + 2) !== vm.filters.length) {
        var filterIndex = 0;
        _.each(vm.filters, function (filterItem) {
          if (filterIndex !== (index + 1)) {
            filterItem.parenStartList = _.map(filterItem.parenStartList, function (val) {
              if (val > index) {
                return ++val;
              } else {
                return val;
              }
            });
          }
          if (filterIndex > (index + 1)) {
            filterItem.parenEndList = _.map(filterItem.parenEndList, function (val) {
              if (val > index) {
                return ++val;
              } else {
                return val;
              }
            });
          }
          filterIndex++;
        });
      }
      vm.resizeGrid();
      $timeout(function () {
        //TODO: need to replace this with working $anchorScroll
        angular.element('#filterbox')[0].scrollTop = angular.element('#filterbox')[0].scrollHeight;
        $anchorScroll('filterbox'); //not working
      });
    };

    vm.removeFilter = function (index) {
      //Delete parenthesis associated with filter
      if (vm.filters[index].parenStartList && vm.filters[index].parenStartList.length !== 0) {
        var filterStartList = angular.copy(vm.filters[index].parenStartList);
        _.each(filterStartList, function (startItem) {
          vm.deleteParen(startItem, vm.filters[index], true);
        });
      }
      if (vm.filters[index].parenEndList && vm.filters[index].parenEndList.length !== 0) {
        var filterEndList = angular.copy(vm.filters[index].parenEndList);
        _.each(filterEndList, function (endItem) {
          vm.deleteParen(endItem, vm.filters[index], false);
        });
      }
      vm.filters.splice(index, 1);
      //Reset parenthesis lists
      _.each(vm.filters, function (filterItem) {
        filterItem.parenStartList = _.map(_.without(filterItem.parenStartList, index), function (val) {
          if (val < index) {
            return val;
          } else if (val > index) {
            return val - 1;
          }
        });
        filterItem.parenEndList = _.map(_.without(filterItem.parenEndList, index), function (val) {
          if (val < index) {
            return val;
          } else if (val > index) {
            return val - 1;
          }
        });
      });
      vm.resizeGrid();
      vm.onFilterItemReady();
    };

    vm.changeFilterBoxBorder = function (state, index) {
      vm.filterBoxClassName = state;
      vm.filterIndex = index;
    };

    vm.searchFilter = searchFilter;

    function searchFilter(index) {
      if (!vm.filters[index].FieldID && !vm.filters[index].Header) {
        return void 0;
      }
      var filter = _.findWhere(PipelineDataStore.FieldDefinition.items, {FieldId: vm.filters[index].FieldID});
      if (!filter) {
        if (typeof vm.filters[index].FieldID !== 'undefined') {
          modalWindowService.popupInformation.open({
            message: PipelineConst.UnavailableFieldIDMessage,
            title: 'Field Error'
          });
        }
        filter = angular.copy(baseObj);
      }
      dataLoad(filter, index);
      vm.onFilterItemReady();
    }

    vm.onDropComplete = function (index, obj) {
      if (obj.type === 'parentheses' || obj.type === 'leftParentheses' || obj.type === 'rightParentheses') {
        return false;
      }
      else {
        var otherObj = vm.filters[index];
        var otherIndex = vm.filters.indexOf(obj);
        swapProperty(obj, otherObj, 'parenEndList');
        swapProperty(obj, otherObj, 'parenStartList');
        swapProperty(obj, otherObj, 'parenColor');

        vm.filters[index] = obj;
        vm.filters[otherIndex] = otherObj;
      }
      vm.onFilterItemReady();
    };

    vm.onParanDropComplete = function (index, obj) {
      //Not allow to drop parenthesis while adding new filter
      if (vm.filters.length !== vm.readyFilters.length || vm.readyFilters.length < 2) {
        return;
      }

      var parenSel;
      var readyFilteIndex;

      if (obj.type === 'parentheses') {
        exprCreator(index, vm.filters);
        if (vm.filters[index].parenStartList.length > 0) {
          parenSel = _.min(vm.filters[index].parenStartList);
          readyFilteIndex = index;
        } else {
          readyFilteIndex = _.min(vm.filters[index].parenEndList);
          parenSel = _.max(vm.filters[readyFilteIndex].parenStartList);
        }
      }
      else if (obj.type === 'leftParentheses') {
        leftParenthesesDropped(index, obj);
        parenSel = obj.val;
        readyFilteIndex = index;
      }
      else if (obj.type === 'rightParentheses') {
        rightParenthesesDropped(index, obj);
        parenSel = index;
        readyFilteIndex = obj.val;
      }
      vm.onFilterItemReady();
      vm.removeParen(vm.readyFilters[readyFilteIndex], parenSel);
    };

    vm.deleteParen = function (value, filter, start) {
      var otherFilter = vm.readyFilters[value];
      var filterIndex = _.findIndex(vm.filters, {FieldID: filter.FieldID});
      if (start) {
        otherFilter.parenEndList.splice(otherFilter.parenEndList.indexOf(filterIndex), 1);
        filter.parenStartList.splice(filter.parenStartList.indexOf(value), 1);
      }
      else {
        otherFilter.parenStartList.splice(otherFilter.parenStartList.indexOf(filterIndex), 1);
        filter.parenEndList.splice(filter.parenEndList.indexOf(value), 1);
      }
      if (vm.filters.length === vm.readyFilters.length) {
        var filterCounter = 0;
        _.each(vm.readyFilters, function (readyFilterItem) {
          vm.filters[filterCounter].parenStartList = readyFilterItem.parenStartList;
          vm.filters[filterCounter].parenEndList = readyFilterItem.parenEndList;
          filterCounter++;
        });
      }
    };
    /*Changed Name from mouseOver to removeParen*/
    vm.removeParen = function (filter, selected) {

      if (typeof filter.parenColor !== 'undefined') {
        /*Remove other selected parenthesis when current is selected.*/
        _.each(vm.readyFilters, function (otherfilters) {
          if (otherfilters === filter) {
            filter.parenColor.selected = ((typeof selected === 'undefined') ? -1 : selected); // or exp (xx||'') will not work as 0 can be a value.
          }
          else {
            if (otherfilters.parenColor) {
              otherfilters.parenColor.selected = undefined;
            }
          }
        });
      }
    };

    vm.selectChange = function (filter) {
      if (filter.AdvFilterType !== 'YN') {
        filter.ValueFrom = '';
      }
      filter.ValueTo = '';
      //When operator is changed setting DisplayText of MultiSelect to SELECT text only from DROPDOWN field.
      if (filter.AdvFilterType === 'DROPDOWN') {
        filter.DropDownLabel = 'Select';
      }
      vm.validateMultiSelect();
    };

    function copyAdvancedFiltersToGrid() {
      PipelineDataStore.PipelineGridData.filters = _.map(vm.filters, function (f) {
        return {
          'CriterionName': f.CriterionName,
          'JointToken': f.JointToken,
          'FieldType': PipelineFilterService.getFieldTypeForFilters(f.Datatype, f.isDateRecurring),
          'OpType': f.OpType,
          'LeftParentheses': f.LeftParentheses,
          'RightParentheses': f.RightParentheses,
          'ValueFrom': angular.isArray(f.ValueFrom) ? f.ValueFrom.join(';') : f.ValueFrom,
          'ValueTo': f.ValueTo || '',
          'Header': f.Header,
          'FieldOptions': f.FieldOptions,
          'Name': f.Name,
          'FieldID': f.FieldID,
          'Datatype': f.Datatype,
          'AdvFilterType': f.AdvFilterType,
          'OperatorOptions': f.OperatorOptions,
          'parenEndList': f.parenEndList,
          'parenStartList': f.parenStartList,
          'parenColor': f.parenColor,
          'format': getDecimalFormat(f.Datatype, 'format'),
          'decimals': getDecimalFormat(f.Datatype, 'decimals')

        };
      });
    }

    function getDecimalFormat(dataType, type) {
      switch (type) {
        case 'decimals':
          return dataType.toUpperCase().indexOf('DECIMAL_') > -1 ? dataType.substr(8) : '0';
        case 'format':
          return dataType.toUpperCase().indexOf('DECIMAL_') > -1 ? 'n' + parseInt(dataType.substr(8), 10) : 'n0';
        default :
          return '';
      }
    }

    vm.clickApply = function () {
      if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
        PipelineDataStore.VERBOSE_LOG = {
          API_DATA_LOADED: false,
          START_TIME: new Date().getTime(),
          ACTION: 'ADV FILTER APPLY'
        };
      }
      exprEvaluator();
      PipelineDataStore.AdvanceFilterShow = !PipelineDataStore.AdvanceFilterShow;
      copyAdvancedFiltersToGrid();
      $rootScope.$broadcast(PipelineEventsConst.RESET_GRID_FILTER_EVENT);
      $rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT);
      setControlEnable();
    };

    function setControlEnable() {
      PipelineDataStore.saveButtonDisabled = false;
      PipelineDataStore.resetButtonDisabled = false;
      var menuStates = [{
        MenuItemTag: 'PI_SaveView',
        Enabled: !PipelineDataStore.saveButtonDisabled,
        Visible: true
      }, {
        MenuItemTag: 'PI_ResetView',
        Enabled: !PipelineDataStore.resetButtonDisabled,
        Visible: true
      }];
      SetMenuStateService.setThickClientMenuState(menuStates);

    }

    function dataLoad(FieldDefinition, filterIndex) {
      //this is the uniqueID that needs to be passed as CriterionName to the API
      vm.filters[filterIndex].Name = FieldDefinition.Name || FieldDefinition.CriterionName;
      vm.filters[filterIndex].CriterionName = FieldDefinition.CriterionName || FieldDefinition.Name;
      vm.filters[filterIndex].FieldID = FieldDefinition.FieldID || FieldDefinition.FieldId;
      vm.filters[filterIndex].Header = FieldDefinition.Header || FieldDefinition.FieldDescription;
      vm.filters[filterIndex].FieldOptions = FieldDefinition.FieldOptions;
      vm.filters[filterIndex].ValueFrom = FieldDefinition.ValueFrom;
      vm.filters[filterIndex].ValueTo = FieldDefinition.ValueTo;
      vm.filters[filterIndex].Datatype = FieldDefinition.Datatype;

      //For dropdowns, show the display name of the selected item instead of the value in Logic and Summary
      vm.filters[filterIndex].DropDownLabel = PipelineFilterService.getDropDownLabel(FieldDefinition);
      vm.filters[filterIndex].FilterLogicValue = FieldDefinition.Datatype === 'DROPDOWN' ?
        vm.filters[filterIndex].DropDownLabel : FieldDefinition.ValueFrom +
      (typeof FieldDefinition.ValueTo !== 'undefined' && FieldDefinition.ValueTo !== '' ? ' and ' + FieldDefinition.ValueTo : '');

      if (FieldDefinition.Datatype) {
        switch (FieldDefinition.Datatype) {
          case (FieldDefinition.Datatype.match(/^PHONE|STATE|ZIPCODE|SSN/) || {}).input:
            vm.filters[filterIndex].AdvFilterType = 'STRING';
            vm.filters[filterIndex].OperatorOptions = operatorOptions.STRING;
            break;
          case (FieldDefinition.Datatype.match(/^DECIMAL/) || {}).input:
            vm.filters[filterIndex].format = getDecimalFormat(FieldDefinition.Datatype, 'format');
            vm.filters[filterIndex].decimals = getDecimalFormat(FieldDefinition.Datatype, 'decimals');
            vm.filters[filterIndex].AdvFilterType = 'DECIMAL';
            vm.filters[filterIndex].OperatorOptions = operatorOptions.DECIMAL;
            break;
          case (FieldDefinition.Datatype.match(/^DATE$/) || {}).input:
          case (FieldDefinition.Datatype.match(/^DATETIME$/) || {}).input:
            vm.filters[filterIndex].AdvFilterType = 'DATE-TIME';
            vm.filters[filterIndex].OperatorOptions = operatorOptions.DATE;
            vm.filters[filterIndex].isDateRecurring = (FieldDefinition.FieldType === 'IsMonthDay' || FieldDefinition.isDateRecurring) ?
              true : false;
            break;
          default :
            vm.filters[filterIndex].AdvFilterType = FieldDefinition.Datatype;
            vm.filters[filterIndex].OperatorOptions = operatorOptions[angular.uppercase(FieldDefinition.Datatype)];
            if (typeof vm.filters[filterIndex].OperatorOptions === 'undefined') {
              vm.filters[filterIndex].OperatorOptions = operatorOptions.DEFAULT;
            }
        }
      }

      vm.filters[filterIndex].OpType = FieldDefinition.OpType;
      if (vm.filters[filterIndex].Datatype === 'YN') {
        if (FieldDefinition.OpType !== 'IsAnyOf') {
          vm.filters[filterIndex].ValueFrom = vm.filters[filterIndex].OpType; //assign the Y/N to the value
        }
        vm.filters[filterIndex].OpType = 'IsAnyOf'; //set the Operator to IsAnyOf
      } else {
        //TODO: preselect the correct operator //this is not working as expected
        var OptOption = _.findWhere(vm.filters[filterIndex].OperatorOptions, {value: FieldDefinition.OpType});
        if (OptOption) {
          vm.filters[filterIndex].OpType = OptOption.value; //we need to pass the selected operator's value to the API
        }
        else {
          vm.filters[filterIndex].OpType = ''; // Blank will set for select in operator dropdown
        }
      }
    }

    vm.validateMultiSelect = function () {
      vm.onFilterItemReady();
      //check for each filter if the ValueFrom is empty for any filter, set Invalid and return.
      vm.filters.every(function (filterItem) {
        // just skip filterItem for other datatype expect DropDown
        // and let flag in previous state for those data type.
        if (filterItem.AdvFilterType !== 'DROPDOWN') {
          return true;
        }
        if (filterItem.ValueFrom && filterItem.ValueFrom.length > 0) {
          vm.multiSelectInvalid = false; // otherwise set false.
          return true; // to continue loop
        }
        else {
          vm.multiSelectInvalid = true;
          return false; // to break loop.
        }
        return vm.multiSelectInvalid;
      });
    };

    vm.addField = function (filterIndex) {
      var modalInstance = modalWindowService.showAddFieldPopup();
      modalInstance.result.then(function (result) {
        if (!angular.equals({}, PipelineDataStore.FieldDefinition.selectedItem) && result === true) {
          dataLoad(PipelineDataStore.FieldDefinition.selectedItem, filterIndex);
          vm.validateMultiSelect();
        }
      });
    };
    vm.exprEvaluator = exprEvaluator;
    function swapProperty(obj, otherObj, property) {
      var paren = obj[property];
      obj[property] = otherObj[property];
      otherObj[property] = paren;
    }

    vm.onCheckBoxSelect = onCheckBoxSelect;
    function onCheckBoxSelect(sender, filter) {
      if (sender.currentTarget.checked) {
        vm.DateFrom.setOptions({format: 'MM/dd'});
        vm.DateTo.setOptions({format: 'MM/dd'});
        filter.OperatorOptions = dateRecuring;
        filter.OpType = filter.OperatorOptions[0].value;
        filter.ValueFrom = '';
        filter.ValueTo = '';
        filter.isDateRecurring = true;
        filter.FieldType = 'IsMonthDay';
      }
      else {
        vm.DateFrom.setOptions({format: 'MM/dd/yyyy'});
        vm.DateTo.setOptions({format: 'MM/dd/yyyy'});
        filter.OperatorOptions = [];
        filter.OperatorOptions = notDateRecurring;
        filter.OpType = filter.OperatorOptions[0].value;
        filter.ValueFrom = '';
        filter.ValueTo = '';
        filter.isDateRecurring = false;
        filter.FieldType = 'IsDate';
      }
      vm.onFilterItemReady();
    }

    vm.onFilterItemReady = function () {
      vm.readyFilters = angular.copy(getValidFilters());
      $timeout(function () {
        _.each(vm.readyFilters, function (filter) {
          var operator = _.findWhere(filter.OperatorOptions, {value: filter.OpType});
          filter.OpName = operator.name;
        });
      });
      $rootScope.$broadcast('toggleFilter', vm.readyFilters.length);
      vm.resizeGrid();
    };

    function getValidFilters() {
      var filterItems = _.filter(vm.filters, function (fltrItem) {
        var isValidfilter = false;
        if (fltrItem.AdvFilterType) {
          switch (fltrItem.AdvFilterType.toUpperCase()) {
            case 'DATE-TIME':
              switch (fltrItem.OpType && fltrItem.OpType.toLocaleLowerCase()) {
                case 'datenotbetween':
                case 'datebetween':
                  if (fltrItem.CriterionName && fltrItem.ValueTo && fltrItem.ValueFrom && fltrItem.OpType) {
                    isValidfilter = true;
                  }
                  break;
                case 'equals':
                case 'notequal':
                case 'datebefore':
                case 'dateonorbefore':
                case 'dateafter':
                  if (fltrItem.CriterionName && fltrItem.ValueFrom && fltrItem.OpType) {
                    isValidfilter = true;
                  }
                  break;
                default :
                  if (fltrItem.CriterionName && fltrItem.OpType) {
                    isValidfilter = true;
                  }
                  break;
              }
              break;
            case 'YN':
              if (fltrItem.CriterionName && fltrItem.OpType === 'IsAnyOf' && fltrItem.ValueFrom) {
                isValidfilter = true;
              }
              break;
            default:
              if (fltrItem.OpType && (fltrItem.OpType.toLocaleLowerCase() === 'between' ||
                fltrItem.OpType.toLocaleLowerCase() === 'notbetween')) {
                if (fltrItem.CriterionName && fltrItem.ValueTo
                  && (fltrItem.ValueFrom.length === 0 ? true : fltrItem.ValueFrom)
                  && fltrItem.OpType) {
                  isValidfilter = true;
                }
              }
              else if (fltrItem.CriterionName && (fltrItem.ValueFrom === 0 ? true : fltrItem.ValueFrom)
                && fltrItem.OpType) {
                isValidfilter = true;
              }
          }
          fltrItem.FilterLogicValue = fltrItem.AdvFilterType === 'DROPDOWN' ?
            PipelineFilterService.getDropDownLabel(fltrItem) : fltrItem.ValueFrom +
          (typeof fltrItem.ValueTo !== 'undefined' && fltrItem.ValueTo !== '' ? ' and ' + fltrItem.ValueTo : '');
        }
        return isValidfilter;
      });
      return filterItems;
    }

    vm.onAndOrClicked = function (e, index) {
      var validFilters = getValidFilters();
      if (e.currentTarget.checked) {
        vm.readyFilters[index].JointToken = 'or';
        validFilters[index].JointToken = 'or';
      }
      else {
        vm.readyFilters[index].JointToken = 'and';
        validFilters[index].JointToken = 'and';
      }
    };

    function parenInit(filter) {
      if (typeof filter.parenEndList === 'undefined') {
        filter.parenEndList = [];
      }
      if (typeof filter.parenStartList === 'undefined') {
        filter.parenStartList = [];
      }

    }

    function shiftParentheses(parenListTo, parenListFrom, index, obj) {
      parenInit(vm.filters[obj.index]);
      parenInit(vm.filters[index]);
      vm.filters[obj.index][parenListTo].splice(vm.filters[obj.index][parenListTo].indexOf(obj.val), 1);
      var color = (typeof vm.filters[obj.index].parenColor === 'undefined') ? '' : vm.filters[obj.index].parenColor[obj.val];
      vm.filters[index][parenListTo].push(obj.val);
      if (color !== '') {
        if (typeof vm.filters[index].parenColor === 'undefined') {
          vm.filters[index].parenColor = {};
        }
        vm.filters[index].parenColor[obj.val] = color;
      }
      vm.filters[index][parenListTo] = vm.filters[index][parenListTo].sort().reverse();
      vm.filters[obj.val][parenListFrom].splice(vm.filters[obj.val][parenListFrom].indexOf(obj.index), 1);
      color = (typeof vm.filters[obj.val].parenColor === 'undefined') ? '' : vm.filters[obj.val].parenColor[obj.index];
      vm.filters[obj.val][parenListFrom].push(index);
      if (color !== '' && (typeof color !== 'undefined')) {
        vm.filters[obj.val].parenColor[index] = color;
      }
      vm.filters[obj.val][parenListFrom] = vm.filters[obj.val][parenListFrom].sort().reverse();
    }

    function leftParenthesesDropped(index, obj) {
      parenInit(vm.filters[obj.val]);
      parenInit(vm.filters[index]);

      if (obj.val >= index && _.max(vm.filters[obj.val].parenStartList) <= obj.val
        && vm.filters[index].parenStartList.indexOf(obj.val) === -1) {
        if ((vm.filters[index].parenEndList.length > 0 && (obj.index > index))) {
          return;
        }
        shiftParentheses('parenStartList', 'parenEndList', index, obj);
      }
    }

    function rightParenthesesDropped(index, obj) {
      parenInit(vm.filters[obj.val]);
      parenInit(vm.filters[index]);
      if (obj.val <= index && _.min(vm.filters[obj.val].parenEndList) >= obj.val
        && vm.filters[index].parenEndList.indexOf(obj.val) === -1) {
        if ((vm.filters[index].parenStartList.length > 0 && (obj.index < index))) {
          return;
        }
        shiftParentheses('parenEndList', 'parenStartList', index, obj);
      }
    }

    function exprCreator(index, filters) {
      _.each(filters, function (val, count) {

        parenInit(filters[index]);
        if ((typeof val.parenEndList === 'undefined') || (typeof val.parenStartList === 'undefined')) {
          parenInit(val);
        }
        if (count >= index && val.parenEndList.indexOf(index) === -1) {
          var indexMin = _.min(filters[index].parenEndList);
          var indexMax = (filters.length <= (index + 1)) ? index : _.max(filters[index + 1].parenStartList);
          if (indexMin === -Infinity || indexMin === Infinity) {
            indexMin = index;
          }
          if (indexMax === -Infinity || indexMax === Infinity) {
            indexMax = index + 1;
          }
          parenInit(filters[indexMax]);
          parenInit(filters[indexMin]);
          if (filters[indexMax].parenEndList.indexOf(indexMin) === -1) {
            filters[indexMin].parenStartList.push(indexMax);
            filters[indexMin].parenStartList = filters[indexMin].parenStartList.sort().reverse();
            if (typeof filters[indexMin].parenColor === 'undefined') {
              filters[indexMin].parenColor = {};
            }
            filters[indexMin].parenColor[indexMax] = '#' + Math.random().toString(16).substr(-6);
            filters[indexMax].parenEndList.push(indexMin);
            filters[indexMax].parenEndList = filters[indexMax].parenEndList.sort().reverse();
            return false;
          }
          else if (filters[index].parenEndList.indexOf(index) === -1) {
            filters[index].parenEndList.push(index);
            filters[index].parenEndList = filters[index].parenEndList.sort().reverse();
            filters[index].parenStartList.push(index);
            filters[index].parenStartList = filters[index].parenStartList.sort().reverse();
            if (typeof filters[index].parenColor === 'undefined') {
              filters[index].parenColor = {};
            }
            filters[index].parenColor[index] = '#' + Math.random().toString(16).substr(-6);
            return false;
          }
        }

      });

    }

    function exprEvaluator() {
      var parenArray = [];
      var count = 0;
      _.each(vm.filters, function (filter, index) {
        parenInit(filter);
        dataLoad(filter, index);
        count = 0;
        while (count < filter.LeftParentheses) {
          parenArray.push(index);
          count++;
        }
        count = 0;
        while (count < filter.RightParentheses) {
          var val = parenArray.pop();
          if (vm.filters[val].parenStartList.indexOf(index) === -1) {
            vm.filters[val].parenStartList.push(index);
          }
          if (typeof vm.filters[val].parenColor === 'undefined') {
            vm.filters[val].parenColor = {};
            vm.filters[val].parenColor[index] = '#' + Math.random().toString(16).substr(-6);
          }
          if (filter.parenEndList.indexOf(val) === -1) {
            filter.parenEndList.push(val);
          }
          count++;
        }
        filter.JointToken = filter.JointToken === '' ? 'and' : filter.JointToken;
      });
      vm.validateMultiSelect();
    }

    vm.clickCancel = function () {
      PipelineDataStore.AdvanceFilterShow = !PipelineDataStore.AdvanceFilterShow;
      $rootScope.$broadcast(PipelineEventsConst.OPEN_ADVANCED_FILTER, PipelineDataStore.AdvanceFilterShow);
    };

    $rootScope.$on(PipelineEventsConst.OPEN_ADVANCED_FILTER, function (event, uiVisible) {
      vm.filters = angular.copy(PipelineDataStore.PipelineGridData.filters);
      if (uiVisible) {
        exprEvaluator();
        //There should be one filter available by default if there is no filter added.
        if (vm.filters && vm.filters.length <= 0) {
          vm.addFilter(-1);
        }
        vm.onFilterItemReady();
      }
    });

    vm.resizeGrid = function () {
      $timeout(function () {
        $rootScope.$broadcast(PipelineEventsConst.PIPELINE_WINDOW_RESIZE_EVENT);
      }, 0);
    };
  }
}());
