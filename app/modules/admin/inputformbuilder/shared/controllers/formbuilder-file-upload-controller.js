/**
 * Created by VMore on 6/5/2015.
 */
(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').controller('FormBuilderFileUploadCtrl', FormBuilderFileUploadCtrl);

  /* @ngInject */
  function FormBuilderFileUploadCtrl(FormBuilderService, FormListConst,
                                     FormBuilderUploadService, AssetLibraryGridServices, jsInteraction) {
    var vm = this;
    var currentService = '';
    var curPage = FormBuilderService.getCurPage();
    var fileType, uploadURL, supportText, fileTypeIconCss, fileMaxSize, invalidFileMsg, fileFilterErrorMessage,
      maxFileNameLength, fileNameLengthErrorMessage, dropDirectionMsg;
    vm.imgSrc = jsInteraction.getImageBasePath();

    fileFilterErrorMessage = FormListConst.FORM_LIST_UPLOAD_INVALID_FILE_EXTENSION;
    maxFileNameLength = FormListConst.FORM_LIST_MAX_FILENAME_LENGTH;
    fileNameLengthErrorMessage = FormListConst.FORM_LIST_UPLOAD_INVALID_FILE_NAME_LENGTH;
    dropDirectionMsg = FormListConst.FORM_LIST_DROPAREA_TEXT;

    switch (curPage) {
      case FormListConst.FORM_LIST_PAGE:
        fileType = FormListConst.FORM_LIST_FILE_EXTENSION;
        uploadURL = FormListConst.FORM_LIST_FILE_UPLOAD_URL;
        fileTypeIconCss = FormListConst.FORM_LIST_UPLOAD_FILE_ICON_CSS;
        supportText = FormListConst.FORM_LIST_SUPPORTED_FORMAT_TEXT;
        fileMaxSize = FormListConst.FORM_LIST_MAX_FILE_SIZE;
        invalidFileMsg = FormListConst.FORM_LIST_UPLOAD_INVALID_FILE_SIZE;
        break;
      default:
        currentService = AssetLibraryGridServices;
        fileType = currentService.getFileExtension();
        uploadURL = currentService.getUploadURL();
        fileTypeIconCss = currentService.getFileTypeIcon();
        supportText = currentService.getSupportText();
        fileMaxSize = currentService.getFileMaxSize();
        invalidFileMsg = currentService.getInvalidFileMsg();
        break;
    }
    // setting upload controls options
    vm.options = FormBuilderUploadService.options(uploadURL, fileType, fileTypeIconCss, supportText, fileMaxSize,
      invalidFileMsg, fileFilterErrorMessage, maxFileNameLength, fileNameLengthErrorMessage, dropDirectionMsg);
  }
}());

