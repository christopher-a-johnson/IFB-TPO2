(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder.formlist.constant', []);

  angular.module('elli.encompass.web.admin.formbuilder.formlist.constant').constant('FormListConst', {
    FORM_LIST_PAGE: 'formlist',
    FORM_LIST_PAGING_MSG: 'forms',
    FORM_LIST_STATE: 'admin.formbuilder.formlist',
    FORM_LIST_IMPORT_BUTTON: 'Import',
    FORM_LIST_TITLE: 'Custom Input Form List',
    FORM_LIST_DESCRIPTION: 'Create and design your own custom input form or modify a standard Encompass form.',
    FORM_LIST_DUPLICATE_NAME: 'Form name already exists',
    FORM_LIST_FILE_NAME_NOT_EMPTY: 'Form name should not be empty.',
    FORM_LIST_VIEW: 'modules/admin/inputformbuilder/list/views/',
    //TODO Change below Url with actual URL
    FORM_LIST_FILE_UPLOAD_URL: 'http://10.112.104.13:85/v1/formbuilder/importpackage',
    FORM_LIST_SUPPORTED_FORMAT_TEXT: '[Supported File Format: .efrm]',
    FORM_LIST_UPLOAD_FILE_ICON_CSS: 'efrm-file',
    FORM_LIST_FILE_EXTENSION: '.efrm',
    FORM_LIST_UPLOAD_INVALID_FILE_EXTENSION: '! Upload failed: Invalid file extension.',
    FORM_LIST_UPLOAD_INVALID_FILE_SIZE: '! Upload failed. File cannot exceed 5MB.',
    FORM_LIST_UPLOAD_INVALID_FILE_NAME_LENGTH: 'File name length is greater than 100 characters.',
    FORM_LIST_MAX_FILE_SIZE: '5120', //size in KBs
    FORM_LIST_MAX_FILENAME_LENGTH: '100',
    FORM_LIST_DROPAREA_TEXT: 'Drop files here',
    FORM_LIST_DUPLICATE_METADATA_FILE_NAME: 'A file with this name already exists. Enter a unique name.',
    FORM_LIST_MAX_ALLOWED_CHARS_MSG: '500 characters max',
    FORM_LIST_WAIT_INTERVAL: 500,
    FILENAME_PLACEHOLDER: 'Add name',
    FILE_DESCRIPTION_PLACEHOLDER: 'Add description',
    FORM_PAGE_SIZE: 30,
    FORM_LIST_API: 'inputforms',
    FORM_LIST_FORM_ID: 'FormId',
    HIDDEN_NAME: 'HiddenName',
    HIDDEN_DESCRIPTION: 'HiddenDescription',
    HIDDEN_MODIFIED_BY: 'HiddenModifiedBy'
  });
}());
