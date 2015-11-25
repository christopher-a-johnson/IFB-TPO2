(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary.scriptsconstant', []);

  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary.scriptsconstant').constant('ScriptsConst', {
    SCRIPTS_PAGE: 'scriptslibrary',
    SCRIPTS_LIST_PAGING_MSG: 'files',
    SCRIPTS_STATE: 'admin.formbuilder.scriptslibrary',
    SCRIPTS_IMPORT_BUTTON: 'Add File',
    SCRIPTS_TITLE: 'Scripts',
    SCRIPTS_DESCRIPTION: '',
    //TODO Change below Url with actual URL
    SCRIPTS_FILE_UPLOAD_URL: 'http://10.112.104.13:85/v1/formbuilder/importpackage',
    SUPPORTED_SCRIPTS_FORMAT_TEXT: '[Supported File Format: js]',

    SCRIPT_DELETION_WARNING_MESSAGE: 'Deleting this file may prevent input forms that utilize this script from ' +
    'functioning properly. Do you still want to delete the file?',

    EDIT_SCRIPTS_PAGE: 'editscriptslibrary',
    EDIT_SCRIPTS_LIST_PAGING_MSG: 'files',
    EDIT_SCRIPTS_STATE: 'admin.formbuilder.editscriptslibrary',
    EDIT_SCRIPTS_TITLE: 'Edit Scripts',
    EDIT_SCRIPTS_DESCRIPTION: '',
    EDIT_FILE_TYPE: 'Javascript',
    EDIT_FILE_TYPE_TEXT: 'File Type',
    SCRIPTS_UPLOAD_FILE_ICON_CSS: 'js-file',
    SCRIPTS_FILE_EXTENSION: 'js',
    SCRIPTS_MAX_FILE_SIZE: '400', //size in KBs
    SCRIPTS_UPLOAD_INVALID_FILE_SIZE: 'Upload failed. File cannot exceed 400KB.',
    SCRIPTS_FILTER_EXCLUDE_COLS: ['FileSize', 'Public', 'LastModifiedDateTime', 'Id'],
    SCRIPTS_MIN_FILTER_LENGTH: 2,
    SCRIPTS_PAGE_SIZE: 30,
    SCRIPTS_PAGE_NUMBER: 1
  });
}());
