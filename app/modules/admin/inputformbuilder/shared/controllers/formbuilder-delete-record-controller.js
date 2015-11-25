(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').controller('FormBuilderDeleteRecordController', FormBuilderDeleteRecordController);

  /* @ngInject */
  function FormBuilderDeleteRecordController(FormBuilderDataStore, kendo, FormBuilderGridData,
                                             FormBuilderModalWindowService, FormBuilderService, FormBuilderConst,
                                             StylesConst, ScriptsConst, ImagesConst, LayoutConfiguration, Restangular) {
    var vm = this;
    var formBuilderService = FormBuilderService;
    var curPage = formBuilderService.getCurPage();

    vm.isStylePage = false;
    vm.Approve = LayoutConfiguration.lablApprove;
    vm.Disapprove = LayoutConfiguration.lblDisapprove;
    vm.cancelDeleteOperation = cancelDeleteOperation;
    vm.deleteRecord = deleteRecord;

    switch (curPage) {
      case StylesConst.STYLES_PAGE :
        vm.WarningMsg = StylesConst.STYLE_DELETION_WARNING_MESSAGE;
        vm.isStylePage = true;
        break;
      case ScriptsConst.SCRIPTS_PAGE :
        vm.WarningMsg = ScriptsConst.SCRIPT_DELETION_WARNING_MESSAGE;
        vm.isStylePage = false;
        break;
      case ImagesConst.IMAGES_PAGE :
        vm.WarningMsg = ImagesConst.IMAGE_DELETION_WARNING_MESSAGE;
        vm.isStylePage = false;
        break;
      default:
        vm.WarningMsg = FormBuilderConst.FILE_DELETION_WARNING_MESSAGE;
    }

    var gridDataSource = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          FormBuilderGridData.resolveDataPromise('FormsUsingScriptFile')
            .then(function (response) {
              angular.copy(Restangular.stripRestangular(response), FormBuilderDataStore.UsedFormsList.items);
              options.success(FormBuilderDataStore.UsedFormsList.items);
            });
        }
      }
    });

    vm.formListViewOptions = {
      dataSource: gridDataSource
    };

    function initialize() {
      FormBuilderGridData.resolveDataPromise('FormsUsingScriptFile')
        .then(function (response) {
          angular.copy(Restangular.stripRestangular(response), FormBuilderDataStore.UsedFormsList.items);
        });
    }

    function cancelDeleteOperation() {
      FormBuilderModalWindowService.closePopup(true);
    }

    function deleteRecord() {
      // API call to delete script file should be given once API gets ready
      FormBuilderModalWindowService.closePopup(false);
    }

    initialize();
  }

})();
