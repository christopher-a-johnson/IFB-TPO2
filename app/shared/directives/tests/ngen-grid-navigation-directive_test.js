/**
 * Created by kdeshmukh on 6/16/2015.
 * This file is used for testing nge-grid-navigation-directive. This test is corresponds  to ngen-grid-navigation-directive.js
 */
(function () {
  'use strict';

  describe('Grid Navigation Directive Test', function () {
    var scope, ctrl, httpBackend, rootScope, element, compile, kendoUI, timeout;
    /*Create mock data for kendo grid*/
    var rowData = [{
      'LoanGuid': '049e7f89-1c62-4bfa-b07d-6f65735134e9',
      'LoanNumber': '234324',
      'CloseDate': '05/22/2014'
    },
      {
        'LoanGuid': '049e7f89-1ce2-4bfa-b07d-6f65735134e9',
        'LoanNumber': '43545',
        'CloseDate': '05/22/2014'
      }];
    var ksource = {
      dataSource: {
        data: rowData,
        schema: {
          model: {
            fields: {
              LoanGuid: {type: 'string'},
              LoanNumber: {type: 'number'},
              CloseDate: {type: 'date'}
            }
          }
        },
        pageSize: 20
      },
      selectable: 'multiple row',
      filterable: {
        mode: 'row'
      },
      columns: [
        {field: 'LoanGuid'},
        {field: 'LoanNumber'},
        {field: 'CloseDate'}
      ]
    };
    //Load shared module
    beforeEach(module('elli.encompass.web'));
    beforeEach(module('kendo.directives'));
    /*Injecting dependencies before tests are executed */
    beforeEach(inject(function ($compile, $rootScope, $httpBackend, $controller, $timeout, kendo) {
      rootScope = $rootScope;
      scope = rootScope.$new();
      compile = $compile;
      kendoUI = kendo;
      httpBackend = $httpBackend;
      timeout = $timeout;
      ctrl = $controller('PipelineGridController', {$scope: scope});
      scope.option = ksource;
      element = compileDirective(angular.element('<div ng-controller="PipelineGridController as vm">' +
      '<div ngen-grid-navigation id="aria"  kendo-grid k-options="option" k-navigatable="true"></div></div>'));

    }));
    /*Compile Directive using $compile service to generate HTML*/
    function compileDirective(html) {
      var elem = angular.element(html);
      var compiled = compile(elem);
      compiled(scope);
      angular.element(document).find('body').append(elem);
      scope.$digest();
      return elem;
    }

    it('should clear row selection when tab reaches .k-widget', function (done) {
      var gridElement;
      var grid;

      /*Once Kendo grid is created put selection on first row. Tab through filters when .k-widget found clear row selection*/
      scope.$on('kendoRendered', function () {
        grid = element.find('div[id="aria"]').data('kendoGrid');
        if (grid) {
          grid.table.trigger('kendoWidgetCreated');
          gridElement = element.find('.k-grid-header .k-widget');
          gridElement.trigger('focus');
          var gridrow = grid.table.find('#aria_active_cell').closest('tr');
          expect(gridrow.is('.k-state-selected')).toBe(false);
          done();
        }
      });

    });

    it('should clear selection when tab reaches k-datepicker ', function (done) {
      var grid;
      var gridElement;
      /*Once Kendo grid is created put selection on first row. Tab through filters when .k-widget found clear row selection*/
      scope.$on('kendoRendered', function () {
        grid = element.find('div[id="aria"]').data('kendoGrid');
        if (grid) {
          grid.table.trigger('kendoWidgetCreated');
          gridElement = element.find('.k-grid-header .k-datepicker');
          gridElement.trigger('focus');
          var gridrow = grid.table.find('#aria_active_cell').closest('tr');
          expect(gridrow.is('.k-state-selected')).toBe(false);
          done();
        }
      });
    });

    it('Should select next row on key down', function (done) {
      scope.option = ksource;
      var grid;
      var firstElement;
      scope.$on('kendoRendered', function () {
        grid = element.find('div[id="aria"]').data('kendoGrid');
        if (grid) {
          grid.table.trigger({type: 'keydown', which: 40, keyCode: 40});
          firstElement = grid.table.find('#aria_active_cell').closest('tr');
          expect(firstElement.is('.k-state-selected')).toBe(true);
          done();
        }
      });
    });
  });
})();
