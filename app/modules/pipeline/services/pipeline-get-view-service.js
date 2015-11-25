(function () {
  'use strict';

  angular.module('elli.encompass.web.pipeline').factory('PipelineGetView', PipelineGetView);

  /* @ngInject */
  function PipelineGetView(Restangular, PipelineDataStore, _, PipelineConst,
                           CustomizeColumnService, localStorageService, applicationLoggingService, PipelineHelperService) {
    function mapColumns(cols) {
      PipelineDataStore.PipelineGridData.sort = [];
      var columns = CustomizeColumnService.getUpdatedColumns(Restangular.stripRestangular(cols));
      angular.copy(columns, PipelineDataStore.PipelineGridData.data.columns);
    }

    function mapViews(pipelineViewSummary) {
      var views = _.sortBy(pipelineViewSummary, function (item) {
        return item.Type + item.ViewName.toLowerCase();
      });

      _.each(views, function (dataItem) {
        dataItem.Name = dataItem && dataItem.Type && dataItem.Type === PipelineConst.System ?
        dataItem.PersonaName + ' - ' + dataItem.ViewName : dataItem.ViewName;
        dataItem.Default = dataItem && dataItem.IsDefault ? 'Yes' : '';
      });

      // find first item with type System and set isSeparator true
      var separatorPosition = _.findWhere(views, {
        Type: PipelineConst.System
      });
      // using !! to handle null condition
      if (separatorPosition !== 'undefined' && !!separatorPosition) {
        separatorPosition.isSeparator = true;
      }
      angular.copy(views, PipelineDataStore.PipelineViewListDataStore.items);
      if (!PipelineDataStore.PipelineViewListDataStore.selectedItem) {
        PipelineDataStore.PipelineViewListDataStore.selectedItem =
          (_.findWhere(PipelineDataStore.PipelineViewListDataStore.items, {IsDefault: true}) ||
          PipelineDataStore.PipelineViewListDataStore.items[0]);
      }
    }

    function mapLoanFolder(loanFolderList, loanFolder) {
      angular.copy(_.flatten([PipelineConst.AllFolder, loanFolderList]),
        PipelineDataStore.LoanFolderDropdownData.items);

      PipelineDataStore.LoanFolderDropdownData.selectedItem = _.findWhere(
        PipelineDataStore.LoanFolderDropdownData.items, (loanFolder || PipelineConst.AllFolder));
    }

    function mapLoanView(ownership) {
      PipelineDataStore.LoanViewDropdownData.selectedItem = _.findWhere(
        PipelineDataStore.LoanViewDropdownData.items, {id: ownership});
    }

    function mapCompanyViewTPO(orgType, externalOrgId, externalOrgName) {
      /* company dropdown */
      PipelineDataStore.CompanyViewDropdownData.selectedItem = _.findWhere(
        PipelineDataStore.CompanyViewDropdownData.items, {id: orgType});
      PipelineDataStore.externalOrg.id = (orgType === 'TPO' && externalOrgId === null) ? '-1' : externalOrgId;
      PipelineDataStore.externalOrg.name = (orgType === 'TPO' ? externalOrgName : '');
    }

    /* jshint ignore:start */
    function mapFilterOperator(filterOpType) {
      var operator = '';
      switch (filterOpType.toLowerCase()) {
        case 'contains':
        case 'equals':
          operator = 'eq';
          break;
        case 'notequal':
          operator = 'neq';
          break;
        case 'lessthan':
        case 'datebefore':
          operator = 'lt';
          break;
        case 'notgreaterthan':
        case 'dateonorbefore':
          operator = 'lte';
          break;
        case 'greaterthan':
        case 'dateafter':
          operator = 'gt';
          break;
        case 'notlessthan':
        case 'dateonorafter':
          operator = 'gte';
          break;
      }
      return operator;
    }

    /* jshint ignore:end */

    function mapFilters(filters) {
      var pipelineColumnDef = localStorageService.get('PipelineGetColumnDef');
      PipelineDataStore.PipelineGridData.filters = [];
      if (typeof filters !== 'undefined' && filters !== null && filters.PipelineFieldFilter.length > 0) {
        var _ref;
        PipelineDataStore.PipelineGridData.filters = _.map(filters.PipelineFieldFilter, function (filter) {
          _ref = (typeof pipelineColumnDef !== 'undefined' && pipelineColumnDef !== null ?
            pipelineColumnDef[filter.FieldID] : void 0);
          return {
            CriterionName: (typeof _ref !== 'undefined' ? _ref.Name : filter.CriterionName),
            DataSource: filter.DataSource,
            FieldDescription: filter.FieldDescription,
            FieldID: filter.FieldID,
            FieldType: filter.FieldType && filter.FieldType === 'IsDateTime' ? 'IsDate' : filter.FieldType,
            ForceDataConversion: filter.ForceDataConversion,
            IsVolatile: filter.IsVolatile,
            JointToken: filter.JointToken,
            LeftParentheses: filter.LeftParentheses,
            OpDesc: filter.OpDesc,
            OpType: filter.OpType,
            RightParentheses: filter.RightParentheses,
            ValueDescription: filter.ValueDescription,
            ValueFrom: filter.ValueFrom,
            ValueTo: filter.ValueTo,
            field: (typeof _ref !== 'undefined' ? _ref.Name : PipelineHelperService.getColumnNameForKendoGrid(filter.CriterionName)),
            //Added for Advance Search filter
            Datatype: _ref.Datatype,
            FieldOptions: _ref.FieldOptions
          };
        });
      }
    }

    var viewService = {
      resolvePromise: function (payload) {
        return Restangular.all('pipeline/view/getview').post(payload || {}).then(function (response) {
          PipelineDataStore.PipelineGridData.viewLoaded = false;
          mapColumns(response.PipelineView.Columns);
          mapViews(response.PipelineViewSummary);
          mapLoanFolder(response.LoanFoldersList, response.PipelineView.LoanFolder);
          mapLoanView(response.PipelineView.Ownership);
          mapCompanyViewTPO(response.PipelineView.OrgType, response.PipelineView.ExternalOrgId,
            response.PipelineView.ExternalOrgName);
          mapFilters(response.PipelineView.Filter);
          PipelineDataStore.filterSummary = response.PipelineView.FilterSummary;
          console.log('get view completed: ', response.PipelineView);
        }, function (error) {
          applicationLoggingService.error('Get View service failed: ' + error);
        });
      }
    };

    return viewService;
  }
})();
