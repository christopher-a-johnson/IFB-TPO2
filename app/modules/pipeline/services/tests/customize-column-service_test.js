/**
 * Created by KNavhate on 5/12/2015.
 */
(function () {
  'use strict';
  describe('CustomizeColumn Service', function () {
    var env, httpBackend, Restangular, pipelineDataStore;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_, PipelineDataStore) {
      env = ENV;
      pipelineDataStore = PipelineDataStore;
      pipelineDataStore.FieldDefinition.items = [{
        'Category': 'Pipeline',
        'FieldId': 'Field.ActiveFolder',
        'FieldDescription': 'Test',
        'BorrowerPair': '-1'
      },
        {
          'Category': 'Pipeline',
          'FieldId': 'Field.Message',
          'FieldDescription': 'Messages',
          'BorrowerPair': '-1'
        }];
      httpBackend = $httpBackend;
      Restangular = _Restangular_;
    }));

    it('Customize column service - get updated column with format for defined fields',
      inject(function (CustomizeColumnService, localStorageService, Restangular, ENV, $httpBackend, PipelineGetColumnDef) {
        spyOn(Restangular, 'one').and.callThrough();
        $httpBackend.expectGET(ENV.restURL + '/pipeline/view/fielddefinitions').respond({
          'FieldDefs': {
            '1109': {
              'Name': 'Fields.1109',
              'Datatype': 'DECIMAL_2',
              'DisplayType': 'Normal',
              'FieldId': '1109',
              'FieldOptions': []
            },
            '3': {
              'Name': 'Fields.3',
              'Datatype': 'DECIMAL_3',
              'DisplayType': 'Normal',
              'FieldId': '3',
              'FieldOptions': []
            },
            '762': {
              'Name': 'Fields.762',
              'Datatype': 'DATE',
              'DisplayType': 'Normal',
              'FieldId': '762',
              'FieldOptions': []
            },
            '2161': {
              'Name': 'Fields.2161',
              'Datatype': 'DECIMAL_10',
              'DisplayType': 'Normal',
              'FieldId': '2161',
              'FieldOptions': []
            }
          }
        });
        localStorageService.set('PipelineGetColumnDef', {});
        PipelineGetColumnDef.resolvePromise();
        if (angular.equals({}, localStorageService.get('PipelineGetColumnDef'))
          || localStorageService.get('PipelineGetColumnDef') === null) {
          expect(Restangular.one).toHaveBeenCalledWith('pipeline/view/fielddefinitions');
          $httpBackend.flush();
        }
        var columns = [
          {
            'Alignment': 'Right',
            'OrderIndex': '22',
            'PipelineField': {
              'Header': 'Loan Amount Decimal 10',
              'Name': 'Loan.LoanAmount.Decimal10',
              'SortOrder': null,
              'FieldId': '2161'
            },
            'Required': null,
            'SortOrder': 'None',
            'SortPriority': '-1',
            'Width': '100'
          },
          {
            'Alignment': 'Right',
            'OrderIndex': '4',
            'PipelineField': {
              'Header': 'Loan Amount',
              'Name': 'Loan.LoanAmount',
              'SortOrder': null,
              'FieldId': '1109'
            },
            'Required': null,
            'SortOrder': 'None',
            'SortPriority': '-1',
            'Width': '100'
          },
          {
            'Alignment': 'Right',
            'OrderIndex': '5',
            'PipelineField': {
              'Header': 'Note Rate',
              'Name': 'Loan.LoanRate',
              'SortOrder': null,
              'FieldId': '3'
            },
            'Required': null,
            'SortOrder': 'None',
            'SortPriority': '-1',
            'Width': '100'
          },
          {
            'Alignment': 'Right',
            'OrderIndex': '7',
            'PipelineField': {
              'Header': 'Lock Expiration Date',
              'Name': 'Loan.LockExpirationDate',
              'SortOrder': null,
              'FieldId': '762'
            },
            'Required': null,
            'SortOrder': 'None',
            'SortPriority': '-1',
            'Width': '100'
          }
        ];

        var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
        expect(updatedCols[0].format).toBe('{0:0.0000000000}');
        expect(updatedCols[0].type.toLowerCase()).toBe('decimal_10');
        expect(updatedCols[1].format).toBe('{0:0.00}');
        expect(updatedCols[1].type.toLowerCase()).toBe('decimal_2');
        expect(updatedCols[2].format).toBe('{0:0.000}');
        expect(updatedCols[2].type.toLowerCase()).toBe('decimal_3');
        expect(updatedCols[3].format).toBe('{0:MM/dd/yyyy}');
        expect(updatedCols[3].type.toLowerCase()).toBe('date');

      }));

    it('Customize column service - get updated column with format as blank for non-defined fields',
      inject(function (CustomizeColumnService, localStorageService, Restangular, ENV, $httpBackend, PipelineGetColumnDef) {
        spyOn(Restangular, 'one').and.callThrough();
        $httpBackend.expectGET(ENV.restURL + '/pipeline/view/fielddefinitions').respond({
          'FieldDefs': {
            '1109': {
              'Name': 'Fields.1109',
              'Datatype': 'DECIMAL_2',
              'FieldId': '1109',
              'FieldOptions': []
            }
          }
        });
        localStorageService.set('PipelineGetColumnDef', {});
        PipelineGetColumnDef.resolvePromise();
        if (angular.equals({}, localStorageService.get('PipelineGetColumnDef'))
          || localStorageService.get('PipelineGetColumnDef') === null) {
          expect(Restangular.one).toHaveBeenCalledWith('pipeline/view/fielddefinitions');
          $httpBackend.flush();
        }

        var columns = [
          {
            'Alignment': 'Right',
            'OrderIndex': '22',
            'PipelineField': {
              'Header': 'Loan Amount Decimal 10',
              'Name': 'Loan.LoanAmount.Decimal10',
              'SortOrder': null,
              'FieldId': '2161'
            },
            'Required': null,
            'SortOrder': 'None',
            'SortPriority': '-1',
            'Width': '100'
          }
        ];

        var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
        expect(updatedCols[0].format).toBe('');
        expect(updatedCols[0].type.toLowerCase()).toBe('string');
      }));

    it('Should add Icon value in LockAndRequestStatus dropdown list object',
      inject(function (CustomizeColumnService, PipelineGetColumnDef, $httpBackend, localStorageService, ENV) {
        localStorageService.set('PipelineGetColumnDef', undefined);
        spyOn(Restangular, 'one').and.callThrough();
        $httpBackend.when('GET', ENV.restURL + '/pipeline/view/fielddefinitions').respond({
          'FieldDefs': {
            'Pipeline.LockAndRequestStatus': {
              'Name': 'Loan.LockAndRequestStatus',
              'Datatype': 'dropdown',
              'FieldId': 'Pipeline.LockAndRequestStatus',
              'DisplayType': 'RateLockAndRequest',
              'FieldOptions': [
                {
                  'DisplayName': 'All Pending Lock Requests',
                  'Value': 'PendingRequest'
                },
                {
                  'DisplayName': 'Unlocked',
                  'Value': 'NotLocked-NoRequest'
                }
              ],
              'Header': 'Lock & Request Status'
            }
          }
        });
        localStorageService.set('PipelineGetColumnDef', {});
        PipelineGetColumnDef.resolvePromise();
        if (angular.equals({}, localStorageService.get('PipelineGetColumnDef'))
          || localStorageService.get('PipelineGetColumnDef') === null) {
          expect(Restangular.one).toHaveBeenCalledWith('pipeline/view/fielddefinitions');
          $httpBackend.flush();
        }

        var columns = [{
          'Alignment': 'Left',
          'OrderIndex': '6',
          'PipelineField': {
            'Header': 'Lock & Request Status',
            'Name': 'Loan.LockAndRequestStatus',
            'SortOrder': null,
            'FieldId': 'Pipeline.LockAndRequestStatus'
          },
          'Required': 'False',
          'SortOrder': 'None',
          'SortPriority': '-1',
          'Width': '100'
        }
        ];
        var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
        expect(updatedCols[0].list[0].Icon).toBe('dwi-rate-lock-request');
      }));

    it('PipelineDataStore.CustomizeColumnData.items should not be empty',
      inject(function (PipelineDataStore, CustomizeColumnService, ENV, $httpBackend, PipelineGetView) {
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
                  'Header': 'Alerts',
                  'Name': 'Alerts.AlertCount',
                  'SortOrder': null,
                  'FieldId': 'Field.ActiveFolder'
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
        CustomizeColumnService.resolvePromise();
        expect(PipelineDataStore.CustomizeColumnData.items.length).toBe(2);
      }));

    it('Should test the template of alert column', inject(function (localStorageService, CustomizeColumnService) {
      localStorageService.set('PipelineGetColumnDef', {
        '1109': {
          'Name': 'Fields.1109',
          'Datatype': 'DECIMAL_2',
          'DisplayType': 'Alert',
          'FieldId': '1109',
          'FieldOptions': []
        },
        '3': {
          'Name': 'Fields.3',
          'Datatype': 'DECIMAL_3',
          'DisplayType': 'Normal',
          'FieldId': '3',
          'FieldOptions': []
        },
        '762': {
          'Name': 'Fields.762',
          'Datatype': 'DATE',
          'DisplayType': 'Normal',
          'FieldId': '762',
          'FieldOptions': []
        },
        '2161': {
          'Name': 'Fields.2161',
          'Datatype': 'DECIMAL_10',
          'DisplayType': 'Normal',
          'FieldId': '2161',
          'FieldOptions': []
        }
      });

      var columns = [
        {
          'Alignment': 'Right',
          'OrderIndex': '22',
          'PipelineField': {
            'Header': 'Loan Amount Decimal 10',
            'Name': 'Loan.LoanAmount.Decimal10',
            'SortOrder': null,
            'FieldId': '2161'
          },
          'Required': null,
          'SortOrder': 'None',
          'SortPriority': '-1',
          'Width': '100'
        },
        {
          'Alignment': 'Right',
          'OrderIndex': '4',
          'PipelineField': {
            'Header': 'Loan Amount',
            'Name': 'Loan.LoanAmount',
            'SortOrder': null,
            'FieldId': '1109'
          },
          'Required': null,
          'SortOrder': 'None',
          'SortPriority': '-1',
          'Width': '100'
        },
        {
          'Alignment': 'Right',
          'OrderIndex': '5',
          'PipelineField': {
            'Header': 'Note Rate',
            'Name': 'Loan.LoanRate',
            'SortOrder': null,
            'FieldId': '3'
          },
          'Required': null,
          'SortOrder': 'None',
          'SortPriority': '-1',
          'Width': '100'
        },
        {
          'Alignment': 'Right',
          'OrderIndex': '7',
          'PipelineField': {
            'Header': 'Lock Expiration Date',
            'Name': 'Loan.LockExpirationDate',
            'SortOrder': null,
            'FieldId': '762'
          },
          'Required': null,
          'SortOrder': 'None',
          'SortPriority': '-1',
          'Width': '100'
        }
      ];
      var alertColumnTemplate = '<div ng-controller="PipelineGridTemplatesController as vm">' +
        '# if(typeof Fields$1109!== "undefined" && Fields$1109 !== null && Fields$1109 !== "") { ' +
        '#<div ng-click="vm.openLoanAlert(\'Fields.1109\')" ng-show="\'#: Fields$1109 #\' !== \'0\'" ' +
        'class="pl-view-alert-count">#: Fields$1109 #</div># } #</div>';
      var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);

      expect(updatedCols[1].template).toBe(alertColumnTemplate);

    }));

    xdescribe('test template', function () {
      var columns;
      beforeEach(inject(function (localStorageService) {
        localStorageService.set('PipelineGetColumnDef', {
          '762': {
            'Name': 'Fields.762',
            'Datatype': 'DATE',
            'DisplayType': 'Milestone',
            'FieldId': '762',
            'FieldOptions': []
          }
        });
        columns = [
          {
            'Alignment': 'Right',
            'OrderIndex': '7',
            'PipelineField': {
              'Header': 'Lock Expiration Date',
              'Name': 'Loan.LockExpirationDate',
              'SortOrder': null,
              'FieldId': '762'
            },
            'Required': null,
            'SortOrder': 'None',
            'SortPriority': '-1',
            'Width': '100'
          }
        ];
      }));

      it('Should test the template of milestone column', inject(function (localStorageService,
                                                                          CustomizeColumnService) {
        localStorageService.get('PipelineGetColumnDef')['762'].DisplayType = 'Milestone';

        var milestoneColumnTemplate = '<div ng-controller="PipelineGridTemplatesController as vm">' +
          '# if(typeof Fields$762!== "undefined" && Fields$762!== null && Fields$762!== "") { #' +
          '<div class="ngen-pull-left ngen-milestone-color-box"' +
          ' ng-style="{\'background-color\': vm.milestoneColors}"></div>' +
          '<span>{{vm.setMilestoneColor("#: Fields$762#")}}</span>' +
          '</div>' +
          ' # } #';
        var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
        expect(updatedCols[0].template).toBe(milestoneColumnTemplate);

      }));

      it('Should test the color combination of milestone column',
        inject(function (localStorageService, CustomizeColumnService, PipelineDataStore) {

          localStorageService.get('PipelineGetColumnDef')['762'].DisplayType = 'Milestone';
          columns[0].list = [{'DisplayName': 'Milestone_1'}, {'DisplayName': 'Milestone_2'}];
          PipelineDataStore.MilestoneProperties = [
            {'Name': 'Milestone_1', 'Color': 'Color [ A=255, R=10, G=20, B=255]'},
            {'Name': 'Milestone_2', 'Color': 'Color [ A=255, R=0, G=0, B=255]'}
          ];

          var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
          expect(updatedCols[0].list[0].Color).toEqual({R: '10', G: '20', B: '255', A: '255'});
          expect(updatedCols[0].list[1].Color).toEqual({R: '0', G: '0', B: '255', A: '255'});
        }));

      it('Should test the icon combination of rate lock column',
        inject(function (localStorageService, CustomizeColumnService) {

          var columndef = localStorageService.get('PipelineGetColumnDef');
          columndef['762'].DisplayType = 'RateLock';
          localStorageService.set('PipelineGetColumnDef', columndef);

          columns[0].list = [{'Value': 'NotLocked'}, {'Value': 'Locked'}, {'Value': 'Expired'},
            {'Value': 'Cancelled'}, {'Value': 'default'}];

          var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
          expect(updatedCols[0].list[0].Icon).toBe('dwi-rate-unlocked');
          expect(updatedCols[0].list[1].Icon).toBe('dwi-rate-locked');
          expect(updatedCols[0].list[2].Icon).toBe('dwi-rate-expired');
          expect(updatedCols[0].list[3].Icon).toBe('dwi-rate-lock-cancelled');
          expect(updatedCols[0].list[4].Icon).toBe('');
        }));

      it('Should test the icon combination of rate lock and request column',
        inject(function (localStorageService, CustomizeColumnService) {

          var columndef = localStorageService.get('PipelineGetColumnDef');
          columndef['762'].DisplayType = 'RateLockAndRequest';
          localStorageService.set('PipelineGetColumnDef', columndef);
          columns[0].list = [{'Value': 'NotLocked-NoRequest'}, {'Value': 'Locked-NoRequest'},
            {'Value': 'Expired-NoRequest'}, {'Value': 'Cancelled'}, {'Value': 'NotLocked-Request'},
            {'Value': 'Locked-Request'}, {'Value': 'Expired-Request'},
            {'Value': 'Locked-Extension-Request'}, {'Value': 'Locked-Cancellation-Request'},
            {'Value': 'PendingRequest'}, {'Value': 'default'}];

          var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
          expect(updatedCols[0].list[0].Icon).toBe('dwi-rate-unlocked');
          expect(updatedCols[0].list[1].Icon).toBe('dwi-rate-locked');
          expect(updatedCols[0].list[2].Icon).toBe('dwi-rate-expired');
          expect(updatedCols[0].list[3].Icon).toBe('dwi-rate-lock-cancelled');
          expect(updatedCols[0].list[4].Icon).toBe('dwi-rate-unlocked-request');
          expect(updatedCols[0].list[5].Icon).toBe('dwi-rate-locked-request');
          expect(updatedCols[0].list[6].Icon).toBe('dwi-rate-expired-request');
          expect(updatedCols[0].list[7].Icon).toBe('dwi-rate-lock-requested-extension');
          expect(updatedCols[0].list[8].Icon).toBe('dwi-rate-lock-cancel-request');
          expect(updatedCols[0].list[9].Icon).toBe('dwi-rate-lock-request');
          expect(updatedCols[0].list[10].Icon).toBe('');
        }));

      it('Should test filter template for dropdown column',
        inject(function (localStorageService, CustomizeColumnService) {

          var columndef = localStorageService.get('PipelineGetColumnDef');
          columndef['762'].Datatype = 'DROPDOWN';
          columndef['762'].FieldOptions = [{
            'Value': 'NotLocked',
            'DisplayName': 'Not Locked'
          }, {'Value': 'Locked', 'DisplayName': 'Locked'}];
          localStorageService.set('PipelineGetColumnDef', columndef);

          var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);

          var args = {
            element: {
              kendoDropDownList: function (data) {
                expect(data).toBeDefined();
                expect(data.dataSource).toBe(columns[0].list);
                expect(data.dataTextField).toBe('DisplayName');
                expect(data.dataValueField).toBe('Value');
                expect(data.optionLabel).toBe(' ');
                expect(data.animation).toBe(false);
                expect(data.valuePrimitive).toBe(true);
              }
            }
          };
          spyOn(args.element, 'kendoDropDownList');
          updatedCols[0].filterable.cell.template(args);
          expect(args.element.kendoDropDownList).toHaveBeenCalled();
        }));

      it('Should test filter template for integer column',
        inject(function (localStorageService, CustomizeColumnService) {

          var columndef = localStorageService.get('PipelineGetColumnDef');
          columndef['762'].Datatype = 'INTEGER';
          localStorageService.set('PipelineGetColumnDef', columndef);
          var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
          var args = {
            element: {
              kendoNumericTextBox: function (data) {
                expect(data).toBeDefined();
                expect(data.format).toBe('#');
                expect(data.decimals).toBe(0);
                expect(data.step).toBe(0);
                expect(data.spinners).toBe(false);
              }
            }
          };
          spyOn(args.element, 'kendoNumericTextBox');
          updatedCols[0].filterable.cell.template(args);
          expect(args.element.kendoNumericTextBox).toHaveBeenCalled();
        }));

      it('Should test filter template for string column',
        inject(function (localStorageService, CustomizeColumnService) {

          var columndef = localStorageService.get('PipelineGetColumnDef');
          columndef['762'].Datatype = 'STRING';
          localStorageService.set('PipelineGetColumnDef', columndef);
          var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);
          var args = {
            element: [{
              setAttribute: function (data, func) {
                expect(data).toBeDefined();
                expect(data).toBe('onkeyup');
                expect(func).toBeDefined();
                expect(func).toBe('if(event.keyCode === 13) { this.blur(); }');
              }
            }]
          };
          spyOn(args.element[0], 'setAttribute');
          updatedCols[0].filterable.cell.template(args);
          expect(args.element[0].setAttribute).toHaveBeenCalled();
        }));

      it('Should test filter template for decimal column',
        inject(function (localStorageService, CustomizeColumnService) {

          var columndef = localStorageService.get('PipelineGetColumnDef');
          columndef['762'].Datatype = 'DECIMAL_2';
          localStorageService.set('PipelineGetColumnDef', columndef);
          var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);

          var args = {
            element: [{
              maxLength: 0
            }]
          };
          args.element.kendoNumericTextBox = function(data) {
            expect(data).toBeDefined();
            expect(data.step).toBeDefined();
            expect(data.step).toBe(0);
            expect(data.decimals).toBeDefined();
            expect(data.decimals).toBe('2');
            expect(data.spinners).toBeDefined();
            expect(data.spinners).toBe(false);
          };
          spyOn(args.element, 'kendoNumericTextBox');
          updatedCols[0].filterable.cell.template(args);
          expect(args.element[0].maxLength).toBe(12);
          expect(args.element.kendoNumericTextBox).toHaveBeenCalled();
        }));

      it('Should test filter template for date column',
        inject(function (localStorageService, CustomizeColumnService) {

          var columndef = localStorageService.get('PipelineGetColumnDef');
          columndef['762'].Datatype = 'DATE';
          localStorageService.set('PipelineGetColumnDef', columndef);
          var updatedCols = CustomizeColumnService.getUpdatedColumns(columns);

          var args = {
            element: [{
              setAttribute: function (data, func) {
                expect(data).toBeDefined();
                expect(data).toBe('onkeyup');
                expect(func).toBeDefined();
                expect(func).toBe('if(event.keyCode === 13) { this.blur(); }');
              }
            }]
          };
          args.element.kendoMaskedTextBox = function(data) {
            expect(data).toBeDefined();
          };
          args.element.kendoDatePicker = function(data) {
            expect(data).toBeDefined();
            expect(data.format).toBeDefined();
            expect(data.format).toBe('MM/dd/yyyy');

          };
          spyOn(args.element, 'kendoMaskedTextBox');
          spyOn(args.element, 'kendoDatePicker');
          updatedCols[0].filterable.cell.template(args);
          expect(args.element.kendoMaskedTextBox).toHaveBeenCalled();
          expect(args.element.kendoDatePicker).toHaveBeenCalled();
        }));
    });
  });
})();
