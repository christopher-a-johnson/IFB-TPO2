'use strict';

describe('Test Advanced Filter Controller: AdvancedFilterController', function () {
  beforeEach(module('elli.encompass.web'));

  var scope, ctrl, modalService, env, setMenuStateService,
    pipelineDataStore, compile, rootScope, pipelineEventsConst, _timeout;
  beforeEach(inject(function ($controller, $compile, $rootScope, modalWindowService, CustomizeColumnService, $httpBackend,
                              ENV, SetMenuStateService, PipelineDataStore, PipelineEventsConst, $timeout) {
    rootScope = $rootScope;
    _timeout = $timeout;
    scope = $rootScope.$new();
    setMenuStateService = SetMenuStateService;
    modalService = modalWindowService;
    pipelineDataStore = PipelineDataStore;
    pipelineEventsConst = PipelineEventsConst;
    env = ENV;
    compile = $compile;
    ctrl = $controller('pipelineAdvanceFilterController', {
      $scope: scope
    });
  }));
  it('Should open modal window for the add field', inject(function ($q) {
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(false);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    expect(modalService.showAddFieldPopup).toHaveBeenCalled();
    expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
  }));

  it('Should set filters data type to decimal when press Ok by selecting item.', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);

    var fieldObject = {
      Name: 'Fields.2161',
      FieldId: 'Fields.2161',
      FieldDescription: 'Rate Lock Buy Side Base Price Rate',
      Datatype: 'DECIMAL_10',
      DisplayType: 'Normal',
      FieldOptions: []
    };

    var decimalOptions = [{name: 'Is', value: 'Equals'},
      {name: 'Is not', value: 'NotEqual'},
      {name: 'Greater than', value: 'GreaterThan'}, {name: 'Not greater than', value: 'NotGreaterThan'},
      {name: 'Less than', value: 'LessThan'}, {name: 'Not less than', value: 'NotLessThan'},
      {name: 'Between', value: 'Between'}, {name: 'Not between', value: 'NotBetween'}];

    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    expect(modalService.showAddFieldPopup).toHaveBeenCalled();
    expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
    expect(ctrl.filters[0].AdvFilterType).toBe('DECIMAL');
    expect(ctrl.filters[0].CriterionName).toBe('Fields.2161');
    expect(ctrl.filters[0].OperatorOptions).toEqual(decimalOptions);
    expect(ctrl.filters[0].OpType).toBe('');
  }));

  it('Should set filters data type to string when press Ok by selecting ZIPCODE field.', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);

    var fieldObject = {
      Name: 'Fields.1419',
      FieldId: 'Fields.1419',
      FieldDescription: 'Borr Mailing Zip',
      Datatype: 'ZIPCODE',
      DisplayType: 'Normal',
      FieldOptions: []
    };

    var stringOptions = [{name: 'Is (Exact)', value: 'IsExact'},
      {name: 'Is not', value: 'IsNot'},
      {name: 'Starts with', value: 'StartsWith'}, {name: 'Doesn\'t starts with', value: 'DoesnotStartWith'},
      {name: 'Contains', value: 'Contains'}, {name: 'Doesn\'t contain', value: 'DoesnotContain'}];

    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    expect(modalService.showAddFieldPopup).toHaveBeenCalled();
    expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
    expect(ctrl.filters[0].AdvFilterType).toBe('STRING');
    expect(ctrl.filters[0].CriterionName).toBe('Fields.1419');
    expect(ctrl.filters[0].OperatorOptions).toEqual(stringOptions);
    expect(ctrl.filters[0].OpType).toBe('');
  }));

  it('Should set filters data type to string when press Ok by selecting SSN field.', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);

    var fieldObject = {
      Name: 'Fields.65',
      FieldId: 'Fields.65',
      FieldDescription: 'Borr SSN',
      Datatype: 'SSN',
      DisplayType: 'Normal',
      FieldOptions: []
    };

    var stringOptions = [{name: 'Is (Exact)', value: 'IsExact'},
      {name: 'Is not', value: 'IsNot'},
      {name: 'Starts with', value: 'StartsWith'}, {name: 'Doesn\'t starts with', value: 'DoesnotStartWith'},
      {name: 'Contains', value: 'Contains'}, {name: 'Doesn\'t contain', value: 'DoesnotContain'}];

    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    expect(modalService.showAddFieldPopup).toHaveBeenCalled();
    expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
    expect(ctrl.filters[0].AdvFilterType).toBe('STRING');
    expect(ctrl.filters[0].CriterionName).toBe('Fields.65');
    expect(ctrl.filters[0].OperatorOptions).toEqual(stringOptions);
    expect(ctrl.filters[0].OpType).toBe('');
  }));

  it('Should set filters data type to string when press Ok by selecting PHONE field.', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);

    var fieldObject = {
      Name: 'Fields.VEND.X163',
      FieldId: 'Fields.VEND.X163',
      FieldDescription: 'File Contacts Hazard Ins Co Phone',
      Datatype: 'PHONE',
      DisplayType: 'Normal',
      FieldOptions: []
    };

    var stringOptions = [{name: 'Is (Exact)', value: 'IsExact'},
      {name: 'Is not', value: 'IsNot'},
      {name: 'Starts with', value: 'StartsWith'}, {name: 'Doesn\'t starts with', value: 'DoesnotStartWith'},
      {name: 'Contains', value: 'Contains'}, {name: 'Doesn\'t contain', value: 'DoesnotContain'}];

    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    expect(modalService.showAddFieldPopup).toHaveBeenCalled();
    expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
    expect(ctrl.filters[0].AdvFilterType).toBe('STRING');
    expect(ctrl.filters[0].CriterionName).toBe('Fields.VEND.X163');
    expect(ctrl.filters[0].OperatorOptions).toEqual(stringOptions);
    expect(ctrl.filters[0].OpType).toBe('');
  }));

  it('Should set filters data type to default/provided one when press Ok by selecting other field type.', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);

    var fieldObject = {
      Name: 'Fields.230',
      FieldId: 'Fields.230',
      FieldDescription: 'Expenses Proposed Haz Ins',
      Datatype: 'RA_STRING',
      DisplayType: 'Normal',
      FieldOptions: []
    };

    var defaultOptions = [{name: 'Contains', value: 'Contains'},
      {name: 'Equals', value: 'Equals'},
      {name: 'Not equal', value: 'NotEqual'}, {name: 'Less than', value: 'LessThan'},
      {name: 'Greater than', value: 'GreaterThan'}, {name: 'Not less than', value: 'NotLessThan'},
      {name: 'Not greater than', value: 'NotGreaterThan'}];

    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    expect(modalService.showAddFieldPopup).toHaveBeenCalled();
    expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
    expect(ctrl.filters[0].Datatype).toBe('RA_STRING');
    expect(ctrl.filters[0].CriterionName).toBe('Fields.230');
    expect(ctrl.filters[0].OperatorOptions).toEqual(defaultOptions);
    expect(ctrl.filters[0].OpType).toBe('');
  }));

  it('Should set filters operation option for integer data type when press Ok by selecting item.', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);

    var fieldObject = {
      Name: 'Fields.432',
      FieldId: 'Fields.432',
      FieldDescription: 'Trans Details Rate Lock # Days',
      Datatype: 'INTEGER',
      DisplayType: 'Normal',
      FieldOptions: []
    };

    var integerOptions = [{name: 'Is', value: 'Equals'},
      {name: 'Is not', value: 'NotEqual'},
      {name: 'Greater than', value: 'GreaterThan'}, {name: 'Not greater than', value: 'NotGreaterThan'},
      {name: 'Less than', value: 'LessThan'}, {name: 'Not less than', value: 'NotLessThan'},
      {name: 'Between', value: 'Between'}, {name: 'Not between', value: 'NotBetween'}];

    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    expect(modalService.showAddFieldPopup).toHaveBeenCalled();
    expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
    expect(ctrl.filters[0].Datatype).toBe('INTEGER');
    expect(ctrl.filters[0].CriterionName).toBe('Fields.432');
    expect(ctrl.filters[0].OperatorOptions).toEqual(integerOptions);
    expect(ctrl.filters[0].OpType).toBe('');
  }));

  it('Should set filters data type to DATE-TIME and check for date not recurring when press Ok by selecting item.', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);
    var fieldObject = {
      Name: 'Fields.Document.ExpirationDate.Underwriting',
      FieldId: 'Fields.Document.ExpirationDate.Underwriting',
      FieldDescription: 'Document Expiration Date - Underwriting',
      Datatype: 'DATE',
      DisplayType: 'Normal',
      FieldOptions: []
    };
    var dateNotRecurringOption = [{name: 'Today', value: 'Today'},
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
      {name: 'Next 365 days', value: 'Next365days'},
      {name: 'Current week', value: 'CurrentWeek'},
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

    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    expect(modalService.showAddFieldPopup).toHaveBeenCalled();
    expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
    expect(ctrl.filters[0].AdvFilterType).toBe('DATE-TIME');
    expect(ctrl.filters[0].CriterionName).toBe('Fields.Document.ExpirationDate.Underwriting');
    expect(ctrl.filters[0].OperatorOptions).toEqual(dateNotRecurringOption);
    expect(ctrl.filters[0].OpType).toBe('');
  }));

  it('Should set filters data type to DATE-TIME and check for date recurring when press Ok by selecting item.',
    function (done) {
      inject(function ($q) {
        ctrl.filters = [];
        ctrl.addFilter(-1);
        var fieldObject = {
          Name: 'Fields.MS.STATUSDATE',
          FieldId: 'Fields.MS.STATUSDATE',
          FieldDescription: 'Tracking - Current Milestone Date',
          Datatype: 'DATETIME',
          DisplayType: 'Normal',
          FieldOptions: []
        };
        var dateRecurringOption = [
          {name: 'Current week', value: 'CurrentWeek'},
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

        pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
        var popupPromise;
        var popupDeferred = $q.defer();
        popupPromise = {result: popupDeferred.promise};
        popupDeferred.resolve(true);
        spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
          return popupPromise;
        });
        ctrl.addField(0);
        scope.$apply();
        //checkbox selection.
        var element = compile(angular.element('<div ng-controller="pipelineAdvanceFilterController">' +
        '<input id="datefrom" kendo-date-picker="vm.DateFrom"' +
        '  k-format="MM/dd/yyyy"/></div>'))(scope);
        angular.element(document).find('body').append(element);
        scope.$digest();
        var evt =
        {
          currentTarget: {checked: true}
        };
        scope.$on('kendoRendered', function () {
          var dateWidget = element.find('input[id="datefrom"]').data('kendoDatePicker');
          if (dateWidget) {
            ctrl.DateFrom = dateWidget;
            ctrl.DateTo = dateWidget;
            ctrl.onCheckBoxSelect(evt, ctrl.filters[0]);
          }
          expect(modalService.showAddFieldPopup).toHaveBeenCalled();
          expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
          expect(ctrl.filters[0].AdvFilterType).toBe('DATE-TIME');
          expect(ctrl.filters[0].CriterionName).toBe('Fields.MS.STATUSDATE');
          expect(ctrl.filters[0].OperatorOptions).toEqual(dateRecurringOption);
          expect(ctrl.filters[0].OpType).toBe('CurrentWeek');
          done();
        });
      });
    });

  it('Should adjust or reset parenthesis list of existing filters while adding new filter', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);
    var fieldObject = {
      Name: 'Fields.432',
      FieldId: 'Fields.432',
      FieldDescription: 'Trans Details Rate Lock # Days',
      Datatype: 'INTEGER',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();

    ctrl.addFilter(0);
    fieldObject = {
      Name: 'Fields.VEND.X163',
      FieldId: 'Fields.VEND.X163',
      FieldDescription: 'File Contacts Hazard Ins Co Phone',
      Datatype: 'PHONE',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    ctrl.addField(1);
    scope.$apply();
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.onParanDropComplete(0, {type: 'parentheses', allowClone: true});
    expect(ctrl.filters[0].parenStartList[0]).toBe(1);
    ctrl.addFilter(0);
    fieldObject = {
      Name: 'Fields.65',
      FieldId: 'Fields.65',
      FieldDescription: 'Borr SSN',
      Datatype: 'SSN',
      DisplayType: 'Normal',
      FieldOptions: []
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    ctrl.addField(1);
    scope.$apply();
    //after adjustment of new filter
    expect(ctrl.filters[0].parenStartList[0]).toBe(2);
  }));

  it('Shuld not add parenthesis while adding filter', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);
    var fieldObject = {
      Name: 'Fields.432',
      FieldId: 'Fields.432',
      FieldDescription: 'Trans Details Rate Lock # Days',
      Datatype: 'INTEGER',
      DisplayType: 'Normal',
      FieldOptions: []
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.addFilter(0);
    fieldObject = {
      Name: 'Fields.VEND.X163',
      FieldId: 'Fields.VEND.X163',
      FieldDescription: 'File Contacts Hazard Ins Co Phone',
      Datatype: 'PHONE',
      DisplayType: 'Normal',
      FieldOptions: [],
      valueFrom: 10,
      opType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    ctrl.addField(1);
    scope.$apply();

    var returnResult = ctrl.onParanDropComplete(0, {type: 'parentheses', allowClone: true});
    expect(returnResult).not.toBeDefined();
    expect(ctrl.filters.length).not.toBe(ctrl.readyFilters.length);
  }));

  it('Should add filters on click of addMore button', function () {
    ctrl.filters = [];
    ctrl.addFilter(-1);
    expect(ctrl.filters.length).toBe(1);
  });

  it('Should remove filter on click of removeFilter(-) button', function () {
    ctrl.filters = [{
      OperatorOptions: [],
      OpType: '',
      AdvFilterType: 'YN'
    }, {
      'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
      'AdvFilterType': 'INTEGER',
      'OpType': 'Equals',
      'ValueFrom': 33
    }];
    ctrl.readyFilters = [{
      'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
      'AdvFilterType': 'INTEGER',
      'OpType': 'Equals',
      'ValueFrom': 33
    }];
    spyOn(ctrl, 'onFilterItemReady').and.callThrough();
    ctrl.removeFilter(1);
    expect(ctrl.filters.length).toBe(1);
    expect(ctrl.onFilterItemReady).toHaveBeenCalled();
    expect(ctrl.readyFilters.length).toBe(0);
  });

  it('Should remove associate parenthesis while remove filter', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);
    var fieldObject = {
      Name: 'Fields.432',
      FieldId: 'Fields.432',
      FieldDescription: 'Trans Details Rate Lock # Days',
      Datatype: 'INTEGER',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    ctrl.addFilter(0);
    fieldObject = {
      Name: 'Fields.VEND.X163',
      FieldId: 'Fields.VEND.X163',
      FieldDescription: 'File Contacts Hazard Ins Co Phone',
      Datatype: 'PHONE',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    ctrl.addField(1);
    scope.$apply();
    ctrl.addFilter(1);
    fieldObject = {
      Name: 'Fields.65',
      FieldId: 'Fields.65',
      FieldDescription: 'Borr SSN',
      Datatype: 'SSN',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    ctrl.addField(2);
    scope.$apply();
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.onParanDropComplete(0, {type: 'parentheses', allowClone: true});
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.onParanDropComplete(1, {type: 'parentheses', allowClone: true});
    //Before removing filter
    expect(ctrl.filters.length).toBe(3);
    expect(ctrl.filters[0].parenStartList.length).toBe(2);
    expect(ctrl.filters[0].parenStartList[0]).toBe(2);

    spyOn(ctrl, 'onFilterItemReady').and.callThrough();
    spyOn(ctrl, 'deleteParen').and.callThrough();
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.removeFilter(1);
    //After adjustment of removing filter
    expect(ctrl.filters.length).toBe(2);
    expect(ctrl.filters[0].parenStartList.length).toBe(1);
    expect(ctrl.filters[0].parenStartList[0]).toBe(1);
  }));

  it('Should remove parenthesis set when click on - ) - closing parenthesis close button', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);
    var fieldObject = {
      Name: 'Fields.432',
      FieldId: 'Fields.432',
      FieldDescription: 'Trans Details Rate Lock # Days',
      Datatype: 'INTEGER',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    ctrl.addFilter(0);
    fieldObject = {
      Name: 'Fields.VEND.X163',
      FieldId: 'Fields.VEND.X163',
      FieldDescription: 'File Contacts Hazard Ins Co Phone',
      Datatype: 'PHONE',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    ctrl.addField(1);
    scope.$apply();
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.onParanDropComplete(0, {type: 'parentheses', allowClone: true});
    //Before removing parenthesis
    expect(ctrl.filters.length).toBe(2);
    expect(ctrl.filters[0].parenStartList.length).toBe(1);
    expect(ctrl.filters[1].parenEndList.length).toBe(1);
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.deleteParen(0, ctrl.filters[1], false);
    //After removing parenthesis
    expect(ctrl.filters.length).toBe(2);
    expect(ctrl.filters[0].parenStartList.length).toBe(0);
  }));

  it('Should remove parenthesis set when click on - ( - opening parenthesis close button', inject(function ($q) {
    ctrl.filters = [];
    ctrl.addFilter(-1);
    var fieldObject = {
      Name: 'Fields.432',
      FieldId: 'Fields.432',
      FieldDescription: 'Trans Details Rate Lock # Days',
      Datatype: 'INTEGER',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });
    ctrl.addField(0);
    scope.$apply();
    ctrl.addFilter(0);
    fieldObject = {
      Name: 'Fields.VEND.X163',
      FieldId: 'Fields.VEND.X163',
      FieldDescription: 'File Contacts Hazard Ins Co Phone',
      Datatype: 'PHONE',
      DisplayType: 'Normal',
      FieldOptions: [],
      ValueFrom: 10,
      OpType: 'Equals'
    };
    pipelineDataStore.FieldDefinition.selectedItem = fieldObject;
    ctrl.addField(1);
    scope.$apply();
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.onParanDropComplete(0, {type: 'parentheses', allowClone: true});
    //Before removing parenthesis
    expect(ctrl.filters.length).toBe(2);
    expect(ctrl.filters[0].parenStartList.length).toBe(1);
    expect(ctrl.filters[1].parenEndList.length).toBe(1);
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.deleteParen(1, ctrl.filters[0], true);
    //After removing parenthesis
    expect(ctrl.filters.length).toBe(2);
    expect(ctrl.filters[1].parenEndList.length).toBe(0);
  }));

  it('Date picker format should be MM/dd on Date recurring check box checked',
    function (done) {
      inject(function () {
        spyOn(ctrl, 'onFilterItemReady');
        var element = compile(angular.element('<div ng-controller="pipelineAdvanceFilterController">' +
        '<input id="datefrom" kendo-date-picker="vm.DateFrom"' +
        '  k-format="MM/dd/yyyy"/></div>'))(scope);
        angular.element(document).find('body').append(element);
        scope.$digest();
        ctrl.filters = [{
          OperatorOptions: [],
          OpType: ''
        }];
        var evt =
        {
          currentTarget: {checked: true}
        };
        scope.$on('kendoRendered', function () {
          var dateWidget = element.find('input[id="datefrom"]').data('kendoDatePicker');
          if (dateWidget) {
            ctrl.DateFrom = dateWidget;
            ctrl.DateTo = dateWidget;
            ctrl.onCheckBoxSelect(evt, ctrl.filters[0]);

            expect(ctrl.DateFrom.options.format).toBe('MM/dd');
            expect(ctrl.DateTo.options.format).toBe('MM/dd');
            expect(ctrl.onFilterItemReady).toHaveBeenCalled();
            done();
          }
        });
      });
    });

  it('Date picker format should be MM/dd/yyyy on Date recurring check box Unchecked',
    function (done) {
      inject(function () {
        spyOn(ctrl, 'onFilterItemReady');
        var element = compile(angular.element('<div ng-controller="pipelineAdvanceFilterController">' +
        '<input id="datefrom" kendo-date-picker="vm.DateFrom"' +
        '  k-format="MM/dd/yyyy"/></div>'))(scope);
        angular.element(document).find('body').append(element);
        scope.$digest();
        ctrl.filters = [{
          OperatorOptions: [],
          OpType: ''
        }];
        var evt =
        {
          currentTarget: {checked: false}
        };
        scope.$on('kendoRendered', function () {
          var dateWidget = element.find('input[id="datefrom"]').data('kendoDatePicker');
          if (dateWidget) {
            ctrl.DateFrom = dateWidget;
            ctrl.DateTo = dateWidget;
            ctrl.onCheckBoxSelect(evt, ctrl.filters[0]);

            expect(ctrl.DateFrom.options.format).toBe('MM/dd/yyyy');
            expect(ctrl.DateTo.options.format).toBe('MM/dd/yyyy');
            expect(ctrl.onFilterItemReady).toHaveBeenCalled();
            done();
          }
        });
      });
    });

  it('Validate required fields to push object in filters array', function () {
    ctrl.filters = [
      {
        'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
        'AdvFilterType': 'INTEGER',
        'OpType': 'Equals',
        'ValueFrom': 33
      },
      {
        'CriterionName': '763',
        'AdvFilterType': 'DATE-TIME',
        'OpType': 'Today'
      },
      {
        'CriterionName': '763',
        'AdvFilterType': 'DATE-TIME',
        'OpType': 'DateNotBetween',
        'ValueFrom': '07/16/2015',
        'ValueTo': '07/26/2015'
      },
      {
        'CriterionName': '763',
        'AdvFilterType': 'DATE-TIME',
        'OpType': 'Equals',
        'ValueFrom': '07/25/2015'
      },
      {
        'CriterionName': '36',
        'AdvFilterType': 'STRING',
        'OpType': 'Equals',
        'ValueFrom': 'Alan'
      },
      {
        'CriterionName': '763',
        'AdvFilterType': '',
        'OpType': 'between',
        'ValueFrom': '11',
        'ValueTo': '44'
      },
      {
        'CriterionName': '763',
        'AdvFilterType': '',
        'OpType': 'notbetween',
        'ValueFrom': '11',
        'ValueTo': '44'
      },
      {
        'CriterionName': '',
        'AdvFilterType': '',
        'OpType': '',
        'ValueFrom': ''
      }
    ];
    ctrl.onFilterItemReady();
    expect(ctrl.readyFilters.length).toBe(5);
  });

  it('Should update JointToken form "and" to "or" if AND OR toggle button is checked (Set to OR)', function () {
    ctrl.filters = [{
      'JointToken': 'and',
      'AdvFilterType': 'INTEGER',
      'OpType': 'Equals',
      'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
      'ValueFrom': 33
    }];
    ctrl.readyFilters = [{
      'JointToken': 'and',
      'AdvFilterType': 'INTEGER',
      'OpType': 'Equals',
      'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
      'ValueFrom': 33
    }];
    var event = {currentTarget: {checked: true}};
    ctrl.onAndOrClicked(event, 0);
    expect(ctrl.readyFilters[0].JointToken).toBe('or');
    expect(ctrl.filters[0].JointToken).toBe('or');
  });

  it('Should update JointToken form "or" to "and" if AND OR toggle button is unchecked (Set to AND)', function () {
    ctrl.filters = [{
      'JointToken': 'or',
      'AdvFilterType': 'INTEGER',
      'OpType': 'Equals',
      'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
      'ValueFrom': 33
    }];
    ctrl.readyFilters = [{
      'JointToken': 'or',
      'AdvFilterType': 'INTEGER',
      'OpType': 'Equals',
      'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
      'ValueFrom': 33
    }];
    var event = {currentTarget: {checked: false}};
    ctrl.onAndOrClicked(event, 0);
    expect(ctrl.readyFilters[0].JointToken).toBe('and');
    expect(ctrl.filters[0].JointToken).toBe('and');
  });

  it('Push an empty filter box if readyFilters array is empty)', inject(
    function (PipelineEventsConst, PipelineDataStore) {
      spyOn(ctrl, 'onFilterItemReady');
      ctrl.filters = [];
      PipelineDataStore.PipelineGridData.filters = [];
      rootScope.$broadcast(PipelineEventsConst.OPEN_ADVANCED_FILTER, true);
      expect(ctrl.filters.length).toBe(1);
    }));

  it('Should populate string type operator enumerations if data type is string', inject(function ($q) {
    var popupPromise;
    var popupDeferred = $q.defer();
    popupPromise = {result: popupDeferred.promise};
    popupDeferred.resolve(true);
    spyOn(modalService, 'showAddFieldPopup').and.callFake(function () {
      return popupPromise;
    });

    pipelineDataStore.FieldDefinition.selectedItem = {
      Category: 'Borrowers',
      Datatype: 'STRING',
      DisplayType: 'Normal',
      FieldDescription: 'Borr First Name',
      FieldId: '36',
      FieldOptions: '',
      Name: 'Fields.36',
      SortKeyName: 'Fields.36'
    };
    ctrl.filters = [{
      OperatorOptions: [{name: 'Is (Exact)', value: 'Equals'}, {name: 'Is not', value: 'NotEqual'}]
    }];
    ctrl.addField(0);
    scope.$apply();
    expect(ctrl.filters[0].OpType).toBe('');
  }));

  it('Should check for drop complete event', function () {
    spyOn(ctrl, 'onFilterItemReady');
    ctrl.filters = [];
    ctrl.addFilter(-1);
    var result = ctrl.onDropComplete(0, {type: 'parentheses'});
    expect(result).toBe(false);
    ctrl.onDropComplete(0, {parenEndList: {}, parenStartList: {}, parenColor: {}});
    expect(ctrl.filters.length).toBe(1);
    expect(ctrl.onFilterItemReady).toHaveBeenCalled();
  });

  it('Should check for paren drop complete event', function () {
    spyOn(ctrl, 'onFilterItemReady');
    spyOn(ctrl, 'removeParen');
    ctrl.filters = [{
      'CriterionName': 'Fields.2', 'DataSource': 'Loan', 'FieldDescription': 'Total Loan Amount',
      'FieldID': '2', 'FieldType': 'IsNumeric', 'ForceDataConversion': false, 'IsVolatile': false, 'JointToken': 'and',
      'LeftParentheses': 0, 'OpDesc': 'Is'
    },
      {
        'CriterionName': 'Fields.3',
        'DataSource': 'Loan',
        'FieldDescription': 'Note Rate',
        'FieldID': '3',
        'FieldType': 'IsNumeric',
        'ForceDataConversion': false,
        'IsVolatile': false,
        'JointToken': 'and',
        'LeftParentheses': 0,
        'OpDesc': 'Is',
        'OpType': 'Equals',
        'RightParentheses': 0,
        'ValueDescription': '2',
        'ValueFrom': '2'

      }];
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.onParanDropComplete(0, {'type': 'parentheses', 'allowClone': true});
    expect(ctrl.onFilterItemReady).toHaveBeenCalled();
    expect(ctrl.removeParen).toHaveBeenCalled();
  });

  it('should check when left parenthesis drop is complete', function () {
    spyOn(ctrl, 'onFilterItemReady');
    spyOn(ctrl, 'removeParen');
    ctrl.filters = [{
      'CriterionName': 'Fields.2', 'DataSource': 'Loan', 'FieldDescription': 'Total Loan Amount',
      'FieldID': '2', 'FieldType': 'IsNumeric', 'ForceDataConversion': false, 'IsVolatile': false, 'JointToken': 'and',
      'LeftParentheses': 0, 'OpDesc': 'Is'
    },
      {
        'CriterionName': 'Fields.3',
        'DataSource': 'Loan',
        'FieldDescription': 'Note Rate',
        'FieldID': '3',
        'FieldType': 'IsNumeric',
        'ForceDataConversion': false,
        'IsVolatile': false,
        'JointToken': 'and',
        'LeftParentheses': 0,
        'OpDesc': 'Is',
        'OpType': 'Equals',
        'RightParentheses': 0,
        'ValueDescription': '2',
        'ValueFrom': '2'

      }];
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.onParanDropComplete(0, {'type': 'leftParentheses', 'allowClone': true, 'index': 0, val: '1'});
    expect(ctrl.onFilterItemReady).toHaveBeenCalled();
    expect(ctrl.removeParen).toHaveBeenCalled();
  });
  it('should check when right parenthesis drop is complete', function () {
    spyOn(ctrl, 'onFilterItemReady');
    spyOn(ctrl, 'removeParen');
    ctrl.filters = [{
      'CriterionName': 'Fields.2', 'DataSource': 'Loan', 'FieldDescription': 'Total Loan Amount',
      'FieldID': '2', 'FieldType': 'IsNumeric', 'ForceDataConversion': false, 'IsVolatile': false, 'JointToken': 'and',
      'LeftParentheses': 0, 'OpDesc': 'Is'
    },
      {
        'CriterionName': 'Fields.3',
        'DataSource': 'Loan',
        'FieldDescription': 'Note Rate',
        'FieldID': '3',
        'FieldType': 'IsNumeric',
        'ForceDataConversion': false,
        'IsVolatile': false,
        'JointToken': 'and',
        'LeftParentheses': 0,
        'OpDesc': 'Is',
        'OpType': 'Equals',
        'RightParentheses': 0,
        'ValueDescription': '2',
        'ValueFrom': '2'

      }];
    angular.copy(ctrl.filters, ctrl.readyFilters);
    ctrl.onParanDropComplete(0, {'type': 'rightParentheses', 'allowClone': true, 'index': 0, val: '1'});
    expect(ctrl.onFilterItemReady).toHaveBeenCalled();
    expect(ctrl.removeParen).toHaveBeenCalled();
  });

  it('Should handle open filter event', inject(function (PipelineEventsConst) {
    ctrl.filters = [];
    rootScope.$broadcast(PipelineEventsConst.OPEN_ADVANCED_FILTER, true);
    expect(ctrl.filters.length).toEqual(1);
  }));

  it('Should hide advance filter area when we click cancel', function () {
    ctrl.filters = [];
    ctrl.clickCancel();
    expect(pipelineDataStore.AdvanceFilterShow).toBe(true);
  });

  it('Should display error model popup when field is not found in FieldDefination.', function () {
    ctrl.filters = [];
    spyOn(ctrl, 'onFilterItemReady');
    ctrl.addFilter(-1);
    ctrl.filters[0].FieldID = '2161';

    ctrl.searchFilter(0);

    expect(ctrl.onFilterItemReady).toHaveBeenCalled();
    expect(ctrl.filters[0].FieldID).not.toBeDefined();
  });

  it('Should return as is when from SearchFilter call.', function () {
    ctrl.filters = [];
    spyOn(ctrl, 'onFilterItemReady');
    ctrl.addFilter(-1);
    ctrl.filters[0].FieldID = '';
    ctrl.filters[0].Header = '';
    expect(ctrl.searchFilter(0)).not.toBeDefined();
  });

  it('Should fill advance filter control when searchFilter find based on FieldID', function () {
    ctrl.filters = [];
    var decimalOptions = [{name: 'Is', value: 'Equals'},
      {name: 'Is not', value: 'NotEqual'},
      {name: 'Greater than', value: 'GreaterThan'}, {name: 'Not greater than', value: 'NotGreaterThan'},
      {name: 'Less than', value: 'LessThan'}, {name: 'Not less than', value: 'NotLessThan'},
      {name: 'Between', value: 'Between'}, {name: 'Not between', value: 'NotBetween'}];

    spyOn(ctrl, 'onFilterItemReady');
    ctrl.addFilter(-1);

    pipelineDataStore.FieldDefinition.items = [{
      Name: 'Fields.2',
      Datatype: 'DECIMAL_2',
      FieldId: '2',
      FieldDescription: 'Trans Details Total Loan Amt (w/ MIP/FF)',
      BorrowerPair: -1,
      Category: 'Loan',
      SortKeyName: 'Fields.2',
      DisplayType: 'Normal',
      FieldOptions: []
    }, {
      Name: 'Fields.3',
      Datatype: 'DECIMAL_3',
      FieldId: '3',
      FieldDescription: 'Trans Details Interest Rate',
      BorrowerPair: -1,
      Category: 'Loan',
      SortKeyName: 'Fields.3',
      DisplayType: 'Normal',
      FieldOptions: []
    }
    ];

    ctrl.filters[0].FieldID = '3';

    ctrl.searchFilter(0);

    expect(ctrl.filters[0].Name).toBe('Fields.3');
    expect(ctrl.filters[0].CriterionName).toBe('Fields.3');
    expect(ctrl.filters[0].FieldID).toBe('3');
    expect(ctrl.filters[0].Header).toBe('Trans Details Interest Rate');
    expect(ctrl.filters[0].FieldOptions.length).toBe(0);
    expect(ctrl.filters[0].Datatype).toBe('DECIMAL_3');
    expect(ctrl.filters[0].AdvFilterType).toBe('DECIMAL');
    expect(ctrl.filters[0].OperatorOptions).toEqual(decimalOptions);
  });

  describe('In AdvanceFilter MultiselectInvalid flag', function () {
    it('Should be false by default when no filter is added.', function () {
      ctrl.filters = [];
      spyOn(ctrl, 'onFilterItemReady');
      ctrl.validateMultiSelect();
      expect(ctrl.onFilterItemReady).toHaveBeenCalled();
      expect(ctrl.multiSelectInvalid).toBe(false);
    });

    it('Should be true when multi select has no value selected.', function () {
      ctrl.filters = [];
      var fieldObject = {
        CriterionName: '1811',
        FieldDescription: 'Subject Property Occupancy Status',
        FieldOptions: [
          {
            DisplayName: 'Primary',
            Value: 'PrimaryResidence'
          },
          {
            DisplayName: 'Secondary',
            Value: 'SecondHome'
          },
          {
            DisplayName: 'Investment',
            Value: 'Investor'
          }
        ],
        ValueFrom: '',
        ValueTo: '',
        AdvFilterType: 'DROPDOWN',
        OpType: 'Equals'
      };
      spyOn(ctrl, 'onFilterItemReady');
      ctrl.filters.push(fieldObject);
      ctrl.validateMultiSelect();
      expect(ctrl.onFilterItemReady).toHaveBeenCalled();
      expect(ctrl.multiSelectInvalid).toBe(true);
    });

    it('Should be false when dropdown option has some selected value.', function () {
      ctrl.filters = [];
      var fieldObject = {
        CriterionName: '1811',
        FieldDescription: 'Subject Property Occupancy Status',
        FieldOptions: [
          {
            DisplayName: 'Primary',
            Value: 'PrimaryResidence'
          },
          {
            DisplayName: 'Secondary',
            Value: 'SecondHome'
          },
          {
            DisplayName: 'Investment',
            Value: 'Investor'
          }
        ],
        ValueFrom: ['PrimaryResidence', 'SecondHome'],
        AdvFilterType: 'DROPDOWN',
        OpType: 'Equals'
      };
      spyOn(ctrl, 'onFilterItemReady');
      ctrl.filters.push(fieldObject);
      ctrl.validateMultiSelect();
      expect(ctrl.onFilterItemReady).toHaveBeenCalled();
      expect(ctrl.multiSelectInvalid).toBe(false);
    });

    it('Should change filter box border color', function () {
      ctrl.changeFilterBoxBorder(false, 0);
      expect(ctrl.filterBoxClassName).toBe(false);
      expect(ctrl.filterIndex).toBe(0);
    });

    it('should change the filter type to YN when the operator is changed', function () {
      ctrl.filters = {
        'JointToken': 'or',
        'AdvFilterType': 'YN',
        'OpType': 'Equals',
        'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
        'ValueFrom': 33,
        parenStartList: [2, 3],
        parenEndList: [3, 4],
        FieldID: 33
      };
      spyOn(ctrl, 'validateMultiSelect');
      ctrl.selectChange(ctrl.filters);
      expect(ctrl.validateMultiSelect).toHaveBeenCalled();
    });
    it('should change the filter type to Dropdown when the operator is changed', function () {
      ctrl.filters = {
        'JointToken': 'or',
        'AdvFilterType': 'DROPDOWN',
        'OpType': 'Equals',
        'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
        'ValueFrom': 33,
        'DropDownLabel': 'Select',
        parenStartList: [2, 3],
        parenEndList: [3, 4],
        FieldID: 33
      };
      spyOn(ctrl, 'validateMultiSelect');
      ctrl.selectChange(ctrl.filters);
      expect(ctrl.validateMultiSelect).toHaveBeenCalled();
    });

    it('should check for apply click for advance filter', function () {
      ctrl.filters = [{
        'JointToken': 'or',
        'AdvFilterType': 'DROPDOWN',
        'OpType': 'Equals',
        'CriterionName': 'Alert.HUD1ToleranceViolation.AlertCount',
        'ValueFrom': 33,
        'DropDownLabel': 'Select',
        parenStartList: [2, 3],
        parenEndList: [3, 4],
        FieldID: 33,
        Datatype: 'INTEGER'
      }];
      var menuStates = [{
        MenuItemTag: 'PI_SaveView',
        Enabled: true,
        Visible: true
      }, {
        MenuItemTag: 'PI_ResetView',
        Enabled: true,
        Visible: true
      }];
      spyOn(pipelineDataStore, 'AdvanceFilterShow');
      spyOn(rootScope, '$broadcast');
      spyOn(ctrl, 'validateMultiSelect');
      spyOn(setMenuStateService, 'setThickClientMenuState');
      ctrl.clickApply();

      expect(pipelineDataStore.AdvanceFilterShow).toBe(false);
      expect(ctrl.validateMultiSelect).toHaveBeenCalled();
      expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.RESET_GRID_FILTER_EVENT);
      expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.REFRESH_GRID_EVENT);
      expect(setMenuStateService.setThickClientMenuState).toHaveBeenCalledWith(menuStates);
    });
    it('should resize the grid', function () {
      spyOn(rootScope, '$broadcast');
      ctrl.resizeGrid();
      _timeout.flush();
      expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.PIPELINE_WINDOW_RESIZE_EVENT);
    });
    it('should call resize grid when filter items are ready', function () {
      spyOn(ctrl, 'resizeGrid');
      spyOn(rootScope, '$broadcast');
      ctrl.onFilterItemReady();
      _timeout.flush();
      expect(ctrl.resizeGrid).toHaveBeenCalled();
    });

  });
});
