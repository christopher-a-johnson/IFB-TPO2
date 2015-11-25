(function () {
  'use strict';
  angular.module('elli.encompass.web.admin.formbuilder.formlist').factory('FormListGridServices', FormListGridServices);

  var formBuilderUtilityServices;
  var formListConst;
  var flGridService = {
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
    getPageSize: getPageSize
  };

  /* @ngInject */
  function FormListGridServices(FormBuilderUtilityServices, FormListConst) {
    formBuilderUtilityServices = FormBuilderUtilityServices;
    formListConst = FormListConst;
    return flGridService;
  }

  function getDataApi() {
    return formListConst.FORM_LIST_API;
  }

  function getUploadURL() {
    return formListConst.FORM_LIST_FILE_UPLOAD_URL;
  }

  function getSupportText() {
    return formListConst.FORM_LIST_SUPPORTED_FORMAT_TEXT;
  }

  function getImportButtonName() {
    return formListConst.FORM_LIST_IMPORT_BUTTON;
  }

  function getListPage() {
    return true;
  }

  function getAssetLibPage() {
    return false;
  }

  function getColumnsApi() {
    return 'listGridColumns';
  }

  function getFooterPagingMessage() {
    return formListConst.FORM_LIST_PAGING_MSG;
  }

  function getPageSize() {
    return formListConst.FORM_PAGE_SIZE;
  }

  function sortDefault(dataResponse) {
    return dataResponse.sort(function (a, b) {
      return new Date(a.ModifiedDate * 1000).valueOf() ===
      new Date(b.ModifiedDate * 1000).valueOf() ?
        (a.HiddenName > b.HiddenName ? 1 : -1)
        : new Date(a.ModifiedDate * 1000) < new Date(b.ModifiedDate * 1000) ? 1 : -1;
    });
  }

  function sortGridData(columns) {
    var newGridColumns = [];
    var secondaryColumnName = 'Name';
    for (var c = 0; c < columns.length; c++) {
      if (columns[c].field === 'Name') {
        columns[c].template = formBuilderUtilityServices.nameTemplate(columns[c].field);
        columns[c].sortable = {
          compare: formBuilderUtilityServices.compare(columns[c].field, secondaryColumnName, 0)
        };
      }
      else if (columns[c].field === 'ModifiedBy') {
        columns[c].template = formBuilderUtilityServices.lastModifiedByTemplate(columns[c].field);
        columns[c].sortable = {
          compare: formBuilderUtilityServices.compare(columns[c].field, secondaryColumnName, 0)
        };
      } else if (columns[c].field === 'ModifiedDate') {
        columns[c].template = formBuilderUtilityServices.lastModifiedDateTemplate(columns[c].field);
        columns[c].sortable = {
          compare: formBuilderUtilityServices.compare(columns[c].field, secondaryColumnName, 1)
        };
      } else if (columns[c].field === 'Description') {
        columns[c].template = formBuilderUtilityServices.descriptionTemplate(columns[c].field);
        columns[c].sortable = {
          compare: formBuilderUtilityServices.compare(columns[c].field, secondaryColumnName, 0)
        };
      } else if (columns[c].field === 'Enabled') {
        columns[c].template = formBuilderUtilityServices.enabledTemplate(columns[c].field);
        columns[c].sortable = {
          compare: formBuilderUtilityServices.compare(columns[c].field, secondaryColumnName, 0)
        };
        columns[c].width = '100px';
      }
      newGridColumns.push(columns[c]);
    }
    return newGridColumns;
  }
}());
