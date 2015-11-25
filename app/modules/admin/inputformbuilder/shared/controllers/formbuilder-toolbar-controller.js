(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').controller('FormBuilderToolbarCtrl', FormBuilderToolbarCtrl);

  /* @ngInject */
  function FormBuilderToolbarCtrl(FormBuilderService, FormListConst, $location, $window,
                                  FormBuilderModalWindowService, AssetLibraryGridServices, FormListGridServices,
                                  FormBuilderConst, jsInteraction, $scope, $timeout) {
    var vm = this;
    var curPage = FormBuilderService.getCurPage();

    vm.openNewForm = openNewForm;
    vm.standardFormsButtonClick = openStandardForm;
    vm.filterText = '';
    vm.defaultSearchText = FormBuilderConst.DEFAULT_SEARCH_TEXT;
    vm.searchFilter = searchFilter;

    setCurPageService();

    function setCurPageService() {
      var currentService;
      switch (curPage) {
        case FormListConst.FORM_LIST_PAGE :
          currentService = FormListGridServices;
          break;
        default:
          currentService = AssetLibraryGridServices;
      }
      vm.importButtonName = currentService.getImportButtonName();
      vm.listPage = currentService.getListPage();
      vm.assetLibPage = currentService.getAssetLibPage();
    }

    function openNewForm() {
      var host = $location.host();
      var protocol = $location.protocol();
      var port = $location.port();
      var newUrl;
      if (host === 'localhost') {
        newUrl = protocol + '://' + host + ':' + port + '/app/modules/admin/inputformbuilder/builder/index.html';
      }
      else {
        newUrl = protocol + '://' + host + ':' + port + '/builder/index.html';
      }
      $window.open(newUrl);
    }

    function openStandardForm() {
      /* jshint ignore: start */
      vm.config = new PopupConfiguration();
      /* jshint ignore: end */
      vm.config.title = 'Standard Form';
      vm.config.width = 544;
      vm.config.height = 412;
      vm.config.templateUrl = FormListConst.FORM_LIST_VIEW + 'formlist-standardform.html';
      vm.config.controller = 'StandardFormListCtrl as vm';
      FormBuilderModalWindowService.showPopup(vm.config, '');
    }

    // 'broadcast filter Data '
    function searchFilter() {
      $scope.$parent.$broadcast(FormBuilderConst.CUSTOM_SEARCH_EVENT, vm.filterText);
    }

    function initialize() {
      $timeout(function () {
        jsInteraction.inputPlaceholder();
      });
    }

    initialize();
  }
}());
