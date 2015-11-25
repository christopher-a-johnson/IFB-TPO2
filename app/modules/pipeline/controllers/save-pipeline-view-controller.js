(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').controller('SavePipelineViewController', SavePipelineViewController);

  /* @ngInject */
  function SavePipelineViewController(modalWindowService, PipelineConst, PipelineDataStore, SaveViews,
                                      _, CreateCustomView) {
    var vm = this;
    vm.saveAsViewName = '';
    vm.setAsDefaultView = true;
    //Checked for System view/Custom view
    vm.systemViewType = PipelineDataStore.PipelineViewListDataStore.selectedItem.Type === PipelineConst.System ?
      true : false;
    vm.saveViewSelectedOption = vm.systemViewType ? 1 : 0;
    vm.okClick = okClick;
    vm.cancelClick = closePopup;

    function okClick() {
      var selectedOption = parseInt(vm.saveViewSelectedOption, 10);
      vm.saveAsViewName = vm.saveAsViewName.trim();
      if (selectedOption === 0) {
        //Update existing view.
        var updateViewPayload = {
          'SetAsDefaultPersonaName': vm.setAsDefaultView ?
            PipelineDataStore.PipelineViewListDataStore.selectedItem.PersonaName : '',
          'SetAsDefaultViewName': vm.setAsDefaultView ?
            PipelineDataStore.PipelineViewListDataStore.selectedItem.ViewName : '',
          'PipelineViews': {
            'PipelineView': [
              {
                'Columns': getColumns(),
                'Filter': PipelineDataStore.PipelineGridData.filters.length > 0 ? {
                  'PipelineFieldFilter': PipelineDataStore.PipelineGridData.filters
                } : null,
                'Name': PipelineDataStore.PipelineViewListDataStore.selectedItem.ViewName || '',
                'SetAsDefault': vm.setAsDefaultView,
                'OrgType': PipelineDataStore.CompanyViewDropdownData.selectedItem.id || '',
                'ExternalOrgId': PipelineDataStore.externalOrg.id || '',
                'Ownership': PipelineDataStore.LoanViewDropdownData.selectedItem.id || '',
                'LoanFolder': PipelineDataStore.LoanFolderDropdownData.selectedItem || '',
                'PersonaName': PipelineDataStore.PipelineViewListDataStore.selectedItem.PersonaName || ''
              }
            ]
          }
        };
        SaveViews.resolvePromise(updateViewPayload);
        closePopup();
      } else if (selectedOption === 1) {
        //Create new view
        if (vm.saveAsViewName === '' || vm.saveAsViewName.indexOf('\\') !== -1) {
          modalWindowService.popupInformation.open({
            message: PipelineConst.SaveViewNameViewErrorMessage,
            title: PipelineConst.NameViewErrorTitle
          });
        } else {
          var views = PipelineDataStore.PipelineViewListDataStore.items;
          if (views.filter(function (e) {
              return angular.lowercase(e.Name) === angular.lowercase(vm.saveAsViewName);
            }).length > 0) {
            modalWindowService.popupInformation.open({
              message: 'A view with the name \'' + vm.saveAsViewName +
              '\' already exists. You must provide a unique name for this view.',
              title: PipelineConst.ExistingViewErrorTitle
            });
          } else {
            var createViewPayload = {
              'CreateMode': true,
              'SetAsDefault': vm.setAsDefaultView,
              'CustomPipelineView': {
                'Columns': getColumns(),
                'Filter': PipelineDataStore.PipelineGridData.filters.length > 0 ? {
                  'PipelineFieldFilter': PipelineDataStore.PipelineGridData.filters
                } : null,
                'Name': vm.saveAsViewName,
                'OrgType': PipelineDataStore.CompanyViewDropdownData.selectedItem.id || '',
                'ExternalOrgId': PipelineDataStore.externalOrg.id || '',
                'Ownership': PipelineDataStore.LoanViewDropdownData.selectedItem.id || '',
                'LoanFolder': PipelineDataStore.LoanFolderDropdownData.selectedItem || '',
                'PersonaName': PipelineDataStore.PipelineViewListDataStore.selectedItem.PersonaName || ''
              }
            };
            CreateCustomView.resolvePromise(createViewPayload);
            closePopup();
          }
        }
      }
    }

    function closePopup() {
      modalWindowService.closeSavePipelineViewPopup();
    }

    function getColumns() {
      var columns = [];
      _.each(PipelineDataStore.PipelineGridData.data.columns, function (dataItem) {
        columns.push({
          'Alignment': dataItem.alignment,
          'OrderIndex': dataItem.OrderIndex,
          'PipelineField': {
            'FieldId': dataItem.FieldId,
            'Header': dataItem.title,
            'Name': dataItem.name
          },
          'Width': parseInt(dataItem.width, 10),
          'SortOrder': ((PipelineDataStore.PipelineGridData.sort.length > 0 &&
          PipelineDataStore.PipelineGridData.sort[0].field === dataItem.field) ?
            (PipelineDataStore.PipelineGridData.sort[0].dir === 'asc' ? 'Ascending' : 'Descending') : 'None'),
          'SortPriority': (PipelineDataStore.PipelineGridData.sort.length > 0 &&
          PipelineDataStore.PipelineGridData.sort[0].field === dataItem.field ? 0 : -1),
          'Required': dataItem.required
        });
      });
      return columns;
    }
  }
}());
