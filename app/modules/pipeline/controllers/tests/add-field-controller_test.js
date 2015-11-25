'use strict';

describe('Test Add Field Controller: AddFieldController', function () {
  beforeEach(module('elli.encompass.web'));

  var rootScope, scope, ctrl, modalService, env, setMenuStateService,
    pipelineDataStore, elem, pipelineEventsConst, pipelineGetColumnDef, localStorage, restangular;
  beforeEach(inject(function ($controller, $rootScope, modalWindowService, CustomizeColumnService, $httpBackend,
                              ENV, SetMenuStateService, PipelineDataStore, localStorageService, $compile,
                              PipelineGetColumnDef, PipelineEventsConst, Restangular) {
    rootScope = $rootScope;
    spyOn(rootScope, '$broadcast');
    scope = $rootScope.$new();
    setMenuStateService = SetMenuStateService;
    modalService = modalWindowService;
    pipelineDataStore = PipelineDataStore;
    pipelineEventsConst = PipelineEventsConst;
    pipelineGetColumnDef = PipelineGetColumnDef;
    localStorage = localStorageService;
    restangular = Restangular;
    env = ENV;
    spyOn(restangular, 'one').and.callThrough();
    $httpBackend.expectGET(ENV.restURL + '/pipeline/view/fielddefinitions').respond({
      'FieldDefs': {
        'field.123': {
          'Category': 'Pipeline',
          'FieldId': 'Alerts',
          'Header': 'Test',
          'BorrowerPair': '-1'
        },
        '2': {
          'Category': 'Pipeline',
          'FieldId': 'Messages',
          'Header': 'Messages',
          'BorrowerPair': '-1'
        }
      }
    });
    localStorageService.set('PipelineGetColumnDef', {});
    pipelineGetColumnDef.resolvePromise();
    if (angular.equals({}, localStorage.get('PipelineGetColumnDef')) || localStorage.get('PipelineGetColumnDef') === null) {
      expect(Restangular.one).toHaveBeenCalledWith('pipeline/view/fielddefinitions');
      $httpBackend.flush();
    }
    ctrl = $controller('AddFieldController', {
      $scope: scope
    });
    elem = $compile(angular.element('<div ng-controller="AddFieldController as vm"><div k-navigatable="true"' +
    'kendo-grid="vm.addFieldGrid" k-ng-delay="vm.fieldsLoaded"' +
    'k-options="vm.addFieldGridOptions" tabindex="5">' +
    '</div></div>'))(scope);
  }));

  it('Should set fieldsLoaded to true, when controller is loaded', inject(function (localStorageService) {
    expect(localStorageService.get('PipelineGetColumnDef')).toBeDefined();
    expect(pipelineDataStore.FieldDefinition.items).toBeDefined();
    expect(ctrl.fieldsLoaded).toBe(true);
  }));

  it('Should reset filter if fieldName is empty and fire enter key', function (done) {
    var filter = null;
    scope.$on('kendoRendered', function () {
      var grid = elem.find('div[kendo-grid="vm.addFieldGrid"]').data('kendoGrid');
      if (grid) {
        ctrl.addFieldGrid = grid;
        ctrl.fieldName = '';
        ctrl.onSearchContentKeyDown({keyCode: 13});
        filter = grid.dataSource._filter;
        expect(ctrl.addFieldGrid.dataItems().length).toBe(2);
        expect(filter).not.toBeDefined();
        done();
      }
    });

  });

  it('Should filter if fieldName length is not zero',
    function (done) {
      inject(function ($compile, $timeout) {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.addFieldGrid"]').data('kendoGrid');
          if (grid) {
            ctrl.addFieldGrid = grid;
            ctrl.fieldName = 'test';
            ctrl.onSearchContentKeyDown({keyCode: 13});
            $timeout.flush();
            expect(ctrl.addFieldGrid.dataItems().length).toBe(1);
            expect(ctrl.onFilterDataBind).toBe(true);
            done();
          }
        });

      });
    });

  it('Should alert if no match found in filter fieldName',
    function (done) {
      inject(function ($compile, modalWindowService, $timeout, PipelineConst) {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.addFieldGrid"]').data('kendoGrid');
          if (grid) {
            ctrl.addFieldGrid = grid;
            ctrl.fieldName = 'xyz';
            spyOn(modalWindowService.popupInformation, 'open');
            ctrl.onSearchContentKeyDown({keyCode: 13});
            $timeout.flush();
            expect(modalWindowService.popupInformation.open).toHaveBeenCalledWith({
              message: PipelineConst.UnavailableFieldIDMessage, title: 'Field Error'
            });
            expect(ctrl.onFilterDataBind).toBe(false);
            done();
          }
        });

      });
    });

  it('Should fill the filter on click of ok button',
    function (done) {
      inject(function ($compile, $timeout, modalWindowService) {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.addFieldGrid"]').data('kendoGrid');
          if (grid) {
            ctrl.addFieldGrid = grid;
            spyOn(modalWindowService, 'closeAddFieldPopup');
            ctrl.addFieldOk();
            expect(pipelineDataStore.FieldDefinition.selectedItem).toBeDefined();
            expect(rootScope.$broadcast).toHaveBeenCalledWith(pipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
            expect(modalWindowService.closeAddFieldPopup).toHaveBeenCalledWith(true);
            done();
          }
        });
      });
    });

  it('Should close modal pop up on click of cancel', inject(function (modalWindowService) {
    spyOn(modalWindowService, 'closeAddFieldPopup');
    ctrl.addFieldCancel();
    expect(modalWindowService.closeAddFieldPopup).toHaveBeenCalledWith(false);
  }));
});
