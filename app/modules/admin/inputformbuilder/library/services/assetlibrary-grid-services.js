(function () {
  'use strict';
  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary').factory('AssetLibraryGridServices', AssetLibraryGridServices);

  var formBuilderUtilityServices;
  var imagesConst;
  var scriptsConst;
  var stylesConst;
  var formBuilderService;
  var curPage;
  var footerPagingMessage = '';
  var dataApi = 'imagesGridData';
  var columnsApi = 'imagesGridColumns';
  var importButtonName;
  var uploadURL;
  var supportText;
  var fileExtension;
  var fileTypeIcon;
  var fileMaxSize, invalidFileSizeMsg;
  var excludeCols, minFilterLength, pageSize, pageNumber;
  var alGridServices = {
    getColumnsApi: getColumnsApi,
    getDataApi: getDataApi,
    getFooterPagingMessage: getFooterPagingMessage,
    sortDefault: sortDefault,
    sortGridData: sortGridData,
    getImportButtonName: getImportButtonName,
    getListPage: getListPage,
    getAssetLibPage: getAssetLibPage,
    getUploadURL: getUploadURL,
    getSupportText: getSupportText,
    getFileExtension: getFileExtension,
    getFileTypeIcon: getFileTypeIcon,
    getFileMaxSize: getFileMaxSize,
    getInvalidFileMsg: getInvalidFileMsg,
    getExcludeCols: getExcludeCols,
    getMinFilterLength: getMinFilterLength,
    getPageSize: getPageSize,
    getPageNumber: getPageNumber
  };

  /* @ngInject */
  function AssetLibraryGridServices(FormBuilderUtilityServices, ImagesConst,
                                    ScriptsConst, StylesConst, FormBuilderService) {
    formBuilderUtilityServices = FormBuilderUtilityServices;
    imagesConst = ImagesConst;
    scriptsConst = ScriptsConst;
    stylesConst = StylesConst;
    formBuilderService = FormBuilderService;

    setPageValues();

    return alGridServices;
  }

  function setPageValues() {
    curPage = formBuilderService.getCurPage();
    switch (curPage) {
      case imagesConst.IMAGES_PAGE :
        footerPagingMessage = imagesConst.IMAGES_LIST_PAGING_MSG;
        dataApi = 'imagesGridData';
        columnsApi = 'imagesGridColumns';
        importButtonName = imagesConst.IMAGES_IMPORT_BUTTON;
        uploadURL = imagesConst.IMAGE_FILE_UPLOAD_URL;
        supportText = imagesConst.SUPPORTED_IMAGES_FORMAT_TEXT;
        fileExtension = imagesConst.IMAGE_FILE_EXTENSION;
        fileTypeIcon = imagesConst.IMAGE_UPLOAD_FILE_ICON_CSS;
        fileMaxSize = imagesConst.IMAGE_MAX_FILE_SIZE;
        invalidFileSizeMsg = imagesConst.IMAGE_UPLOAD_INVALID_FILE_SIZE;
        excludeCols = imagesConst.IMAGE_FILTER_EXCLUDE_COLS;
        minFilterLength = imagesConst.IMAGE_MIN_FILTER_LENGTH;
        pageSize = imagesConst.IMAGE_PAGE_SIZE;
        pageNumber = imagesConst.IMAGE_PAGE_NUMBER;
        break;
      case scriptsConst.SCRIPTS_PAGE :
        footerPagingMessage = scriptsConst.SCRIPTS_LIST_PAGING_MSG;
        dataApi = 'scriptsGridData';
        columnsApi = 'scriptsGridColumns';
        importButtonName = scriptsConst.SCRIPTS_IMPORT_BUTTON;
        uploadURL = scriptsConst.SCRIPTS_FILE_UPLOAD_URL;
        supportText = scriptsConst.SUPPORTED_SCRIPTS_FORMAT_TEXT;
        fileExtension = scriptsConst.SCRIPTS_FILE_EXTENSION;
        fileTypeIcon = scriptsConst.SCRIPTS_UPLOAD_FILE_ICON_CSS;
        fileMaxSize = scriptsConst.SCRIPTS_MAX_FILE_SIZE;
        invalidFileSizeMsg = scriptsConst.SCRIPTS_UPLOAD_INVALID_FILE_SIZE;
        excludeCols = scriptsConst.SCRIPTS_FILTER_EXCLUDE_COLS;
        minFilterLength = scriptsConst.SCRIPTS_MIN_FILTER_LENGTH;
        pageSize = scriptsConst.SCRIPTS_PAGE_SIZE;
        pageNumber = scriptsConst.SCRIPTS_PAGE_NUMBER;
        break;
      case stylesConst.STYLES_PAGE :
        footerPagingMessage = stylesConst.STYLES_LIST_PAGING_MSG;
        dataApi = 'stylesGridData';
        columnsApi = 'stylesGridColumns';
        importButtonName = stylesConst.STYLES_IMPORT_BUTTON;
        uploadURL = stylesConst.STYLES_FILE_UPLOAD_URL;
        supportText = stylesConst.SUPPORTED_STYLES_FORMAT_TEXT;
        fileExtension = stylesConst.STYLES_FILE_EXTENSION;
        fileTypeIcon = stylesConst.STYLES_UPLOAD_FILE_ICON_CSS;
        fileMaxSize = stylesConst.STYLES_MAX_FILE_SIZE;
        invalidFileSizeMsg = stylesConst.STYLES_UPLOAD_INVALID_FILE_SIZE;
        excludeCols = stylesConst.STYLES_FILTER_EXCLUDE_COLS;
        minFilterLength = stylesConst.STYLES_MIN_FILTER_LENGTH;
        pageSize = stylesConst.STYLES_PAGE_SIZE;
        pageNumber = stylesConst.STYLES_PAGE_NUMBER;
        break;
    }

  }

  function getDataApi() {
    setPageValues();
    return dataApi;
  }

  function getColumnsApi() {
    setPageValues();
    return columnsApi;
  }

  function getImportButtonName() {
    setPageValues();
    return importButtonName;
  }

  function getUploadURL() {
    setPageValues();
    return uploadURL;
  }

  function getSupportText() {
    setPageValues();
    return supportText;
  }

  function getListPage() {
    return false;
  }

  function getAssetLibPage() {
    return true;
  }

  function getFooterPagingMessage() {
    setPageValues();
    return footerPagingMessage;
  }

  function getFileExtension() {
    setPageValues();
    return fileExtension;
  }

  function getFileTypeIcon() {
    setPageValues();
    return fileTypeIcon;
  }

  function getFileMaxSize() {
    setPageValues();
    return fileMaxSize;
  }

  function getInvalidFileMsg() {
    setPageValues();
    return invalidFileSizeMsg;
  }

  function getExcludeCols() {
    setPageValues();
    return excludeCols;
  }

  function getMinFilterLength() {
    setPageValues();
    return minFilterLength;
  }

  function getPageSize() {
    setPageValues();
    return pageSize;
  }

  function getPageNumber() {
    setPageValues();
    return pageNumber;
  }

  function sortDefault(dataResponse) {
    return dataResponse.sort(function (a, b) {
      return new Date(a.LastModifiedDateTime * 1000).valueOf() ===
      new Date(b.LastModifiedDateTime * 1000).valueOf() ?
        (a.Title > b.Title ? 1 : -1)
        : new Date(a.LastModifiedDateTime * 1000) < new Date(b.LastModifiedDateTime * 1000) ? 1 : -1;
    });
  }

  function sortGridData(columns) {
    var newGridColumns = [];
    var secondaryColumnName = 'Title';

    for (var d = 0; d < columns.length; d++) {
      if (columns[d].field === 'Title') {
        columns[d].template = formBuilderUtilityServices.nameTemplate(columns[d].field);
        columns[d].sortable = {
          compare: formBuilderUtilityServices.compare(columns[d].field, secondaryColumnName, 0)
        };
      }
      else if (columns[d].field === 'LastModifiedBy') {
        columns[d].template = formBuilderUtilityServices.lastModifiedByTemplate(columns[d].field);
        columns[d].sortable = {
          compare: formBuilderUtilityServices.compare(columns[d].field, secondaryColumnName, 0)
        };
      } else if (columns[d].field === 'LastModifiedDateTime') {
        columns[d].template = formBuilderUtilityServices.lastModifiedDateTemplate(columns[d].field);
        columns[d].sortable = {
          compare: formBuilderUtilityServices.compare(columns[d].field, secondaryColumnName, 1)
        };
      } else if (columns[d].field === 'FileSize') {
        columns[d].template = formBuilderUtilityServices.fileSizeTemplate(columns[d].field);
        columns[d].sortable = {
          compare: formBuilderUtilityServices.compare(columns[d].field, secondaryColumnName, 2)
        };
      } else if (columns[d].field === 'Public') {
        columns[d].template = formBuilderUtilityServices.enabledTemplate(columns[d].field);
        columns[d].sortable = {
          compare: formBuilderUtilityServices.compare(columns[d].field, secondaryColumnName, 0)
        };
      } else if (columns[d].field === 'Description') {
        columns[d].template = formBuilderUtilityServices.descriptionTemplate(columns[d].field);
        columns[d].sortable = {
          compare: formBuilderUtilityServices.compare(columns[d].field, secondaryColumnName, 0)
        };
      }
      newGridColumns.push(columns[d]);
    }
    return newGridColumns;
  }

}());
