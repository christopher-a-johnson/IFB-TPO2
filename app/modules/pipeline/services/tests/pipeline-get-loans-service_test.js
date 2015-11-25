(function () {
  'use strict';
  describe('PipelineGetLoans Service', function () {
    var env, httpBackend, Restangular;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_) {
      env = ENV;
      httpBackend = $httpBackend;
      Restangular = _Restangular_;

    }));

    it('PipelineGetLoans - resolvePromise grid data should be as per data type',
      inject(function (PipelineGetLoans, PipelineDataStore, PipelineConst) {
        PipelineDataStore.LoanFolderDropdownData = {selectedItem: PipelineConst.AllFolder};
        PipelineDataStore.LoanViewDropdownData = {selectedItem: {'id': 'All', 'title': 'All Loans'}};
        PipelineDataStore.CompanyViewDropdownData = {
          selectedItem: {
            'id': 'Internal',
            'title': 'Internal Organization'
          }
        };
        PipelineDataStore.externalOrg = {id: null};
        PipelineDataStore.PipelineGridData = {
          sort: [], data: {
            columns: [
              {
                'sortable': true,
                'uniqueID': 'Fields.3',
                'field': 'Fields$3',
                'title': 'Note Rate',
                'FieldId': '3',
                'orderIndex': 5,
                'name': 'Loan.LoanRate',
                'type': 'decimal_3',
                'format': '{0:0.000}',
                'alignment': 'Right',
                'width': '100px',
                'required': null,
                'sortOrder': 'None',
                'sortPriority': '-1',
                'filterable': {
                  'cell': {
                    'showOperators': false,
                    'operator': 'eq'
                  }
                }
              },
              {
                'sortable': true,
                'uniqueID': 'Loan.NextMilestoneDate',
                'field': 'Loan$NextMilestoneDate',
                'title': 'Next Expected Milestone Date',
                'FieldId': 'Pipeline.NextMilestoneDate',
                'orderIndex': 10,
                'name': 'Loan.NextMilestoneDate',
                'type': 'date',
                'format': '{0:MM/dd/yyyy}',
                'alignment': 'Right',
                'width': '100px',
                'required': null,
                'sortOrder': 'None',
                'sortPriority': '-1',
                'filterable': {
                  'cell': {
                    'showOperators': true,
                    'operator': 'eq'
                  }
                }
              },
              {
                'sortable': true,
                'uniqueID': 'Fields.1109',
                'field': 'Fields$1109',
                'title': 'Loan Amount',
                'FieldId': '1109',
                'orderIndex': 4,
                'name': 'Loan.LoanAmount',
                'type': 'decimal_2',
                'format': '{0:0.00}',
                'alignment': 'Right',
                'width': '100px',
                'required': null,
                'sortOrder': 'None',
                'sortPriority': '-1',
                'filterable': {
                  'cell': {
                    'showOperators': false,
                    'operator': 'eq'
                  }
                }
              },
              {
                'sortable': true,
                'uniqueID': 'Fields.362',
                'field': 'Fields$362',
                'title': 'Loan Amount Partial',
                'FieldId': '1109',
                'orderIndex': 4,
                'name': 'Loan.LoanAmount',
                'type': 'decimal_10',
                'format': '{0:0.0000000000}',
                'alignment': 'Right',
                'width': '100px',
                'required': null,
                'sortOrder': 'None',
                'sortPriority': '-1',
                'filterable': {
                  'cell': {
                    'showOperators': false,
                    'operator': 'eq'
                  }
                }
              },
              {
                'sortable': true,
                'uniqueID': 'Fields.364',
                'field': 'Fields$364',
                'title': 'Loan Number',
                'FieldId': '364',
                'orderIndex': 2,
                'name': 'Loan.LoanNumber',
                'type': 'string',
                'format': '',
                'alignment': 'Right',
                'width': '100px',
                'required': null,
                'sortOrder': 'None',
                'sortPriority': '-1',
                'filterable': {
                  'cell': {
                    'showOperators': false,
                    'operator': 'eq'
                  }
                }
              }
            ],
            items: []
          }
        };

        spyOn(Restangular, 'all').and.callThrough();
        httpBackend.expectPOST(env.restURL + '/pipeline/loan/pipelinedata').respond({
          'TotalLoans': 5000, 'IsOverflow': true, 'Items': [
            {
              'AlertCount': 14,
              'FieldData': [
                {
                  'Name': 'Fields.3',
                  'Value': '5.7500000000'
                },
                {
                  'Name': 'Loan.NextMilestoneDate',
                  'Value': '2/5/2014 1:12:00 PM'
                },
                {
                  'Name': 'Fields.1109',
                  'Value': '-142500.0000000000'
                },
                {
                  'Name': 'Fields.362',
                  'Value': '408956.25466985232877'
                },
                {
                  'Name': 'Fields.364',
                  'Value': '1402EM000158'
                }
              ],
              'LoanId': '00e9f6d6-40b6-416e-b1b7-b40bfb9b729b',
              'LockedBy': ''
            }]
        });
        PipelineGetLoans.resolvePromise();
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/pipelinedata');
        httpBackend.flush();
        expect(PipelineDataStore.PipelineGridData.data.items.length).toBe(1);

        expect(typeof PipelineDataStore.PipelineGridData.data.items[0].Fields$3).toBe('number');
        expect(typeof PipelineDataStore.PipelineGridData.data.items[0].Loan$NextMilestoneDate).toBe('object');
        expect(typeof PipelineDataStore.PipelineGridData.data.items[0].Fields$1109).toBe('number');
        expect(typeof PipelineDataStore.PipelineGridData.data.items[0].Fields$362).toBe('number');
        expect(typeof PipelineDataStore.PipelineGridData.data.items[0].Fields$364).toBe('string');
      }));

    it('Should check if refresh is called when auto refresh interval has passed',
      inject(function (PipelineDataStore, PipelineGetLoans, $interval) {
        PipelineDataStore.PersonaAccess = {LoanMgmt: {'LoanMgmt_PipelineAutoRefresh': true}};
        PipelineDataStore.AutoRefreshInterval = 30;
        spyOn(PipelineGetLoans, 'refresh').and.callFake(function () {

        });
        PipelineGetLoans.setAutoRefresh();
        $interval.flush((PipelineDataStore.AutoRefreshInterval * 1000));
        expect(PipelineGetLoans.refresh).toHaveBeenCalled();
      }));

    it('Should check that refresh should not be called if interval has not passed.',
      inject(function (PipelineDataStore, PipelineGetLoans, $interval) {
        PipelineDataStore.PersonaAccess = {LoanMgmt: {'LoanMgmt_PipelineAutoRefresh': true}};
        PipelineDataStore.AutoRefreshInterval = 30;
        spyOn(PipelineGetLoans, 'refresh').and.callFake(function () {
        });
        PipelineGetLoans.setAutoRefresh();
        $interval.flush((PipelineDataStore.AutoRefreshInterval * 999));
        expect(PipelineGetLoans.refresh).not.toHaveBeenCalled();
      }));

    it('Should check that refresh should not be called if user does not have auto refresh rights.',
      inject(function (PipelineDataStore, PipelineGetLoans, $interval) {
        PipelineDataStore.PersonaAccess = {LoanMgmt: {'LoanMgmt_PipelineAutoRefresh': false}};
        PipelineDataStore.AutoRefreshInterval = 30;
        spyOn(PipelineGetLoans, 'refresh').and.callFake(function () {
        });
        PipelineGetLoans.setAutoRefresh();
        $interval.flush((PipelineDataStore.AutoRefreshInterval * 1000));
        expect(PipelineGetLoans.refresh).not.toHaveBeenCalled();
      }));

    it('Should have called ResetAutoRefreshPipeline',
      inject(function (PipelineGetLoans, $rootScope, PipelineEventsConst, $q, PipelineDataStore) {
        PipelineDataStore.PersonaAccess = {LoanMgmt: {'LoanMgmt_PipelineAutoRefresh': true}};
        var response = {
          CategoryField: 'Pipeline',
          SettingsField: [{
            Name: 'RefreshInterval',
            Value: '30'
          }]
        };
        var payload = {
          Category: 'Pipeline',
          Setting: 'RefreshInterval'
        };
        spyOn(Restangular, 'all').and.callThrough();
        httpBackend.expectPOST(env.restURL + '/user/getusersettings', payload).respond(response);
        var deferred = $q.defer();
        var promise = deferred.promise;
        var scope = $rootScope.$new();
        deferred.reject('Test');
        /*This is specifically added so that restangular call fails: There is no point is sending request with payload because we need to
         * fail the call*/
        Restangular.all.and.callFake(function () {
          var returnALL = {
            customPOST: function () {
              return promise;
            }
          };
          return returnALL;
        });
        spyOn($rootScope, '$broadcast').and.callThrough();
        PipelineGetLoans.resolvePromise();
        PipelineGetLoans.setAutoRefresh();
        scope.$apply();
        PipelineGetLoans.resetPipelineErrorStatus();
        expect($rootScope.$broadcast).toHaveBeenCalled();
      }));

    it('Should have called refreshError', inject(function ($rootScope, PipelineEventsConst, PipelineGetLoans) {
      spyOn($rootScope, '$broadcast').and.callThrough();
      $rootScope.$on(PipelineEventsConst.PIPELINE_AUTOREFRESH_EVENT, function (event, data) {
        expect(data).toBe(true);
      });
      PipelineGetLoans.refreshError(true);
      expect($rootScope.$broadcast).toHaveBeenCalled();
    }));

    it('Should show The Cached Data Expiration Pop up on Pipeline Cached Data Expiration',
      inject(function ($rootScope, modalWindowService, $q, PipelineEventsConst, PipelineGetLoans) {
        var response = {};
        var popupPromise;
        var popupDeferred = $q.defer();
        popupPromise = {result: popupDeferred.promise};
        popupDeferred.resolve(false);
        var scope = $rootScope.$new();
        var error = {
          data: {
            code: 400,
            details: 'Cursor Expired',
            summary: 'CursorExpired'
          }
        };
        var payload = {
          StartIndex: 51,
          EndIndex: 100
        };
        spyOn(Restangular, 'all').and.callThrough();
        httpBackend.expectPOST(env.restURL + '/pipeline/loan/pipelinedatapaged', payload).respond(response);
        var deferred = $q.defer();
        var promise = deferred.promise;
        deferred.reject(error);
        /*This is specifically added so that restangular call fails: There is no point is sending request with payload because we need to
         * fail the call*/
        Restangular.all.and.callFake(function () {
          var returnALL = {
            customPOST: function () {
              return promise;
            }
          };
          return returnALL;
        });
        spyOn(modalWindowService, 'showErrorPopup').and.callFake(function (messageText, title) {
          return popupPromise;
        });
        spyOn($rootScope, '$broadcast');
        PipelineGetLoans.resolvePipelineDataPaged(1);
        scope.$apply();
        expect(modalWindowService.showErrorPopup).toHaveBeenCalled();
        expect($rootScope.$broadcast).toHaveBeenCalledWith(PipelineEventsConst.REFRESH_GRID_EVENT);
      }));
  });
})();
