(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary.imagesconstant', []);

  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary.imagesconstant').constant('ImagesConst', {
    IMAGES_PAGE: 'imageslibrary',
    IMAGES_LIST_PAGING_MSG: 'images',
    IMAGES_STATE: 'admin.formbuilder.imageslibrary',
    IMAGES_IMPORT_BUTTON: 'Add Image',
    IMAGES_TITLE: 'Images',
    IMAGES_DESCRIPTION: '',
    //TODO Change below Url with actual URL
    IMAGE_FILE_UPLOAD_URL: 'http://10.112.104.13:85/v1/formbuilder/importpackage',
    SUPPORTED_IMAGES_FORMAT_TEXT: '[Supported File Format: png, jpg, gif]',
    IMAGE_DELETION_WARNING_MESSAGE: 'Do you still want to delete the image?',
    EDIT_IMAGES_PAGE: 'editimageslibrary',
    EDIT_IMAGES_LIST_PAGING_MSG: 'editimages',
    EDIT_IMAGES_STATE: 'admin.formbuilder.editimageslibrary',
    EDIT_IMAGES_TITLE: 'Edit Images',
    EDIT_IMAGES_DESCRIPTION: '',
    EDIT_FILE_TYPE: 'PNG',
    EDIT_FILE_TYPE_TEXT: 'Image Type',
    IMAGE_UPLOAD_FILE_ICON_CSS: 'img-file',
    IMAGE_FILE_EXTENSION: 'png, gif, jpg',
    IMAGE_MAX_FILE_SIZE: '400', //size in KBs
    IMAGE_UPLOAD_INVALID_FILE_SIZE: 'Upload failed. File cannot exceed 400KB.',
    IMAGE_PLACEHOLDER_CSS: ' p .name.ellipsis.img-file',
    IMAGE_PUBLIC_TEXT: 'Public :',
    IMAGE_THUMBNAIL_CSS: ' .tile p',
    IMAGE_FILTER_EXCLUDE_COLS: ['FileSize', 'Public', 'LastModifiedDateTime', 'Id'],
    IMAGE_MIN_FILTER_LENGTH: 2,
    IMAGE_PAGE_SIZE: 30,
    IMAGE_PAGE_NUMBER: 1
  });
}());
