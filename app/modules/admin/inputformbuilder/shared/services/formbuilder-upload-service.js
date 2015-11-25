/**
 * Created by VMore on 6/5/2015.
 */

(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').factory('FormBuilderUploadService', FormBuilderUploadService);

  /* @ngInject */
  function FormBuilderUploadService() {

    return {
      options: function (configUploadUrl, fileType, fileTypeIconCss, supportText, fileMaxSize, invalidFileMsg,
                         fileFilterErrorMessage, maxFileNameLength, fileNameLengthErrorMessage, dropDirectionMsg) {
        var options = {
          controlId: 'divMultiFileUpload',
          url: configUploadUrl,
          fileType: fileType,
          fileFilterErrorMessage: fileFilterErrorMessage,
          maxFileSize: fileMaxSize,
          fileSizeErrorMessage: invalidFileMsg,
          fileDropZoneCss: 'dropZone', //css for drop zone area
          isMultiFileUpload: true,
          fileTypeIconCss: fileTypeIconCss,
          supportedFormatsText: supportText,
          maxFileNameLength: maxFileNameLength,
          fileNameLengthErrorMessage: fileNameLengthErrorMessage,
          dropDirectionMsg: dropDirectionMsg
        };
        return options;
      }
    };
  }
}());

