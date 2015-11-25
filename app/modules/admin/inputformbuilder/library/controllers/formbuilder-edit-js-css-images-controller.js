/**
 * Created by AGarudi on 6/26/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary').controller('FormBuilderEditJsCssCtrl', FormBuilderEditJsCssCtrl);

  function FormBuilderEditJsCssCtrl(FormBuilderDataStore, FormBuilderGridData, FormBuilderService,
                                    FormBuilderConst, ScriptsConst, StylesConst, kendo, Restangular,
                                    FormBuilderModalWindowService, localStorageService,
                                    FormListGridServices, $state, ImagesConst, jsInteraction) {

    var vm = this;
    var config = null;
    vm.fileName = '';                 //ToDo set value on Service call
    vm.description = '';              //ToDo set value on Service call
    vm.formEnabled = true;           //ToDo set value on Service call
    vm.browseFile = '';               //ToDo set value on Service call
    vm.lastModifiedBy = '';           //ToDo set value on Service call
    vm.lastModifiedDateTime = '';     //ToDo set value on Service call
    vm.fileType = '';                 //ToDo set value on Service call
    vm.fileSize = '';                 //ToDo set value on Service call
    vm.url = '';                      //ToDo set value on Service call
    vm.used = '';                     //ToDo set value on Service call
    vm.showButton = true;
    vm.FileTypeText = 'File Type';
    //For Images
    vm.dimensions = '';
    vm.imgUrl = '';
    vm.imgSrc =  jsInteraction.getImageBasePath() ;
    var oldName = '';
    var oldDescription = '';
    var oldFormEnabled = '';
    // To Do: get Data from API Currently reading from json
    var currentService = FormListGridServices;

    vm.formBuilderGridData = FormBuilderDataStore.FormBuilderGridData.data;

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
              sortDefault(dataResponse);
              options.success(vm.formBuilderGridData.items);
            });
        },
        error: function (e) {
          //TODO: Handle error
        }
      },
      pageable: false
    });

    vm.formbuilderGridOptions = {
      dataSource: gridDataSource,
      columns: vm.formBuilderGridData.columns,
      sortable: false,
      resizable: false
    };

    function sortDefault(dataResponse) {
      angular.copy(Restangular.stripRestangular(currentService.sortDefault(dataResponse)),
        vm.formBuilderGridData.items);
    }

    function showPopup() {
      /* jshint ignore: start */
      config = new PopupConfiguration();
      /* jshint ignore: end */
      config.title = 'Confirm';
      config.height = 125;
      config.width = 415;
      config.templateUrl = FormBuilderConst.PATH_SHARED_VIEW + 'formbuilder-confirmation-popup.html';
      config.controller = 'FormBuilderEditPopupCtrl as vm';
      var message = FormBuilderConst.ALERT_MESSAGE_FOR_BACK;

      var popupLayoutConfiguration = {
        popupMessage: message,
        lablApprove: 'Save and Continue',
        lblDisapprove: 'Continue'
      };
      FormBuilderModalWindowService.showPopup(config, popupLayoutConfiguration);
    }

    vm.showList = function (flag) {
      if (flag === 1) {
        callOnPage();
      } else {
        if (oldName !== vm.fileName || oldDescription !== vm.description || oldFormEnabled !== vm.formEnabled) {
          showPopup();
        } else {
          callOnPage();
        }
      }
    };

    function callOnPage() {
      var currentPage = FormBuilderService.getCurPage();
      if (currentPage === ScriptsConst.EDIT_SCRIPTS_PAGE) {
        showScripts();
      }
      else if (currentPage === StylesConst.EDIT_STYLES_PAGE) {
        showStyles();
      }
      else if (currentPage === ImagesConst.EDIT_IMAGES_PAGE) {
        showImages();
      }
    }

    function showScripts() {
      FormBuilderService.setPageParams(ScriptsConst.EDIT_SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE,
        ScriptsConst.SCRIPTS_DESCRIPTION);
      $state.go(ScriptsConst.SCRIPTS_STATE);
    }

    function showStyles() {
      FormBuilderService.setPageParams(StylesConst.EDIT_STYLES_PAGE, StylesConst.STYLES_TITLE,
        StylesConst.STYLES_DESCRIPTION);
      $state.go(StylesConst.STYLES_STATE);
    }

    function showImages() {
      FormBuilderService.setPageParams(ImagesConst.EDIT_IMAGES_PAGE, ImagesConst.IMAGES_TITLE,
        ImagesConst.IMAGES_DESCRIPTION);
      $state.go(ImagesConst.IMAGES_STATE);
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

    function initialize() {
      var data = localStorageService.get(FormBuilderConst.SELECTED_ROW_DATA);
      var lastSelectedPage = localStorageService.get(FormBuilderConst.SELECTED_PAGE);
      if (lastSelectedPage === ScriptsConst.SCRIPTS_PAGE) {
        FormBuilderService.setPageParams(ScriptsConst.EDIT_SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE, ScriptsConst.SCRIPTS_DESCRIPTION);
      } else if (lastSelectedPage === StylesConst.STYLES_PAGE) {
        FormBuilderService.setPageParams(StylesConst.EDIT_STYLES_PAGE, StylesConst.STYLES_TITLE, StylesConst.STYLES_DESCRIPTION);
      } else if (lastSelectedPage === ImagesConst.IMAGES_PAGE) {
        FormBuilderService.setPageParams(ImagesConst.EDIT_IMAGES_PAGE, ImagesConst.IMAGES_TITLE, ImagesConst.IMAGES_DESCRIPTION);
      }
      var currentPage = FormBuilderService.getCurPage();
      //ToDo set value on Service call
      if (data !== null && data !== undefined) {
        vm.fileName = data.Title;
        vm.description = data.Description;
        vm.formEnabled = data.Public === 1;
        vm.browseFile = '';
        vm.lastModifiedBy = data.LastModifiedBy;
        vm.lastModifiedDateTime = kendo.toString(new Date(data.LastModifiedDateTime * 1000), 'G');
        vm.fileSize = data.FileSize;
        vm.url = data.Url;
        vm.used = data.Used;

        if (currentPage === ScriptsConst.EDIT_SCRIPTS_PAGE) {
          setPageItemValues(ScriptsConst.EDIT_FILE_TYPE, false, false, ScriptsConst.EDIT_FILE_TYPE_TEXT);
        }
        else if (currentPage === StylesConst.EDIT_STYLES_PAGE) {
          setPageItemValues(StylesConst.EDIT_FILE_TYPE, true, false, ScriptsConst.EDIT_FILE_TYPE_TEXT);
        }
        else if (currentPage === ImagesConst.EDIT_IMAGES_PAGE) {
          setPageItemValues(ImagesConst.EDIT_FILE_TYPE, false, true, ImagesConst.EDIT_FILE_TYPE_TEXT);
          vm.imgUrl = data.ImgUrl;
          vm.dimensions = data.Dimensions;
        }

        jsInteraction.changeSwitchContainerBorder();

        oldName = vm.fileName;
        oldDescription = vm.description;
        oldFormEnabled = vm.formEnabled;
      }
      FormBuilderGridData.resolveColumnPromise(currentService.getColumnsApi()).then(function (gridColumns) {
        var sortedColumns = columnSorting(gridColumns);
        angular.copy(sortedColumns, FormBuilderDataStore.FormBuilderGridData.data.columns);
      });

      if (!(FormBuilderService.getCurPage())) {
        if ($state.includes('*.*.scriptslibrary')) {
          FormBuilderService.setPageParams(ScriptsConst.SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE,
            ScriptsConst.SCRIPTS_DESCRIPTION);
        } else if ($state.includes('*.*.styleslibrary')) {
          FormBuilderService.setPageParams(StylesConst.STYLES_PAGE, StylesConst.STYLES_TITLE, StylesConst.STYLES_DESCRIPTION);
        } else if ($state.includes('*.*.imageslibrary')) {
          FormBuilderService.setPageParams(ImagesConst.IMAGES_PAGE, ImagesConst.IMAGES_TITLE, ImagesConst.IMAGES_DESCRIPTION);
        }
      }
    }

    function setPageItemValues(fileType, isStyle, isImage, fileTypeText) {
      vm.fileType = fileType;
      vm.showButton = isStyle;
      vm.isImage = isImage;
      vm.FileTypeText = fileTypeText;
    }

    initialize();

  }
}());
