(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PipelineGetLoans', PipelineGetLoans);
  /* @ngInject */
  function PipelineGetLoans(Restangular, PipelineConst, PipelineEventsConst, PipelineDataStore, _,
                            $interval, $timeout, $rootScope, PipelineHelperService, modalWindowService, SessionStorage) {

    /**
     *@ngdoc method
     *@name mapResonse
     *@methodOf elli.encompass.web.pipeline.PipelineGetLoans
     * @description
     * Maps the loan data response object from the API and load them to the PipelineDataStore objects
     * @param {string} response from the API
     * {boolean} true when called from the paged api
     */
    var mapResponse = function (response, paged) {
      //console.log('original data ', Restangular.stripRestangular(response));
      var _tempRowObj, loans = [];
      _.each(response.Items, function (pipelineRow) {
        _tempRowObj = {
          Loan$Guid: pipelineRow.LoanId,
          LockedBy: pipelineRow.LockedBy,
          ReadOnly: pipelineRow.ReadOnly,
          CurrentLoanAssociateID: pipelineRow.CurrentLoanAssociateId,
          CurrentLoanAssociateGroupID: pipelineRow.CurrentLoanAssociateGroupId
        };
        var columnIndex = 0;
        _.each(pipelineRow.FieldData, function (rowFields) {
          var valueByColumnType = null;
          if (typeof PipelineDataStore.PipelineGridData.data.columns[columnIndex] !== 'undefined'
            && typeof PipelineDataStore.PipelineGridData.data.columns[columnIndex].type !== 'undefined') {
            valueByColumnType =
              getValueByColType(PipelineDataStore.PipelineGridData.data.columns[columnIndex].type, rowFields.Value);
          } else {
            valueByColumnType = rowFields.Value;
          }

          if (rowFields.Name === 'Loan.LoanFolder' && typeof rowFields.Value !== 'undefined' && rowFields.Value !== '') {
            var isArchiveFolder = _.findWhere(pipelineRow.FieldData, {Name: 'LoanFolder.Archive'});
            if (isArchiveFolder && isArchiveFolder.Value === 'Y') {
              valueByColumnType = '<' + rowFields.Value + '>';
            }
          }
          _tempRowObj[PipelineHelperService.getColumnNameForKendoGrid(rowFields.Name)] = valueByColumnType;
          columnIndex++;
        });
        loans.push(_tempRowObj);
      });

      angular.copy(loans, PipelineDataStore.PipelineGridData.data.items);

      if (!paged) {
        PipelineDataStore.PipelineGridData.totalResults = response.TotalLoans || 0;
        $timeout(function () {
          $rootScope.$broadcast(PipelineEventsConst.MAX_LOANS_EVENT, response.IsOverflow, response.TotalLoans);
        }, 0);
      }
      $timeout(function () {
        PipelineDataStore.PipelineGridData.viewLoaded = true;
      }, 0);
    };

    function getValueByColType(colType, val) {
      if (val && val.trim() !== '') {
        colType = colType.toLowerCase();
        if (colType === 'date') {
          val = new Date(val);
        } else if (colType.indexOf('decimal') !== -1) {
          val = parseFloat(val);
        } else if (colType.indexOf('integer') !== -1) {
          val = parseInt(val, 10);
        }
      }
      return val;
    }

    function getSortArray() {
      var sortArray = [];
      if (PipelineDataStore.PipelineGridData.sort.length > 0) {
        if (PipelineDataStore.PipelineGridData.sort[0].field) {
          var findColumn = _.findWhere(PipelineDataStore.PipelineGridData.data.columns,
            {field: PipelineDataStore.PipelineGridData.sort[0].field});
          if (findColumn) {
            sortArray.push({
              Name: findColumn.sortKeyName,
              SortOrder: PipelineDataStore.PipelineGridData.sort[0].dir === 'asc' ? 'Ascending' : 'Descending'
            });
          } else {
            //reset the sort array when the column is removed from the grid and reset kendo grid sort
            $rootScope.$broadcast(PipelineEventsConst.RESET_GRID_SORT_EVENT);
          }
        }
      }
      return sortArray;
    }

    function getFiltersForPayload() {
      var filtersForPayload = [];

      //If the selected loan folder is "All Folders", add a default filter to exclude loans from the Trash folder
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem === PipelineConst.AllFolder) {
        filtersForPayload.push({
            CriterionName: 'Loan.LoanFolder',
            FieldType: 'IsString',
            JointToken: 'and',
            LeftParentheses: 0,
            OpType: 'NotEqual',
            RightParentheses: 0,
            ValueFrom: PipelineConst.TrashFolder
          }
        );
      }

      _.each(PipelineDataStore.PipelineGridData.filters, function (filter) {
        if (filter.JointToken === '') {
          filter.JointToken = 'and';
        }
        filtersForPayload.push(_.omit(filter, 'FieldDescription', 'DataSource', 'ForceDataConversion', 'Header', 'FieldOptions',
          'IsVolatile', 'OpDesc', 'field', 'Name', 'FieldID', 'Datatype', 'AdvFilterType', 'OperatorOptions', 'ValueDescription',
          'parenEndList', 'parenStartList', 'addedFromGrid'));
      });
      return filtersForPayload.length <= 0 ? null : filtersForPayload;
    }

    var intervalPromise;
    var isPipelineOnline;
    var isAutoRefreshCalled = false;

    var loanService = {
      resolvePromise: function (pageIndex) {
        pageIndex = pageIndex || 1;
        PipelineDataStore.LoansDataLoaded = false;
        var gridColumns = _.map(PipelineDataStore.PipelineGridData.data.columns, function (column) {
          //return column.uniqueID;
          //TODO: NGENC-6153 - For Kendo - temp workaround when there are special characters in the uniqueid, pass the name to the API
          return /[^A-Za-z0-9$. -]/g.test(column.name) ? column.name : column.uniqueID;
        });

        // few columns we always need...
        //LoanStatus(Fields.1393) for loan status icons & row colouring in grid
        //Loan.LockAndRequestStatus - Needed if only LockStatus column is added to the grid which needs this data for the icons
        //LockExpirationDate(Fields.762) to display # of days remaining for lock expiration on grid
        //For thin-thick interaction --- LoanNumber(Fields.364), LoanName, BorrowerName, LoanAmount(Fields.1109)
        //LoanFolder - needed to enable or disable MoveToFolder button based on the FromFolders list in the persona setting
        //'LoanFolder.Archive' - is needed to add the "< >" brackets if the folder is an Archive folder
        var alwaysRequestedColumns = [
          'Fields.1393',
          'Loan.LockAndRequestStatus',
          'Fields.762',
          'Fields.364',
          'Loan.LoanName',
          'Loan.BorrowerName',
          'Fields.1109',
          'Loan.LoanFolder',
          'LoanFolder.Archive'
        ];

        var columns = gridColumns;
        //Don't add the above columns again if they are already added in the grid
        _.each(alwaysRequestedColumns, function (col) {
          if (!(_.contains(gridColumns, col))) {
            columns.push(col);
          }
        });

        var payload = {
          CursorId: SessionStorage.get('PipelineCursorId') || null,
          LoanFolder: (PipelineDataStore.LoanFolderDropdownData.selectedItem !== PipelineConst.AllFolder ?
            (PipelineDataStore.LoanFolderDropdownData.selectedItem || '') : ''),
          Ownership: PipelineDataStore.LoanViewDropdownData.selectedItem ?
            PipelineDataStore.LoanViewDropdownData.selectedItem.id : null, //'All' & 'User'
          OrgType: PipelineDataStore.CompanyViewDropdownData.selectedItem ?
            PipelineDataStore.CompanyViewDropdownData.selectedItem.id : null, //'Internal' & 'TPO',
          ExternalOrgId: PipelineDataStore.externalOrg.id === '-1' ? null : PipelineDataStore.externalOrg.id,
          Fields: columns,
          FieldSort: getSortArray(),
          Filter: getFiltersForPayload(),
          StartIndex: ((pageIndex - 1) * PipelineConst.PipelineGridPageSize) + 1,
          EndIndex: pageIndex * PipelineConst.PipelineGridPageSize
        };

        console.log('getloans - create cursor payload', payload);

        return Restangular.all('pipeline/loan/pipelinedata').customPOST(payload || {})
          .then(function (response) {
            if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
              PipelineDataStore.VERBOSE_LOG.API_DATA_LOADED = true;
            }
            //Store the CursorId in the SessionStorage and pass it in the API payload
            SessionStorage.set('PipelineCursorId', (response && response.CursorId) ? response.CursorId : null);
            mapResponse(response || [], false);
            PipelineDataStore.LoansDataLoaded = true;
            loanService.resetPipelineErrorStatus();
          }, function (error) {
            SessionStorage.set('PipelineCursorId', null);
            mapResponse([], false);
            //Send notification to error popup to show up
            if (isAutoRefreshCalled === true) {
              isPipelineOnline = false;
              loanService.refreshError(true);
              isAutoRefreshCalled = false;
            }
          });
      },

      resolvePipelineDataPaged: function (pageIndex) {
        mapResponse([], true); //reset the grid data

        var payload = {
          CursorId: SessionStorage.get('PipelineCursorId') || null,
          StartIndex: ((pageIndex - 1) * PipelineConst.PipelineGridPageSize) + 1,
          EndIndex: pageIndex * PipelineConst.PipelineGridPageSize
        };

        console.log('getloans - paged payload', payload);

        return Restangular.all('pipeline/loan/pipelinedatapaged').customPOST(payload || {}, null, null, {handled: true})
          .then(function (response) {
            if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
              PipelineDataStore.VERBOSE_LOG.API_DATA_LOADED = true;
            }
            mapResponse(response, true);
            //Reset state of Error popup to show again when errror is raised during auto refresh
            loanService.resetPipelineErrorStatus();
          }, function (error) {
            SessionStorage.set('PipelineCursorId', null);
            var errMsgs = [PipelineConst.CursorExpired];
            errMsgs.some(function (condition) {
              if (typeof error.data.summary !== 'undefined' && !!error.data.summary
                && error.data.summary.lastIndexOf(condition, 0) === 0) {
                var windowInstance = modalWindowService.showErrorPopup(PipelineConst.CachedDataExpirationMessage,
                  PipelineConst.CachedDataExpirationTitle);
                windowInstance.result.then(function () {
                  $rootScope.$broadcast(PipelineEventsConst.REFRESH_GRID_EVENT);
                });
              }
            });
          });
      },

      refresh: function (pageIndex) {
        //create a new cursor & get data for the requested page
        loanService.resolvePromise(pageIndex).then(function () {
          loanService.setAutoRefresh();
        });
      },

      setAutoRefresh: function () {
        if (PipelineDataStore.AutoRefreshInterval !== -1 && PipelineDataStore.PersonaAccess.LoanMgmt &&
          PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_PipelineAutoRefresh) {
          if (angular.isDefined(intervalPromise)) {
            $interval.cancel(intervalPromise);
            intervalPromise = undefined;
          }
          intervalPromise = $interval(loanService.refresh, PipelineDataStore.AutoRefreshInterval * 1000);
          intervalPromise.then(null, null, function () {
            isAutoRefreshCalled = true;
          });
        }
      },
      /*Notify that there were errors while refreshing data*/
      refreshError: function (isError) {
        $rootScope.$broadcast(PipelineEventsConst.PIPELINE_AUTOREFRESH_EVENT, isError);
      },
      resetPipelineErrorStatus: function () {
        if (isPipelineOnline === false) {
          $rootScope.$broadcast(PipelineEventsConst.PIPELINE_AUTOREFRESH_EVENT, false);
          isPipelineOnline = true;
        }
      }
    };
    return loanService;
  }
})
();
