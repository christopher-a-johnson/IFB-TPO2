(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').controller('FormBuilderGridCtrl', FormBuilderGridCtrl);

  /* @ngInject */
  function FormBuilderGridCtrl(FormBuilderDataStore, FormBuilderGridData, FormBuilderService,
                               FormBuilderConst, ImagesConst, ScriptsConst, StylesConst, FormListConst, kendo,
                               kendoGridHelper, $templateCache, _, Restangular, FormBuilderModalWindowService,
                               AssetLibraryGridServices, FormListGridServices, $state, localStorageService, $scope,
                               utility, $location, $window, ifbStorage) {

    var vm = this;
    vm.deleteAsset = deleteAsset;
    vm.formBuilderGridData = FormBuilderDataStore.FormBuilderGridData.data;
    vm.getGridChange = getGridChange;
    vm.newImageWindow = newImageWindow;
    vm.selectItem = selectItem;
    vm.setMetaData = setMetaData;
    vm.openFile = openFile;
    vm.returnURL = returnURL;
    vm.excludeCols = '';
    vm.minFilterLength = '';
    vm.filterText = '';
    vm.itemLength = 0;

    var activeGridRow = '';
    var curPage = FormBuilderService.getCurPage();
    var isFileUsed = false;
    var config = null;
    var selectedFile = '';
    var currentService;

    setCurPageService();

    function openFile(id, event) {
      if (curPage === FormListConst.FORM_LIST_PAGE) {
        var newUrl = returnURL(id);
        $window.open(newUrl);
        event.preventDefault();
      }
    }

    function returnURL(id) {
      if (curPage === FormListConst.FORM_LIST_PAGE) {
        var host = $location.host();
        var protocol = $location.protocol();
        var port = $location.port();
        var newUrl;

        if (host === 'localhost') {
          newUrl = protocol + '://' + host + ':' + port
          + '/app/modules/admin/inputformbuilder/builder/index.html';
        }
        else {
          newUrl = protocol + '://' + host + ':' + port + '/builder/index.html';
        }

        return newUrl + '?FormId=' + id;

      }
    }

    function setMetaData(data) {
      var result = _.findWhere(vm.formBuilderGridData.items, {'Id': data.toString()});
      selectItem(result);
      vm.editAsset();
    }

    vm.editAsset = function () {
      var pageName = FormBuilderService.getCurPage();
      if (pageName === ScriptsConst.SCRIPTS_PAGE || pageName === ScriptsConst.EDIT_SCRIPTS_PAGE) {
        showEditScripts();
      } else if (pageName === ImagesConst.IMAGES_PAGE || pageName === ImagesConst.EDIT_IMAGES_PAGE) {
        showEditImages();
      } else if (pageName === StylesConst.STYLES_PAGE || pageName === StylesConst.EDIT_STYLES_PAGE) {
        showEditStyles();
      }
    };

    function showEditScripts() {
      FormBuilderService.setPageParams(ScriptsConst.EDIT_SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE, ScriptsConst.SCRIPTS_DESCRIPTION);
      $state.go(ScriptsConst.EDIT_SCRIPTS_STATE);
    }

    function showEditImages() {
      FormBuilderService.setPageParams(ImagesConst.EDIT_IMAGES_PAGE, ImagesConst.IMAGES_TITLE, ImagesConst.IMAGES_DESCRIPTION);
      $state.go(ImagesConst.EDIT_IMAGES_STATE);
    }

    function showEditStyles() {
      FormBuilderService.setPageParams(StylesConst.EDIT_STYLES_PAGE, StylesConst.STYLES_TITLE, StylesConst.STYLES_DESCRIPTION);
      $state.go(StylesConst.EDIT_STYLES_STATE);
    }

    var newSchemaModel = kendo.data.Model.define({
      id: 'Id',
      fields: vm.formBuilderGridData.schema
    });

    var gridDataSource = new kendo.data.DataSource({
      serverFiltering: false,
      schema: {
        model: newSchemaModel
      },
      transport: {
        read: function (options) {
          FormBuilderGridData.resolveDataPromise(currentService.getDataApi())
            .then(function (dataResponse) {
              var dataSource = dataResponse;
              //Check if page is form-list , then modify response to convert UTC to timestamp
              if (curPage === FormListConst.FORM_LIST_PAGE) {
                //parse response to get array of data in desired format
                var newFormData = [];
                $.each(dataResponse, function (key, value) {
                  var inputFormData = value.InputFormData;
                  var metadata = inputFormData.Metadata;
                  metadata.Id = value.InputFormID;
                  metadata.HiddenName = utility.Capitalize(inputFormData.Metadata.Name);
                  metadata.HiddenDescription = utility.Capitalize(inputFormData.Metadata.Description);
                  metadata.HiddenModifiedBy = utility.Capitalize(inputFormData.Metadata.ModifiedBy);
                  //Conversion of date to timestamp
                  metadata.ModifiedDate = utility.TimeConversion.convertToTimestamp(inputFormData.Metadata.ModifiedDate);
                  newFormData.push(metadata);
                });
                dataSource = newFormData;
              }
              //Default sorting
              sortDefault(dataSource);
              options.success(vm.formBuilderGridData.items);
            });
        },
        create: function (e) {
          var isDuplicate = confirmOrDeletePopup(gridDataSource.data(), e.data.Name);
          //NGENY-753- Duplicate form name message for form list page
          if (isDuplicate === true && curPage === FormListConst.FORM_LIST_PAGE) {
            $('.nameError').text(FormListConst.FORM_LIST_DUPLICATE_NAME);
            return false;
          }
          else if (curPage === FormListConst.FORM_LIST_PAGE && e.data.Name === '') {
            $('.nameError').text(FormListConst.FORM_LIST_FILE_NAME_NOT_EMPTY);
            return false;
          }
          else if (curPage === StylesConst.STYLES_PAGE && e.data.Title === '') {
            $('.nameError').text(StylesConst.STYLE_NAME_NOT_EMPTY);
            return false;
          }
          e.data.Id = gridDataSource.data().length + 1;
          e.success(e.data);
          confirmation(e);
        },
        update: function (e) {
          //TODO : Server call to update the data to DB.
          e.success();
        },
        error: function (e) {
          //TODO: Handle error
        }
      },
      pageSize: currentService.getPageSize(),
      pageable: true
    });

    gridDataSource.fetch(function () {
      vm.itemLength = this.data().length;
      setPagination(vm.itemLength);
    });

    vm.formbuilderGridOptions = {
      dataSource: gridDataSource,
      columns: vm.formBuilderGridData.columns,
      sortable: true,
      resizable: true,
      columnResize: kendoGridHelper.columnResize, //NGENY-511 Move to kendoInteraction.js file
      edit: kendoGridHelper.editGridRow,
      editable: {
        mode: 'popup',
        template: setDetailTemplate(),
        window: {draggable: false, resizable: false, animation: false},
        confirmation: false
      },
      pageable: {
        pageSizes: [30, 50, 100, 200],
        input: true,
        messages: {
          display: '{0}-{1} of {2} ' + currentService.getFooterPagingMessage(),
          page: '',
          itemsPerPage: 'per page'
        }
      },
      remove: function (e) {
        e.preventDefault();//cancelling the default action
        e.row.css('display', '');//displaying the value as remove hides the display
        deleteFormPopup(e);
      }
    };

    function confirmOrDeletePopup(gridData, formName) {
      //NGENY-753 - Duplicate form name check for form list page
      var val;
      if (curPage === FormListConst.FORM_LIST_PAGE) {
        val = _.where(gridData, {Name: formName}).length > 1;
      }
      return val;
    }

    function setCurPageService() {
      switch (curPage) {
        case FormListConst.FORM_LIST_PAGE :
          currentService = FormListGridServices;
          kendoGridHelper.setCurrentPage(curPage, FormListConst);
          break;
        default:
          currentService = AssetLibraryGridServices;
          //Kendo Interaction class only needs StylesConst for now
          kendoGridHelper.setCurrentPage(curPage, StylesConst);
          vm.excludeCols = currentService.getExcludeCols();
          vm.minFilterLength = currentService.getMinFilterLength();
      }
    }

    function deleteAsset() {
      var title = 'Delete';
      var approveLabel = 'Yes';
      var disapproveLabel = 'Cancel';
      var height;
      var width = 0;
      var templateUrl;
      var controllerName;
      var message = '';
      if (isFileUsed) {
        height = 475;
        width = 626;
        templateUrl = FormBuilderConst.PATH_SHARED_VIEW + 'formbuilder-delete-record-popup.html';
        controllerName = 'FormBuilderDeleteRecordController as vm';
      }
      else {
        height = 101;
        width = 400;
        templateUrl = FormBuilderConst.PATH_SHARED_VIEW + 'formbuilder-confirmation-popup.html';
        controllerName = 'FormBuilderConfirmPopupController as vm';
        message = FormBuilderConst.CONFIRMATION_POPUP_MESSAGE + selectedFile + FormBuilderConst.QUESTION_MARK;
      }

      invokeCommonPopup(null, title, height, width, message, templateUrl, controllerName, approveLabel, disapproveLabel);

    }

    window.deleteAsset = vm.deleteAsset;
    window.editAsset = vm.editAsset;
    window.setMetaData = vm.setMetaData;

    function sortDefault(dataResponse) {
      angular.copy(Restangular.stripRestangular(currentService.sortDefault(dataResponse)),
        vm.formBuilderGridData.items);
    }

    function deleteFormPopup(e) {
      var title = 'Delete';
      var height = 120;
      var width = 400;
      var message = FormBuilderConst.CONFIRMATION_POPUP_MESSAGE + activeGridRow.Name + FormBuilderConst.QUESTION_MARK;
      var templateUrl = FormBuilderConst.PATH_SHARED_VIEW + 'formbuilder-confirmation-popup.html';
      var controllerName = 'FormBuilderConfirmPopupController as vm';
      var approveLabel = 'Yes';
      var disapproveLabel = 'Cancel';
      invokeCommonPopup(e, title, height, width, message, templateUrl, controllerName, approveLabel, disapproveLabel);
    }

    function confirmation(e) {
      var title = 'Duplicate';
      var height = 120;
      var width = 400;
      var message = setSuccessfulMessage(e);
      var templateUrl = FormBuilderConst.PATH_SHARED_VIEW + 'formbuilder-confirmation-popup.html';
      var controllerName = 'FormBuilderConfirmPopupController as vm';
      var approveLabel = 'Open';
      var disapproveLabel = 'Close';

      invokeCommonPopup(e, title, height, width, message, templateUrl, controllerName, approveLabel, disapproveLabel);
    }

    //NGENY-753 - Set successful message depending upon page type
    function setSuccessfulMessage(e) {
      var message;
      if (curPage === FormListConst.FORM_LIST_PAGE) {
        message = '"' + e.data.OldFormName + '" has been duplicated and renamed to "' + e.data.Name + '".';
      }
      else if (curPage === StylesConst.STYLES_PAGE) {
        message = '"' + e.data.OldStyleName + '" has been successfully duplicated. The duplicate file is named' +
        ' "' + e.data.Title + '".';
      }
      return message;
    }

    function invokeCommonPopup(e, title, height, width, message, templateUrl, controllerName, approveLabel, disapproveLabel) {
      /* jshint ignore: start */
      if (e === null) {
        config = new PopupConfiguration();
      } else {
        config = new PopupConfiguration(e);
      }
      /* jshint ignore: end */
      config.title = title;
      config.height = height;
      config.width = width;
      config.templateUrl = templateUrl;
      config.controller = controllerName;
      var popupLayoutConfiguration = {
        popupMessage: message,
        lablApprove: approveLabel,
        lblDisapprove: disapproveLabel
      };
      FormBuilderModalWindowService.showPopup(config, popupLayoutConfiguration);
    }

    //NGENY-753 - Set detail template depending upon page type
    function setDetailTemplate() {
      var detailTemplate;
      if (curPage === FormListConst.FORM_LIST_PAGE) {
        detailTemplate = FormBuilderConst.PATH_SHARED_VIEW + 'formlist-duplicate-template.html';
      }
      else if (curPage === StylesConst.STYLES_PAGE || curPage === StylesConst.EDIT_STYLES_PAGE) {
        detailTemplate = FormBuilderConst.PATH_SHARED_VIEW + 'stylesheets-duplicate-template.html';
      }
      return $templateCache.get(detailTemplate);
    }

    function newImageWindow(e) {
      e = e || window.event;
      var el = e.target ? e.target : e.srcElement;
      window.open(el.src, '_blank');
    }

    function selectItem(data) {
      localStorageService.set(FormBuilderConst.SELECTED_ROW_DATA, data);
      localStorageService.set(FormBuilderConst.SELECTED_PAGE, FormBuilderService.getCurPage());
      kendoGridHelper.setSelectedRowData(data);
      isFileUsed = data.Used;
      selectedFile = data.Title;
      activeGridRow = data;
    }

    function getGridChange(dataItem) {
      kendoGridHelper.selectRow(dataItem);
      activeGridRow = dataItem;
    }

    function initialize() {
      FormBuilderGridData.resolveColumnPromise(currentService.getColumnsApi()).then(function (gridColumns) {
        var sortedColumns = columnSorting(gridColumns);
        angular.copy(sortedColumns, FormBuilderDataStore.FormBuilderGridData.data.columns);
      });

      if (!(FormBuilderService.getCurPage())) {
        if ($state.includes('*.*.editscriptslibrary')) {
          FormBuilderService.setPageParams(ScriptsConst.EDIT_SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE, ScriptsConst.SCRIPTS_DESCRIPTION);
        } else if ($state.includes('*.*.editimageslibrary')) {
          FormBuilderService.setPageParams(ImagesConst.EDIT_IMAGES_PAGE, ImagesConst.IMAGES_TITLE, ImagesConst.IMAGES_DESCRIPTION);
        } else if ($state.includes('*.*.editstyleslibrary')) {
          FormBuilderService.setPageParams(StylesConst.EDIT_STYLES_PAGE, StylesConst.STYLES_TITLE, StylesConst.STYLES_DESCRIPTION);
        }
      }
    }

    function columnSorting(columns) {
      var newGridColumns = [];

      //Default
      for (var i = 0; i < columns.length; i++) {
        newGridColumns.push(columns[i]);
      }
      newGridColumns = currentService.sortGridData(columns);

      return newGridColumns;
    }

    //#2105 Handle Search Event from form builder toolbar controller
    if (curPage !== FormListConst.FORM_LIST_PAGE) {
      $scope.$on(FormBuilderConst.CUSTOM_SEARCH_EVENT, function (event, filterText) {
        var gridFilters = [];
        vm.filterText = filterText;

        for (var i = 1; i < vm.formBuilderGridData.columns.length; i++) {
          if (vm.excludeCols.indexOf(vm.formBuilderGridData.columns[i].field) < 0 && filterText.length >
            ((vm.minFilterLength || 1) - 1)) {
            gridFilters.push({
              field: vm.formBuilderGridData.columns[i].field,
              operator: 'contains',
              value: filterText
            });
          }
        }

        vm.formBuilderGrid.dataSource.query({
          page: currentService.getPageNumber(),
          pageSize: currentService.getPageSize(),
          filter: {logic: 'or', filters: gridFilters}
        }).then(function (e) {
          if (gridFilters.length === 0) {
            gridDataSource.fetch(function () {
              vm.itemLength = this.data().length;
              setPagination(vm.itemLength);
            });
          }
          else {
            var view = vm.formBuilderGrid.dataSource.view();
            vm.itemLength = view.length;
            setPagination(vm.itemLength);
          }
        });

      });
    }

    function setPagination(num) {
      if (num < currentService.getPageSize()) {
        $('.k-pager-sizes').hide();
        $('.k-pager-nav').hide();
        $('.k-pager-input').hide();
        $('.k-pager-numbers').hide();
      }
      else {
        $('.k-pager-sizes').show();
        $('.k-pager-nav').show();
        $('.k-pager-input').show();
        $('.k-pager-numbers').show();
      }
    }

    initialize();
  }
}());
