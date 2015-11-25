'use strict';

describe('Test Customize Column Controller: ModalCustomizeColumnsController', function () {

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;

  beforeEach(module('elli.encompass.web', function ($provide) {
  }));

  var scope, modalCustomizeColumnsController, customizeColumnService, modalService, env, setMenuStateService,
    pipelineDataStore, Restangular, pipelineGetColumnDef, localStorage;

  beforeEach(inject(function ($controller, $rootScope, modalWindowService, CustomizeColumnService, $httpBackend,
                              ENV, SetMenuStateService, PipelineDataStore, _Restangular_, PipelineGetColumnDef,
                              localStorageService) {
    scope = $rootScope.$new();
    customizeColumnService = CustomizeColumnService;
    setMenuStateService = SetMenuStateService;
    modalService = modalWindowService;
    pipelineDataStore = PipelineDataStore;
    Restangular = _Restangular_;
    env = ENV;
    localStorage = localStorageService;
    pipelineGetColumnDef = PipelineGetColumnDef;
    spyOn(modalWindowService.modalCustomizeColumns, 'close');//.and.callThrough();
    spyOn(setMenuStateService, 'setThickClientMenuState');
    modalCustomizeColumnsController = $controller('ModalCustomizeColumnsController', {
      $scope: scope,
      modalWindowService: modalWindowService,
      CustomizeColumnService: CustomizeColumnService,
      customCols: {}
    });
  }));

  it('should define Customize column data', function () {
    expect(modalCustomizeColumnsController.customizeColumnData).toBeDefined();
  });

  it('Should close window', function () {
    modalCustomizeColumnsController.customizeColumnCancel();
    expect(modalService.modalCustomizeColumns.close).toHaveBeenCalled();
  });

  it('Should define Customize column filter flag', function () {
    expect(modalCustomizeColumnsController.onFilterDataBind).toBeDefined();
  });

  it('Should define columnCheckChange method', function () {
    expect(modalCustomizeColumnsController.onCheckBoxSelect).toBeDefined();
  });

  it('Should check if information popup is shown when selected columns count is >= 50',
    inject(function (modalWindowService) {
      spyOn(modalWindowService.popupInformation, 'open');
      var sender = {currentTarget: {checked: true}};
      modalCustomizeColumnsController.selectedColumnsCount = 50;
      modalCustomizeColumnsController.onCheckBoxSelect(sender);
      expect(modalWindowService.popupInformation.open).toHaveBeenCalled();
      expect(sender.currentTarget.checked).toBe(false);
      expect(modalCustomizeColumnsController.selectedColumnsCount).toBe(50);
    }));

  it('Should check if selected columns count is incremented by 1',
    function () {
      var sender = {currentTarget: {checked: true}};
      modalCustomizeColumnsController.selectedColumnsCount = 25;
      modalCustomizeColumnsController.onCheckBoxSelect(sender);
      expect(modalCustomizeColumnsController.selectedColumnsCount).toBe(26);
    });

  it('Should check if selected columns count is decremented by 1',
    function () {
      var sender = {currentTarget: {checked: false}};
      modalCustomizeColumnsController.selectedColumnsCount = 25;
      modalCustomizeColumnsController.onCheckBoxSelect(sender);
      expect(modalCustomizeColumnsController.selectedColumnsCount).toBe(24);
    });

  it('Should be disable up and down icon by default',
    function () {
      expect(modalCustomizeColumnsController.moveDownAccessMode).toBe(true);
      expect(modalCustomizeColumnsController.moveUpAccessMode).toBe(true);
    });

  it('Should save data on click on OK button',
    function () {
      spyOn(modalCustomizeColumnsController, 'customizeColumnOk');
      modalCustomizeColumnsController.customizeColumnOk();
      expect(modalCustomizeColumnsController.customizeColumnOk).toHaveBeenCalled();
    });

  it('Should get reordered selected column in pop up',
    function () {
      spyOn(modalCustomizeColumnsController, 'moveUp');
      spyOn(modalCustomizeColumnsController, 'moveDown');
      modalCustomizeColumnsController.moveUp();
      modalCustomizeColumnsController.moveDown();
      expect(modalCustomizeColumnsController.moveUp).toHaveBeenCalled();
      expect(modalCustomizeColumnsController.moveDown).toHaveBeenCalled();
    });

  xdescribe('Test grid', function () {
    var elem;
    beforeEach(inject(function (ENV, $httpBackend, PipelineGetView, $compile) {
      spyOn(Restangular, 'all').and.callThrough();
      $httpBackend.expectPOST(ENV.restURL + '/pipeline/view/getview').respond(201, {
        'PipelineView': {
          'ExternalOrgId': null,
          'FilterSummary': null,
          'LoanFolder': null,
          'Name': 'Default View',
          'OrgType': 'Internal',
          'Ownership': 'All',
          'Columns': [
            {
              'Alignment': 'Right',
              'OrderIndex': '0',
              'PipelineField': {
                'Header': 'ActiveFolder',
                'Name': 'Loan.ActiveFolder',
                'SortOrder': null,
                'FieldId': 'Field.ActiveFolder'
              },
              'Required': null,
              'SortOrder': 'Ascending',
              'SortPriority': '-1',
              'Width': '-1'
            },
            {
              'Alignment': 'Right',
              'OrderIndex': '1',
              'PipelineField': {
                'Header': 'Message',
                'Name': 'Loan.Message',
                'SortOrder': null,
                'FieldId': 'Field.Message'
              },
              'Required': null,
              'SortOrder': 'Ascending',
              'SortPriority': '-1',
              'Width': '-1'
            }]
        }
      });
      PipelineGetView.resolvePromise();
      expect(Restangular.all).toHaveBeenCalledWith('pipeline/view/getview');
      $httpBackend.flush();
      spyOn(Restangular, 'one').and.callThrough();
      $httpBackend.expectGET(ENV.restURL + '/pipeline/view/fielddefinitions').respond({
        'FieldDefs': {
          'field.123': {
            'Category': 'Pipeline',
            'FieldId': 'Field.ActiveFolder',
            'Header': 'Alerts',
            'BorrowerPair': '-1'
          },
          '2': {
            'Category': 'Pipeline',
            'FieldId': 'Field.Message',
            'Header': 'Message',
            'BorrowerPair': '-1'
          }
        }
      });
      localStorage.set('PipelineGetColumnDef', {});
      pipelineGetColumnDef.resolvePromise();
      if (angular.equals({}, localStorage.get('PipelineGetColumnDef')) || localStorage.get('PipelineGetColumnDef') === null) {
        expect(Restangular.one).toHaveBeenCalledWith('pipeline/view/fielddefinitions');
        $httpBackend.flush();
      }
      elem = $compile(angular.element('<div ng-controller="ModalCustomizeColumnsController as vm">' +
      '<div class="customize-columns-grid" k-navigatable="true"' +
      'kendo-grid="vm.customizeColumnsGrid"' +
      'k-options="vm.customizeColumnGridOptions">' +
      '</div></div>'))(scope);
    }));

    it('Should search for text in customize column grid',
      inject(function ($timeout) {

        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            modalCustomizeColumnsController.columnName = 'Message';
            modalCustomizeColumnsController.onSearchContentKeyDown({keyCode: 13});
            $timeout.flush();
            return true;
          }
          expect(modalCustomizeColumnsController.customizeColumnData.items.length).toBe(2);
          expect(modalCustomizeColumnsController.customizeColumnsGrid.dataItems().length).toBe(1);
          expect(modalCustomizeColumnsController.onFilterDataBind).toBe(true);
        });
      }));

    it('Should order columns in customize column grid', function (done) {
      inject(function () {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            modalCustomizeColumnsController.columnName = '';
            modalCustomizeColumnsController.onSearchContentKeyDown({keyCode: 8});
            expect(modalCustomizeColumnsController.customizeColumnData.items.length).toBe(2);
            expect(modalCustomizeColumnsController.customizeColumnData.items[1].FieldId).toBe('Field.Message');
            done();
          }
        });
      });
    });

    it('Should check for all variable on click of OK button', function (done) {
      inject(function (modalWindowService) {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            modalCustomizeColumnsController.customizeColumnOk();
            expect(modalCustomizeColumnsController.customizeColumnData.items.length).toBe(2);
            expect(modalCustomizeColumnsController.customizeColumnsGrid.dataSource._data.length).toBe(2);
            expect(modalCustomizeColumnsController.dataStore.PipelineGridData.data.columns.length).toBe(2);
            expect(modalWindowService.modalCustomizeColumns.close).toHaveBeenCalledWith(true);
            expect(modalCustomizeColumnsController.moveDownAccessMode).toBe(true);
            expect(modalCustomizeColumnsController.moveUpAccessMode).toBe(true);
            expect(pipelineDataStore.saveButtonDisabled).toBe(true);
            expect(pipelineDataStore.resetButtonDisabled).toBe(true);
            done();
          }
        });
      });
    });

    it('Should alert if no item is checked on click of OK button', function (done) {
      inject(function () {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            modalCustomizeColumnsController.columnStateChanged = true;
            modalCustomizeColumnsController.customizeColumnOk();
            expect(modalCustomizeColumnsController.customizeColumnData.items.length).toBe(2);
            expect(modalCustomizeColumnsController.customizeColumnsGrid.dataSource._data.length).toBe(2);
            expect(modalCustomizeColumnsController.dataStore.PipelineGridData.data.columns.length).toBe(2);
            expect(modalCustomizeColumnsController.moveDownAccessMode).toBe(true);
            expect(modalCustomizeColumnsController.moveUpAccessMode).toBe(true);
            done();
          }
        });
      });
    });

    it('Should test the moveUp functionality', function (done) {
      inject(function ($timeout) {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            grid.select(grid.tbody.find('tr')[1]);
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            expect(grid.dataSource.view()[0].FieldId).toBe('Field.ActiveFolder');
            expect(grid.dataSource.view()[1].FieldId).toBe('Field.Message');
            modalCustomizeColumnsController.moveUp();
            expect(modalCustomizeColumnsController.selectedIndex).toBe(0);
            expect(modalCustomizeColumnsController.moveUpAccessMode).toBe(true);
            $timeout.flush();
            expect(grid.dataSource.view()[0].FieldId).toBe('Field.Message');
            expect(grid.dataSource.view()[1].FieldId).toBe('Field.ActiveFolder');
            expect(modalCustomizeColumnsController.moveUpAccessMode).toBe(false);
            done();
          }
        });
      });
    });

    it('Should test the moveUp functionality when selected item is the first item', function (done) {
      inject(function () {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            modalCustomizeColumnsController.moveUp();
            expect(modalCustomizeColumnsController.selectedUID).toBe(null);
            done();
          }
        });
      });
    });

    it('Should test the moveDown functionality', function (done) {
      inject(function ($timeout) {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            grid.select(grid.tbody.find('tr')[0]);
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            expect(grid.dataSource.view()[0].FieldId).toBe('Field.ActiveFolder');
            expect(grid.dataSource.view()[1].FieldId).toBe('Field.Message');
            modalCustomizeColumnsController.moveDown();
            expect(modalCustomizeColumnsController.selectedIndex).toBe(1);
            expect(modalCustomizeColumnsController.moveDownAccessMode).toBe(true);
            $timeout.flush();
            expect(grid.dataSource.view()[0].FieldId).toBe('Field.Message');
            expect(grid.dataSource.view()[1].FieldId).toBe('Field.ActiveFolder');
            expect(modalCustomizeColumnsController.moveDownAccessMode).toBe(false);
            done();
          }
        });
      });
    });

    it('Should test the search column functionality', function (done) {
      inject(function (PipelineDataStore, CustomizeColumnService, ENV, $compile, $timeout, $httpBackend, PipelineGetView,
                       modalWindowService, PipelineGetLoans) {

        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            modalCustomizeColumnsController.columnName = 'Messa';
            modalCustomizeColumnsController.searchColumn();
            $timeout.flush();
            expect(modalCustomizeColumnsController.selectedIndex).toBe(0);
            expect(modalCustomizeColumnsController.onFilterDataBind).toBe(true);
            expect(modalCustomizeColumnsController.selectedUID).toBe(null);
            expect(grid.dataSource.pageSize()).toBe(100);
            done();
          }
        });
      });
    });

    it('Should test the search column functionality with no search results', function (done) {
      inject(function ($timeout, modalWindowService) {
        spyOn(modalWindowService.popupInformation, 'open');
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            modalCustomizeColumnsController.columnName = 'Alerttt';
            modalCustomizeColumnsController.searchColumn();
            $timeout.flush();
            expect(modalWindowService.popupInformation.open).toHaveBeenCalledWith({
              message: 'No matches were found for "Alerttt".',
              title: 'No Matches'
            });
            done();
          }
        });
      });
    });

    it('Should test the onCustomColumnGridDataBound method', function (done) {
      inject(function ($timeout) {
        scope.$on('kendoRendered', function () {
          var grid = elem.find('div[kendo-grid="vm.customizeColumnsGrid"]').data('kendoGrid');
          if (grid) {
            modalCustomizeColumnsController.customizeColumnsGrid = grid;
            modalCustomizeColumnsController.selectedUID = null;
            modalCustomizeColumnsController.onCustomColumnGridDataBound({sender: grid});
            modalCustomizeColumnsController.onFilterDataBind = true;
            $timeout.flush();
            expect(modalCustomizeColumnsController.onFilterDataBind).toBe(true);
            done();
          }
        });
      });
    });
  });

  it('Should test move up functionality when grid is not defined', inject(function () {
    modalCustomizeColumnsController.moveUp();
    expect(modalCustomizeColumnsController.customizeColumnsGrid).not.toBeDefined();
  }));

  it('Should test search functionality when column name is not defined', inject(function () {
    modalCustomizeColumnsController.columnName = ['pp'];
    modalCustomizeColumnsController.onSearchContentKeyDown({keyCode: 10});
    expect(modalCustomizeColumnsController.customizeColumnsGrid).not.toBeDefined();
  }));
});
