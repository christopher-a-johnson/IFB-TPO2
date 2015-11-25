(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').controller('PipelineGridController', PipelineGridController);

  /* @ngInject */
  function PipelineGridController(applicationLoggingService, encompass, LoanFolderDropdownData,
                                  LoanPropertiesInfoService, PipelineConst, PipelineGetLoans, kendo,
                                  PipelineDataStore, $timeout, modalWindowService, $scope, $rootScope,
                                  SetMenuStateService, PipelineEventsConst, _, MoveLoanFolderList,
                                  SetPipelineViewXmlService, PipelineGetView, PipelineFilterService, PipelineHelperService) {
    var vm = this;
    var windoInstance, customizeColumnSelected;
    vm.pipelineViewDataStore = PipelineDataStore; //use PipelineDataStore here in js & vm.pipelineViewDataStore in html
    vm.isDisableComplianceServices = false;
    vm.isDisableInvestorServices = false;
    vm.isNorthCarolinaReportEnable = false;
    vm.moveFolderDropdownSource = [];
    vm.pipelineConstants = PipelineConst;
    vm.DataServiceFannie = PipelineConst.DataServiceFannie;
    vm.DataServiceFreddie = PipelineConst.DataServiceFreddie;
    vm.investorExport = investorStandardExport;
    vm.exportFannieMaeFormattedFile = exportFannieMaeFormattedFile;
    vm.displayLoanProperties = displayLoanProperties;

    function setOpenLoanCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.OpenLoanCallBackLog + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    function setThinPipelineInfoCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.SetThinPipelineInfos + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    function getGridDataForSetThinInfo() {
      var selectedLoanData = [];
      _.each(PipelineDataStore.PipelineGridData.selected, function (dataItem) {
        if (typeof dataItem !== 'undefined') {
          selectedLoanData.push({
            'LoanGuid': dataItem.Loan$Guid,
            'LoanNumber': dataItem.Fields$364,
            'LoanName': dataItem.Loan$LoanName,
            'BorrowerName': dataItem.Loan$BorrowerName,
            'LoanAmount': dataItem.Fields$1109 || 0
          });
        }
      });
      return selectedLoanData;
    }

    vm.onGridDoubleClick = function () {
      //FixMe Need to write generic code to get selected data.
      PipelineDataStore.duplicateButtonDisabled = PipelineDataStore.PipelineGridData.selected.length > 1;
      var menuStates = [{
        MenuItemTag: 'PI_Duplicate',
        Enabled: !PipelineDataStore.duplicateButtonDisabled && vm.showDuplicateLoanButton,
        Visible: vm.showDuplicateLoanButton
      }];
      SetMenuStateService.setThickClientMenuState(menuStates);
      var jsonParams = {ThinPipelineInfos: getGridDataForSetThinInfo()};
      encompass.setThinPipelineInfos(JSON.stringify(jsonParams), setThinPipelineInfoCallback);
      if (LoanFolderDropdownData.selectedItemTitle === PipelineConst.Trash) {
        windoInstance = modalWindowService.showConfirmationPopup(
          PipelineConst.PopupMessage, PipelineConst.PopupTitle
        );
        windoInstance.result.then(function (result) {
          if (!result) {
            $timeout(function () {
              encompass.openLoan('', setOpenLoanCallback);
            }, 0, false);
          }
        });
      }
      else {
        $timeout(function () {
          encompass.openLoan('', setOpenLoanCallback);
        }, 0, false);
      }
    };

    function gridSelectionChange(data) {
      PipelineDataStore.PipelineGridData.selected = data;
      //Removed this code and added in following if else block
      //PipelineDataStore.excelButtonDisabled = false;
      //PipelineDataStore.printButtonDisabled = false;
      PipelineDataStore.duplicateButtonDisabled = false;
      PipelineDataStore.editLoanButtonDisabled = false;
      if (PipelineDataStore.PipelineGridData.selected.length > 0) {
        var isMultiLoans = PipelineDataStore.PipelineGridData.selected.length > 1;
        PipelineDataStore.duplicateButtonDisabled = isMultiLoans;
        PipelineDataStore.editLoanButtonDisabled = isMultiLoans;
        PipelineDataStore.notifyButtonDisabled = false;
        PipelineDataStore.moveToFolderButtonDisabled = vm.isMoveFromFolderAccessDisabled(data);
        PipelineDataStore.deleteIconDisabled = false;
        //As per existing Encompass "Export to excel" and "Print forms" needs to be enabled if one or more rows are selected
        PipelineDataStore.excelButtonDisabled = false;
        PipelineDataStore.printButtonDisabled = false;
        PipelineDataStore.transferButtonDisabled = false;
      }
      else {
        PipelineDataStore.notifyButtonDisabled = true;
        PipelineDataStore.moveToFolderButtonDisabled = true;
        PipelineDataStore.deleteIconDisabled = true;
        PipelineDataStore.duplicateButtonDisabled = true;
        PipelineDataStore.editLoanButtonDisabled = true;
        //As per existing Encompass "Export to excel" and "Print forms" needs to be disabled no rows are selected
        PipelineDataStore.excelButtonDisabled = true;
        PipelineDataStore.printButtonDisabled = true;
        PipelineDataStore.transferButtonDisabled = true;
      }
      encompass.setThinPipelineInfos(JSON.stringify({
        ThinPipelineInfos: getGridDataForSetThinInfo()
      }), setThinPipelineInfoCallback);

      setThickClientMenuStates();
    }

    vm.gridSelectionChange = gridSelectionChange;

    /*Change orderIndex of column object, so that correct orderIndex is referred in Save view and Display correct
     order in customize column popup*/
    function reorderGridColumn(gridColumns, sourceIndex, targetIndex) {
      if (sourceIndex === targetIndex || sourceIndex < 0 || targetIndex < 0) {
        //return if index data is invalid
        gridColumns = null;
        return;
      } else {
        //change order index of source column to target order index
        gridColumns[sourceIndex].OrderIndex = targetIndex;
        while (sourceIndex !== targetIndex) {
          //Rebuild all the column's order index as per new change
          gridColumns[sourceIndex > targetIndex ? sourceIndex - 1 : sourceIndex + 1].OrderIndex = sourceIndex;
          sourceIndex = sourceIndex > targetIndex ? --sourceIndex : ++sourceIndex;
        }
      }
      return gridColumns;
    }

    vm.columnReorder = function (e) {
      if (e.hasOwnProperty('column')) {
        var grid = this;
        var gridColumnsCopy = angular.copy(this.columns);
        reorderGridColumn(gridColumnsCopy, parseInt(e.oldIndex, 10), parseInt(e.newIndex, 10));
        if (gridColumnsCopy !== null) {
          //$timeout is required to wait till the time Kendo operations are complete
          $timeout(function () {
            _.each(gridColumnsCopy, function (item) {
                var reorderNode = _.findWhere(grid.columns, {FieldId: item.FieldId});
                reorderNode.OrderIndex = item.OrderIndex;
              }
            );
            //Copy modified columns data to data store, this operation rebinds the grid data
            angular.copy(grid.columns, PipelineDataStore.PipelineGridData.data.columns);
            PipelineDataStore.PipelineGridData.data.columns[0].hidden = true;
          }, 0);
        }
      }
      $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
    };

    vm.columnResize = function (e) {
      if (e.hasOwnProperty('column')) {
        $timeout(function () {
          var resizedItem = _.findWhere(PipelineDataStore.PipelineGridData.data.columns, {FieldId: e.column.FieldId});
          resizedItem.width = e.column.width;
        }, 0);
      }
      $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
    };

    vm.onDataBound = function (e) {
      //NGENC-5399(Solution telerik dojo link http://dojo.telerik.com/@d.madjarov/iWUke/6
      e.sender.showColumn(0);
      //To set auto width for column's operator fropdown auto Kendo suggested below method //http://dojo.telerik.com/@c0re/abOZO/2
      _.each(PipelineDataStore.PipelineGridData.data.columns, function (column, index) {
        if (column.type === 'integer' || column.type === 'date' ||
          column.type.indexOf('decimal') !== -1) {
          var cell = (angular.element('.k-filter-row [data-role="filtercell"]').eq(index))
            .find('[data-role="dropdownlist"]').data('kendoDropDownList');
          if (cell) {
            cell.list.addClass('ngen-filter-dropdown');
          }
        }
      });
      var grid = e.sender;

      //Disable move to folder button if grid rendered with no records
      if (grid.dataSource.data().length === 0) {
        vm.disableMoveFolderButton();
        PipelineDataStore.excelButtonDisabled = true;
        /*Below code is for reset pipeline  grid data and selection */
        PipelineDataStore.PipelineGridData.selected = [];
        gridSelectionChange([]);
      }
      /* pipeline grid coloring */
      grid.dataSource.data().forEach(function (dataItem) {
        if (dataItem.LockedBy !== '' || dataItem.ReadOnly) {
          grid.tbody.find('tr[data-uid="' + dataItem.uid + '"]').addClass('pl-grid-row-readonlystatus');
        }
        ['Application approved but not accepted', 'Application denied', 'Application withdrawn',
          'File Closed for incompleteness', 'Preapproval request denied by financial institution',
          'Preapproval request approved but not accepted'].some(function (status) {
            if (typeof dataItem !== 'undefined' && typeof dataItem.Fields$1393 !== 'undefined' &&
              dataItem.Fields$1393 !== null && dataItem.Fields$1393.toUpperCase() === status.toUpperCase()) {
              grid.tbody.find('tr[data-uid="' + dataItem.uid + '"]').addClass('pl-grid-row-adversestatus');
              return true;
            }
          });
      });

      //If no filter then display none in Filter row
      if (PipelineDataStore.PipelineGridData.filters.length === 0) {
        PipelineDataStore.filterSummary = 'None';
      }

      if (grid.dataSource.total() && grid.dataSource.total() > 0) {
        //function to select first row
        grid.select(e.sender.tbody.find('tr:first'));

        PipelineDataStore.notifyButtonEnabled = true;
      }
      grid.tbody.find('>tr').on('dblclick', function (e) {
        vm.onGridDoubleClick();
      });
      vm.setEditLoanButtonStatus(grid.dataSource.total());

      if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
        if (PipelineDataStore.VERBOSE_LOG.API_DATA_LOADED) {
          applicationLoggingService.debug('PERF:' + PipelineDataStore.VERBOSE_LOG.ACTION + ' - Duration: '
            + ((new Date().getTime() - PipelineDataStore.VERBOSE_LOG.START_TIME) / 1000).toString() + 's');
          PipelineDataStore.VERBOSE_LOG = {API_DATA_LOADED: false, START_TIME: '', ACTION: ''};
        }
      }
    };

    // Check user have permission to move loan from folder
    vm.isMoveFromFolderAccessDisabled = function (selectedRows) {
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem ===
        PipelineConst.TrashFolder && PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_TF_Restore) {
        return false;
      }
      else {
        var moveFromFolderList = PipelineDataStore.MoveLoanFromFolderList.items || [];
        var selectedRowsLoanFolder = _.uniq(_.pluck(selectedRows, 'Loan$LoanFolder'));
        return (selectedRowsLoanFolder.length !== _.intersection(selectedRowsLoanFolder, moveFromFolderList).length);
      }
    };

    vm.setEditLoanButtonStatus = function (total) {

      if (total === 0) {
        PipelineDataStore.duplicateButtonDisabled = true;
        PipelineDataStore.editLoanButtonDisabled = true;
      }
      var menuStates = [{
        MenuItemTag: 'PI_Duplicate',
        Enabled: !PipelineDataStore.duplicateButtonDisabled && vm.showDuplicateLoanButton,
        Visible: vm.showDuplicateLoanButton
      }, {
        MenuItemTag: 'PI_Edit',
        Enabled: !PipelineDataStore.editLoanButtonDisabled,
        Visible: !PipelineDataStore.editLoanButtonDisabled
      }];
      SetMenuStateService.setThickClientMenuState(menuStates);
    };

    /*Disable move to folder button if grid has no loan records*/
    vm.disableMoveFolderButton = function () {
      PipelineDataStore.moveToFolderButtonDisabled = true;
      var menuStates = [{
        MenuItemTag: 'PI_Move',
        Enabled: !PipelineDataStore.moveToFolderButtonDisabled && vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Move,
        Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Move
      }];
      SetMenuStateService.setThickClientMenuState(menuStates);
    };

    /* Compliance */
    vm.exportLEFPipeline = exportLEFPipeline;
    vm.generateNMLSReport = generateNMLSReport;
    vm.generateNCMLDReport = generateNCMLDReport;
    /* Compliance */
    /*  Save button  */

    function mapGridFilterOperator(gridOperator, fieldType) {
      var operator = '';
      switch (gridOperator.toLowerCase()) {
        case 'eq':
          operator = (fieldType === 'IsString' ? 'Contains' : (fieldType === 'IsOptionList' ? 'IsAnyOf' : 'Equals'));
          break;
        case 'neq':
          operator = 'NotEqual';
          break;
        case 'lt':
          operator = (fieldType === 'IsDate' || fieldType === 'IsMonthDay') ? 'DateBefore' : 'LessThan';
          break;
        case 'lte':
          operator = (fieldType === 'IsDate' || fieldType === 'IsMonthDay') ? 'DateOnOrBefore' : 'NotGreaterThan';
          break;
        case 'gt':
          operator = (fieldType === 'IsDate' || fieldType === 'IsMonthDay') ? 'DateAfter' : 'GreaterThan';
          break;
        case 'gte':
          operator = (fieldType === 'IsDate' || fieldType === 'IsMonthDay') ? 'DateOnOrAfter' : 'NotLessThan';
          break;
      }
      return operator;
    }

    function getNewFilter(filter) {
      var gridColumn = _.findWhere(PipelineDataStore.PipelineGridData.data.columns, {field: filter.field});
      var dateRecurring = false; // always false from grid
      var colType = PipelineFilterService.getFieldTypeForFilters(gridColumn.type, dateRecurring);
      return {
        CriterionName: gridColumn.uniqueID,
        FieldType: colType,
        Header: gridColumn.title,
        JointToken: 'and',
        LeftParentheses: 0,
        OpType: mapGridFilterOperator(filter.operator, colType),
        RightParentheses: 0,
        ValueFrom: filter.value,
        ValueTo: '',
        field: filter.field,
        addedFromGrid: true,
        //Added for Advance Search filter
        FieldID: gridColumn.FieldId,
        Datatype: angular.uppercase(gridColumn.type),
        FieldOptions: gridColumn.list
      };
    }

    function updateFilterSummary() {
      var filterSummary = '';
      _.each(PipelineDataStore.PipelineGridData.filters, function (filter, index) {
        if (filterSummary !== '') {
          filterSummary = filterSummary + ' ' + PipelineDataStore.PipelineGridData.filters[index - 1].JointToken + ' ';
        }
        filterSummary = filterSummary + ' ' + PipelineFilterService.getFilterSummary(filter);
      });
      PipelineDataStore.filterSummary = filterSummary;
    }

    function mapGridFilters(filters, reloadLoanData) {
      var tempFilter, operatorType, updateSummary = false;

      //Remove filters from the datastore object that are added through the grid and later removed
      _.remove(PipelineDataStore.PipelineGridData.filters, function (filter) {
        if (filter.addedFromGrid) {
          var tempField;
          if (filters) {
            tempField = _.findWhere(filters.filters, {field: filter.field});
          }
          if (!tempField) {
            //console.log('filter removed');
            reloadLoanData = true;
            return true;
          }
        }
        return false;
      });

      if (typeof filters !== 'undefined' && filters !== null &&
        typeof filters.filters !== 'undefined' && filters.filters !== null) {
        _.each(filters.filters, function (filter) {

          //check if the grid filter (addedFromGrid) is already added to the data store object
          tempFilter = _.findWhere(PipelineDataStore.PipelineGridData.filters, {
            field: filter.field,
            addedFromGrid: true
          });

          //Add new filters to the datastore filter object
          if (typeof tempFilter === 'undefined') {
            //Create filter object using getNewFilter. Check If it is of DATE type. Check if DATE entered in Filter is
            //Valid if not get out of loop displaying error message(Error message login ins customize column)
            var newFilterobject = getNewFilter(filter);
            if (newFilterobject.Datatype === 'DATE') {
              if (PipelineHelperService.getValidDate(filter.value) === 'InvalidDate' ||
                PipelineHelperService.getValidDate(filter.value) === 'InvalidRange') {
                updateSummary = false;
                return;
              }
            }
            PipelineDataStore.PipelineGridData.filters.push(getNewFilter(filter));
            reloadLoanData = true;
          }
          //update existing filters
          else if (tempFilter) {
            var isUpdatedFilterValid = true;
            //Find Current Filter and associated valued
            var findFilter = _.findWhere(PipelineDataStore.PipelineGridData.filters, {
              field: filter.field
            });
            //If Current filter is of type DATE Check if date entered is valid. If not get out of this loop else update
            //values and bind grid with new/updated data.
            if (findFilter.Datatype === 'DATE') {
              if (PipelineHelperService.getValidDate(filter.value) === 'InvalidDate' ||
                PipelineHelperService.getValidDate(filter.value) === 'InvalidRange') {
                isUpdatedFilterValid = false;
                updateSummary = false;
                return;
              }
            }
            if (isUpdatedFilterValid) {
              operatorType = mapGridFilterOperator(filter.operator, tempFilter.FieldType);
              if (tempFilter.ValueFrom !== filter.value || tempFilter.OpType !== operatorType) {
                tempFilter.ValueFrom = filter.value;
                tempFilter.ValueDescription = '';
                tempFilter.OpType = operatorType;
                reloadLoanData = true;
              }
            }
          }
        });
      } else { //Add all the new filters added to the
        if (PipelineDataStore.PipelineGridData.filters.length > 0) {
          updateSummary = true;
        }
      }

      if (reloadLoanData || updateSummary) {
        updateFilterSummary();
      }
      if (reloadLoanData) {
        if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
          if (PipelineDataStore.VERBOSE_LOG.ACTION !== 'CLEAR') {
            PipelineDataStore.VERBOSE_LOG = {
              API_DATA_LOADED: false,
              START_TIME: new Date().getTime(),
              ACTION: 'FILTER CHANGED'
            };
          }
        }
        PipelineDataStore.AdvanceFilterShow = false; //close Advanced Filter if the user adds a filter in the grid
        vm.refreshPipeline();
        $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
      }
    }

    var gridDataSource = new kendo.data.DataSource({
      serverFiltering: true,
      serverPaging: true,
      serverSorting: true,
      pageSize: PipelineConst.PipelineGridPageSize,
      data: PipelineDataStore.PipelineGridData.data.items,
      sort: PipelineDataStore.PipelineGridData.sort,
      schema: {
        total: function (result) {
          return PipelineDataStore.PipelineGridData.totalResults;
        }
      },
      change: function (e) {
        /* jshint -W035 */
        if (typeof e.sender === 'undefined' || e.sender === null ||
          typeof e.sender._sort === 'undefined' || e.sender._sort === null || e.sender._sort.length === 0) {
          //ignore sort check
        }
        else if (PipelineDataStore.PipelineGridData.sort.length === 0 ||
          (e.sender._sort[0].dir !== PipelineDataStore.PipelineGridData.sort[0].dir ||
          e.sender._sort[0].field !== PipelineDataStore.PipelineGridData.sort[0].field)) {
          if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
            PipelineDataStore.VERBOSE_LOG = {
              API_DATA_LOADED: false,
              START_TIME: new Date().getTime(),
              ACTION: 'SORT CHANGED'
            };
          }
          //console.log('ds sort', JSON.stringify(PipelineDataStore.PipelineGridData.sort), 'sender sort', JSON.stringify(e.sender._sort));
          PipelineDataStore.PipelineGridData.sort[0] = {
            dir: e.sender._sort[0].dir,
            field: e.sender._sort[0].field
          };
          vm.refreshPipeline();
          $rootScope.$broadcast(PipelineEventsConst.ENABLE_SAVE_RESET_BUTTON_EVENT);
        }

        //Check for Filters change
        if (PipelineDataStore.PipelineGridData.viewLoaded && typeof e.sender !== 'undefined' && e.sender !== null) {
          mapGridFilters(e.sender._filter);
        }
      }
    });

    /*  Pipeline Grid Options */
    vm.pipelineGridOptions = {
      dataSource: gridDataSource,
      sortable: {
        allowUnsort: false
      },
      columnResize: vm.columnResize,
      reorderable: true,
      resizable: true,
      columnReorder: vm.columnReorder,
      dataBound: vm.onDataBound,
      selectable: 'multiple row',
      columns: PipelineDataStore.PipelineGridData.data.columns,
      pageable: {
        change: function (e) {
          if (window.ERROR_HANDLING_CONSTANTS.LOG_UI_RENDER_TIME) {
            PipelineDataStore.VERBOSE_LOG = {
              API_DATA_LOADED: false,
              START_TIME: new Date().getTime(),
              ACTION: 'GRID PAGED'
            };
          }
          PipelineGetLoans.resolvePipelineDataPaged(e.sender.options.dataSource._page);
        }
      },
      filterable: {
        mode: 'row',
        extra: false,
        operators: {
          date: {
            eq: '=',
            lt: '<',
            lte: '<=',
            gt: '>',
            gte: '>=',
            neq: '<>'
          },
          number: {
            eq: '=',
            lt: '<',
            lte: '<=',
            gt: '>',
            gte: '>=',
            neq: '<>'
          },
          string: {
            eq: '=',
            lt: '<',
            lte: '<=',
            gt: '>',
            gte: '>=',
            neq: '<>'
          }
        }
      }
    };

    /* Context Menu */
    vm.gridHeaderContextMenuOptions = {
      target: '#ngen-pipeline-grid',
      filter: '.k-grid-header',
      rightButton: true,
      border: true,
      animation: false
    };
    vm.gridBodyContextMenuOptions = {
      target: '#ngen-pipeline-grid',
      filter: '.k-grid-content',
      rightButton: true,
      border: true,
      animation: false
    };
    /* Context Menu */
    /*New Loan*/
    vm.openNewLoan = function () {
      $rootScope.$broadcast(PipelineEventsConst.LOAN_NEW_EVENT);
    };
    /*Duplicate Loan*/
    vm.duplicateLoan = function () {
      if (!PipelineDataStore.duplicateButtonDisabled) {
        $rootScope.$broadcast(PipelineEventsConst.LOAN_DUPLICATE_EVENT);
      }
    };
    /*Transfer Loan*/
    vm.openTransferLoan = function () {
      if (PipelineDataStore.LoanFolderDropdownData.selectedItem !== PipelineConst.TrashFolder) {
        $rootScope.$broadcast(PipelineEventsConst.LOAN_TRANSFER_EVENT);
      }
    };
    /*Delete Loan*/
    vm.deleteLoan = function () {
      $rootScope.$broadcast(PipelineEventsConst.LOAN_DELETE_EVENT);
    };
    /*Print Forms*/
    vm.openPrint = function () {
      $rootScope.$broadcast(PipelineEventsConst.LOAN_PRINT_EVENT);
    };
    /* Export */
    function eFolderExportCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.EFolderExportCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    /* Exports eFolder Documents */
    function eFolderExport(exportAll) {
      encompass.eFolderExport(JSON.stringify({
        ExportAll: exportAll
      }), eFolderExportCallback);
    }

    vm.exportToExcel = function (exportAll) {
      $rootScope.$broadcast(PipelineEventsConst.LOAN_EXPORT_EXCEL_EVENT, {'exportAll': exportAll});
    };

    vm.eFolderExport = eFolderExport;
    /* Export */

    /* Compliance */
    function exportLEFPipelineCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.ExportLEFCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    //open LEFPipeline popup on thick client
    function exportLEFPipeline(exportAll) {
      SetPipelineViewXmlService.setPipelineViewXml();
      $timeout(function () {
        encompass.exportLEFPipeline(JSON.stringify({
          ExportAll: exportAll
        }), exportLEFPipelineCallback);
      }, 0, false);
    }

    function generateNMLSReportCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.GenerateNMLSReportCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    //open NMLSReport popup on thick
    function generateNMLSReport() {
      SetPipelineViewXmlService.setPipelineViewXml();
      $timeout(function () {
        encompass.generateNMLSReport(null, generateNMLSReportCallback);
      }, 0, false);
    }

    function generateNCMLDReportCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.GenerateNCMLDReportCallback + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    //open NCMLDReport popup on thick
    function generateNCMLDReport() {
      SetPipelineViewXmlService.setPipelineViewXml();
      $timeout(function () {
        encompass.generateNCMLDReport(null, generateNCMLDReportCallback);
      }, 0, false);
    }

    /* Compliance */
    /*Investor Services*/
    function investorStandardExportCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.InvestorStandardExport + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    function investorStandardExport(exportAll, dataServiceId) {
      SetPipelineViewXmlService.setPipelineViewXml();
      $timeout(function () {
        encompass.investorStandardExportPipeline(JSON.stringify({
          CategoryName: PipelineConst.InvestorServiceCategoryName,
          DataServiceId: dataServiceId,
          ExportAll: exportAll
        }), investorStandardExportCallback);
      }, 0);
    }

    function exportFannieMaeFormattedFileCallback(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        //TODO - modal error popup implementations
        applicationLoggingService.error(PipelineConst.ExportFannieMaeFormattedFile + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    function exportFannieMaeFormattedFile() {
      SetPipelineViewXmlService.setPipelineViewXml();
      $timeout(function () {
        encompass.exportFannieMaeFormattedFile(null, exportFannieMaeFormattedFileCallback);
      }, 0);
    }

    /*Investor Services*/

    /* Open customize column window  */
    vm.openCustomizeColumnWindow = openCustomizeColumnWindow;

    function openCustomizeColumnWindow() {
      try {
        customizeColumnSelected = modalWindowService.modalCustomizeColumns.open();
        customizeColumnSelected.result.then(updateSelectedColumn);
      }
      catch (ex) {
        applicationLoggingService.error(ex.message);
      }
    }

    /* Open customize column window Call Back */
    function updateSelectedColumn() {

    }

    vm.selectAllLoans = function () {
      var grid = vm.pipelineGrid;
      grid.select(grid.items());
    };

    function displayLoanProperties() {
      // Grab guid for the loan and get Loan Properties
      var selectedLoans = PipelineDataStore.PipelineGridData.selected;
      if (selectedLoans && selectedLoans.length === 1) {
        try {
          LoanPropertiesInfoService.resolvePromise({
            'LoanGuid': selectedLoans[0].Loan$Guid
          });
          modalWindowService.showRebuildLoanPropertiesPopup();
        }
        catch (ex) {
          applicationLoggingService.error(ex.message);
        }
      }
    }

    function setThickClientMenuStates() {
      var menuStates = [{
        MenuItemTag: 'PI_Duplicate',
        Enabled: !PipelineDataStore.duplicateButtonDisabled && vm.showDuplicateLoanButton,
        Visible: vm.showDuplicateLoanButton
      }, {
        MenuItemTag: 'PI_Edit',
        Enabled: !PipelineDataStore.editLoanButtonDisabled,
        Visible: !PipelineDataStore.editLoanButtonDisabled
      }, {
        MenuItemTag: 'PI_Move',
        Enabled: !PipelineDataStore.moveToFolderButtonDisabled &&
        vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Move,
        Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Move
      }, {
        MenuItemTag: 'PI_Transfer',
        Enabled: (PipelineDataStore.LoanFolderDropdownData.selectedItem !== PipelineConst.TrashFolder
        && !PipelineDataStore.transferButtonDisabled) && vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Transfer,
        Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Transfer
      }, {
        MenuItemTag: 'PI_Delete',
        Enabled: !PipelineDataStore.deleteIconDisabled && vm.pipelineViewDataStore.deleteLoanAccess,
        Visible: vm.pipelineViewDataStore.deleteLoanAccess
      }, {
        MenuItemTag: 'PI_ExportSelected',
        Enabled: (PipelineDataStore.PipelineGridData.selected.length > 0)
        && vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_ExportToExcel,
        Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_ExportToExcel
      }, {
        MenuItemTag: 'PI_ExportAll',
        Enabled: (PipelineDataStore.PipelineGridData.data.items.length > 0)
        && vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_ExportToExcel,
        Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_ExportToExcel
      }, {
        MenuItemTag: 'PI_Print',
        Enabled: !PipelineDataStore.printButtonDisabled && vm.pipelineViewDataStore.PrintLoanAccess,
        Visible: vm.pipelineViewDataStore.PrintLoanAccess
      }, {
        MenuItemTag: 'SRV_LEF_Selected',
        Enabled: !vm.isDisableComplianceServices,
        Visible: true
      }, {
        MenuItemTag: 'SRV_LEF_All',
        Enabled: !vm.isDisableComplianceServices,
        Visible: true
      }, {
        MenuItemTag: 'SRV_Fannie_Selected',
        Enabled: vm.isDisableInvestorServices,
        Visible: vm.isDisableInvestorServices
      }, {
        MenuItemTag: 'SRV_Fannie_All',
        Enabled: vm.isDisableInvestorServices,
        Visible: vm.isDisableInvestorServices
      }, {
        MenuItemTag: 'SRV_Freddie_Selected',
        Enabled: vm.isDisableInvestorServices,
        Visible: vm.isDisableInvestorServices
      }, {
        MenuItemTag: 'SRV_Freddie_All',
        Enabled: vm.isDisableInvestorServices,
        Visible: vm.isDisableInvestorServices
      }, {
        MenuItemTag: 'SRV_FannieMaeFormattedFile',
        Enabled: vm.isDisableInvestorServices,
        Visible: vm.isDisableInvestorServices
      }, {
        MenuItemTag: 'SRV_NMLS',
        Enabled: (vm.isDisableComplianceServices && vm.isDisableGenerateNMLSReport),
        Visible: (vm.isDisableComplianceServices && vm.isDisableGenerateNMLSReport)
      }, {
        MenuItemTag: 'SRV_NCarComplianceReport',
        Enabled: (vm.isDisableComplianceServices && vm.isNorthCarolinaReportEnable),
        Visible: (vm.isDisableComplianceServices && vm.isNorthCarolinaReportEnable)
      }
      ];
      SetMenuStateService.setThickClientMenuState(menuStates);
    }

    var gridSortReset = function () {
      gridDataSource.sort({});
    };

    var gridPageReset = function (pageIndex) {
      gridDataSource.page(pageIndex || 1);
    };

    vm.refreshPipeline = function (data) {
      var pageIndex = 1;
      if (PipelineDataStore.PipelineGridData.viewLoaded) {
        if (data && data.refreshCurrentPage) {
          pageIndex = gridDataSource.page();
        }
        PipelineGetLoans.refresh(pageIndex);
        gridPageReset(pageIndex);
      }
    };

    vm.cmEditLoan = function () {
      if (!PipelineDataStore.editLoanButtonDisabled) {
        $rootScope.$broadcast(PipelineEventsConst.LOAN_EDIT_EVENT);
      }
    };

    vm.openLoanAlert = function (alertColumnUniqueID) {
      var loansSelected = PipelineDataStore.PipelineGridData.selected;
      var fieldValue = _.find(PipelineDataStore.PipelineGridData.data.columns, {'uniqueID': alertColumnUniqueID});
      fieldValue = fieldValue ? (fieldValue.field ? loansSelected[0][fieldValue.field] : '') : '';
      if (loansSelected && loansSelected.length === 1) {
        modalWindowService.showLoanAlertPopup(fieldValue + PipelineConst.LoanAlerts,
          loansSelected[0].Loan$Guid, alertColumnUniqueID,
          loansSelected[0].CurrentLoanAssociateID, loansSelected[0].CurrentLoanAssociateGroupID);
      }
    };

    vm.callMoveToFolder = function (folder) {
      $rootScope.$broadcast(PipelineEventsConst.LOAN_MOVE_FOLDER_EVENT, {'folder': folder});
    };

    var pipelineViewFields = '[' +
      'vm.pipelineViewDataStore.externalOrg.id, ' +
      ']';
    $scope.$watchCollection(pipelineViewFields, function (val) {
      vm.refreshPipeline();
    });

    var autoRefreshWatchFields = '[vm.pipelineViewDataStore.LoansDataLoaded, ' +
      'vm.pipelineViewDataStore.AutoRefreshIntervalLoaded]';
    $scope.$watchCollection(autoRefreshWatchFields, function (val) {
      if (vm.pipelineViewDataStore.LoansDataLoaded && vm.pipelineViewDataStore.AutoRefreshIntervalLoaded) {
        PipelineGetLoans.setAutoRefresh();
      }
    });

    /* Initialization code */
    function initialize() {

      if (typeof PipelineDataStore.PersonaAccess.ExportServices !== 'undefined') {
        vm.isDisableComplianceServices = PipelineDataStore.PersonaAccess.ExportServices['Compliance Services'];
        vm.isDisableInvestorServices = PipelineDataStore.PersonaAccess.ExportServices['Investor Services'];
      }
      if (typeof PipelineDataStore.PersonaAccess.LoanMgmt !== 'undefined') {
        var accessGenerateNMLSReport = 'LoanMgmt_GenerateNMLSReport'; //need to assign a variable for js hint error.
        vm.isDisableGenerateNMLSReport = PipelineDataStore.PersonaAccess.LoanMgmt[accessGenerateNMLSReport];
        if (typeof PipelineDataStore.PersonaAccess.LoanMgmt !== 'undefined') {
          vm.showDuplicateLoanButton = PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate_Blank ||
            PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate_For_Second ||
            PipelineDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Duplicate;
        }

        var menuStates = [{
          MenuItemTag: 'PI_SaveView',
          Enabled: !PipelineDataStore.saveButtonDisabled,
          Visible: true
        }, {
          MenuItemTag: 'PI_Move',
          Enabled: !PipelineDataStore.moveToFolderButtonDisabled && vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Move,
          Visible: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Move
        }, {
          MenuItemTag: 'PI_ResetView',
          Enabled: !PipelineDataStore.resetButtonDisabled,
          Visible: true
        }, {
          MenuItemTag: 'PI_ManageAlerts',
          Enabled: vm.pipelineViewDataStore.PersonaAccess.LoanMgmt.LoanMgmt_Pipeline_Alert,
          Visible: true
        }, {
          MenuItemTag: 'PI_Columns',
          Enabled: true,
          Visible: true
        }, {
          MenuItemTag: 'PI_ManageViews',
          Enabled: true,
          Visible: true
        }];

        //populate move to folders list
        MoveLoanFolderList.resolvePromise().then(function success() {
          vm.moveFolderDropdownSource =
            _.without(PipelineDataStore.MoveLoanFolderList.items,
              PipelineDataStore.LoanFolderDropdownData.selectedItem);
        });

        SetMenuStateService.setThickClientMenuState(menuStates);
      }

      //Display North carolina report option if user persona has Super administrator rights.
      if (typeof PipelineDataStore.PersonaAccess.UserPersonaRights !== 'undefined' &&
        PipelineDataStore.PersonaAccess.UserPersonaRights.IsAdministrator === true &&
        PipelineDataStore.PersonaAccess.UserPersonaRights.IsSuperAdministrator === true) {
        vm.isNorthCarolinaReportEnable = true;
      }

      /* Event Listeners */
      $scope.$on(PipelineEventsConst.RESET_VIEW_EVENT, function (event) {
        gridDataSource.sort({});
        gridDataSource.filter({});
        gridPageReset();
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.SET_VIEW_EVENT, function (event) {
        gridDataSource.sort(PipelineDataStore.PipelineGridData.sort);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.RESET_GRID_FILTER_EVENT, function (event) {
        gridDataSource.filter({});
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.CLEAR_ALL_GRID_FILTER_EVENT, function (event) {
        gridDataSource.filter({});
        mapGridFilters({}, true);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.RESET_GRID_SORT_EVENT, function (event) {
        PipelineDataStore.PipelineGridData.sort[0] = [];
        gridSortReset();
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.RESET_GRID_PAGE_EVENT, function (event) {
        gridPageReset();
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.REFRESH_GRID_EVENT, function (event, data) {
        vm.refreshPipeline(data);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.LOAN_ALERT_EVENT, function (event, data) {
        vm.openLoanAlert(data.alertColumnUniqueID);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.CUSTOMIZE_COLUMN_EVENT, function (event) {
        vm.openCustomizeColumnWindow();
        event.defaultPrevented = true;
      });

      $scope.$on(PipelineEventsConst.PIPELINE_AUTOREFRESH_EVENT, function (event, data) {
        isPipelineError = data;
        if (isPipelineError === true && popupShown === false) {
          modalWindowService.showErrorPopup('Error auto refreshing pipeline', 'Auto Refresh Error');
          popupShown = true;
        }
        else if (isPipelineError === false) {
          popupShown = false;
        }
      });
      $scope.$on(PipelineEventsConst.EXPORT_LEF_SELECTED_EVENT, function (event, data) {
        vm.exportLEFPipeline(data);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.EXPORT_LEF_ALL_EVENT, function (event, data) {
        vm.exportLEFPipeline(data);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.EXPORT_FRE_SELECTED_EVENT, function (event, data) {
        vm.investorExport(data, vm.DataServiceFreddie);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.EXPORT_FRE_ALL_EVENT, function (event, data) {
        vm.investorExport(data, vm.DataServiceFreddie);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.EXPORT_FNM_SELECTED_EVENT, function (event, data) {
        vm.investorExport(data, vm.DataServiceFannie);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.EXPORT_FNM_ALL_EVENT, function (event, data) {
        vm.investorExport(data, vm.DataServiceFannie);
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.EXPORT_FNM_FORMATTED_FILE_EVENT, function (event, data) {
        vm.exportFannieMaeFormattedFile();
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.GENERATE_NMLS_EVENT, function (event, data) {
        vm.generateNMLSReport();
        event.defaultPrevented = true;
      });
      $scope.$on(PipelineEventsConst.NCAR_COMPLIANCE_REPORT_EVENT, function (event, data) {
        vm.generateNCMLDReport();
        event.defaultPrevented = true;
      });

      $scope.$on(PipelineEventsConst.MOVE_FOLDER_LIST_LOADED_EVENT, function (event) {
        var grid = vm.pipelineGrid;
        PipelineDataStore.moveToFolderButtonDisabled = vm.isMoveFromFolderAccessDisabled([grid.dataItem(grid.select())]);
        event.defaultPrevented = true;
      });
    }

    /*Watch for AutoRefresh failure error and show error popup only once -NGENC-1002*/
    var isPipelineError = false;
    var popupShown = false;
    initialize();
  }
}());
