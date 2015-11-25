(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary.stylesconstant', []);

  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary.stylesconstant').constant('StylesConst', {
    STYLES_PAGE: 'styleslibrary',
    STYLES_TITLE: 'Style Sheets',
    STYLES_DESCRIPTION: '',
    STYLES_STATE: 'admin.formbuilder.styleslibrary',
    STYLES_LIST_PAGING_MSG: 'files',
    STYLES_IMPORT_BUTTON: 'Add File',
    //TODO Change below Url with actual URL
    STYLES_FILE_UPLOAD_URL: 'http://10.112.104.13:85/v1/formbuilder/importpackage',
    SUPPORTED_STYLES_FORMAT_TEXT: '[Supported File Format: css]',
    STYLE_DELETION_WARNING_MESSAGE: 'Deleting this file may result in styles reverting to EM global style where ' +
    'possible. Also forms with custom styles will not display properly on the mentioned forms. ' +
    'Do you still want to delete the file?',
    STYLE_NAME_NOT_EMPTY: 'Name should not be empty.',
    EDIT_STYLES_PAGE: 'editstyleslibrary',
    EDIT_STYLES_TITLE: 'Edit Style Sheets',
    EDIT_STYLES_DESCRIPTION: '',
    EDIT_STYLES_STATE: 'admin.formbuilder.editstyleslibrary',
    EDIT_STYLES_LIST_PAGING_MSG: 'files',
    EDIT_FILE_TYPE: 'CSS Style Sheet',
    STYLES_UPLOAD_FILE_ICON_CSS: 'css-file',
    STYLES_FILE_EXTENSION: 'css',
    STYLES_MAX_FILE_SIZE: '400', //size in KBs
    STYLES_UPLOAD_INVALID_FILE_SIZE: 'Upload failed. File cannot exceed 400KB.',
    STYLES_FILTER_EXCLUDE_COLS: ['FileSize', 'Public', 'LastModifiedDateTime', 'Id'],
    STYLES_MIN_FILTER_LENGTH: 2,
    STYLES_PAGE_SIZE: 30,
    STYLES_PAGE_NUMBER: 1
  });
}());
