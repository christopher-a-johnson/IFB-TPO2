(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').directive('formbuilderFileUpload', formbuilderFileUpload);

  function formbuilderFileUpload(ngenFileUploadControl, $interval, FormListConst, FormBuilderService,
                                 FormBuilderDataStore, _, ImagesConst, jsInteraction) {
    return ({
      link: link,
      restrict: 'A',
      scope: {options: '=options'},
      controllerAs: 'fbUploadCtrl',
      controller: 'FormBuilderFileUploadCtrl',
      templateUrl: 'modules/admin/inputformbuilder/shared/views/formbuilder-file-upload.html'
    });

    // Todo: bind javascript events to scope here...
    function link(scope, element, attrs, ctrl) {
      var formBuilderGridData = FormBuilderDataStore.FormBuilderGridData.data;
      var curPage = FormBuilderService.getCurPage();
      $(document).ready(function () {
        var objNextGenFileUpload, uploadButton, cancelButton, uploadShowCase, dragDropArea,
          importButtonToggle, uploadStack;
        initializeUploadControl();

        //This function initializes the upload control
        function initializeUploadControl() {

          //Removing existing control if any
          var existingCtrl = angular.element.find('.dropZone');
          if (existingCtrl.length > 0) {
            $(existingCtrl).remove();
          }

          objNextGenFileUpload = ngenFileUploadControl.init(ctrl.options);
          uploadButton = angular.element('#' + objNextGenFileUpload.uploadButtonId + '');
          cancelButton = angular.element('#' + objNextGenFileUpload.cancelButtonId + '');
          uploadShowCase = angular.element('#' + objNextGenFileUpload.filesUploadedAreaDivId + '');
          dragDropArea = angular.element('#' + objNextGenFileUpload.uploadControlDragAreaDivId + '');
          importButtonToggle = angular.element('#ImportButtonToggle');
          uploadButton.bind('click', showMetaData);

        }

        //This function checks if all the files are uploaded
        function isUploadComplete() {
          var uploadStack = objNextGenFileUpload.uploadStack;
          var fileUploadComplete = true;
          if (uploadStack.length > 0) {
            var i = 0;
            for (i = 0; i < uploadStack.length; i++) {
              if (uploadStack[i].status === 'added') {
                fileUploadComplete = false;
                break;
              }
            }
          }
          return fileUploadComplete;
        }

        //This function displays the metadata only when all the files are uploaded
        function showMetaData() {
          var interval = $interval(function () {
            if (isUploadComplete()) {
              $interval.cancel(interval);
              showMetadataDetails();
            }
          }, FormListConst.FORM_LIST_WAIT_INTERVAL);
        }

        //This function displays the metadata of each file
        function showMetadataDetails() {
          $(uploadButton).remove();
          $(cancelButton).remove();
          $(dragDropArea).remove();
          importButtonToggle.attr('disabled', 'disabled');
          uploadStack = objNextGenFileUpload.uploadStack;
          if (uploadStack.length > 0) {
            var tileDiv, metaDataTemplate, metaDataHtml, stackLength, progressDiv, fileNameWithExt, fileNameWithoutExt,
              imgFileSpan, enablePublic, thumbnailImagePath, formName;
            for (stackLength = 0; stackLength < uploadStack.length; stackLength++) {
              if (uploadStack[stackLength].status === 200) {
                tileDiv = angular.element('#tileFor' + uploadStack[stackLength].guid);
                progressDiv = angular.element('#progressFor' + uploadStack[stackLength].guid);
                progressDiv.hide();
                fileNameWithExt = uploadStack[stackLength].name;
                fileNameWithoutExt = fileNameWithExt.slice(0, -fileNameWithExt.substring(fileNameWithExt.lastIndexOf('.')).length);
                metaDataTemplate = kendo.template($('#metaDataTemplate').html());
                metaDataHtml = metaDataTemplate({
                  guid: uploadStack[stackLength].guid,
                  fileName: fileNameWithoutExt,
                  fileNamePlaceHolder: FormListConst.FILENAME_PLACEHOLDER,
                  fileDescriptionPlaceHolder: FormListConst.FILE_DESCRIPTION_PLACEHOLDER
                });
                tileDiv.append(metaDataHtml);

                formName = angular.element('#FormName_' + uploadStack[stackLength].guid);
                formName.attr('required');

                if (curPage === ImagesConst.IMAGES_PAGE) {
                  //TODO path needs to be replaced returned by API
                  thumbnailImagePath = '/app/images/ellie-mae-logo.jpg';
                  imgFileSpan = angular.element('#tileFor' + uploadStack[stackLength].guid + ImagesConst.IMAGE_PLACEHOLDER_CSS);
                  imgFileSpan.removeClass('img-file').addClass('imagePlaceHolder');
                  imgFileSpan.css('background-image', 'url(' + thumbnailImagePath + ')');
                  $('#tileFor' + uploadStack[stackLength].guid + ImagesConst.IMAGE_THUMBNAIL_CSS).addClass('imageThumbnail');
                  enablePublic = angular.element('#lblEnableForm_' + uploadStack[stackLength].guid);
                  enablePublic.text(ImagesConst.IMAGE_PUBLIC_TEXT);
                }
                maxAllowedCharsAndControlSwitch(stackLength);
              }
            }
            saveCloseButtons();
            jsInteraction.inputPlaceholder();
          }
        }

        //This function is used to display maxAllowedChars label and kendo switch
        function maxAllowedCharsAndControlSwitch(stackLength) {
          var maxAllowedChars = angular.element('#MaxAllowedChars_' + uploadStack[stackLength].guid);
          maxAllowedChars.text(FormListConst.FORM_LIST_MAX_ALLOWED_CHARS_MSG);
          $('#divMultiFileUpload #formEnabled_' + uploadStack[stackLength].guid).kendoMobileSwitch({
            onLabel: '<img src=' + ctrl.imgSrc + '/images/blue-tick.png>',
            offLabel: 'X'
          });

          $('#divMultiFileUpload #formEnabledField_' + uploadStack[stackLength].guid).click(function () {
            toggleControlSwitch(uploadStack[stackLength].guid);
          });
        }

        //This function toggles classes for kendo switch
        function toggleControlSwitch(stackId) {
          var item = '#formEnabledField_' + stackId;
          var enabledCheckBox = '#formEnabled_' + stackId;
          if ($(item + ' .km-switch').hasClass('km-switch-off')) {
            $(item + ' .km-switch .km-switch-container').removeClass('switchBorderBlue').addClass('switchBorderGrey');
            $(item + ' .km-switch .km-switch-handle').removeClass('changeSwitchOn').addClass('changeSwitchOff');
            $(enabledCheckBox).attr('checked', false);
          } else {
            $(item + ' .km-switch .km-switch-container').removeClass('switchBorderGrey').addClass('switchBorderBlue');
            $(item + ' .km-switch .km-switch-handle').removeClass('changeSwitchOff').addClass('changeSwitchOn');
            $(enabledCheckBox).attr('checked', true);
          }
          enableSaveButton(); // To enable save button on kendo switch click event
        }

        //This function adds the save close button template
        function saveCloseButtons() {
          var saveClose = angular.element('.actionButtonHolder');
          var saveCloseTemplate = kendo.template($('#saveCloseTemplate').html());
          var saveCloseHtml = saveCloseTemplate({});
          saveClose.append(saveCloseHtml);
          $('#saveButton').bind('click', saveMetaData);
          $('#closeButton').bind('click', resetDefaultDragDrop);
        }

        // This function will save the metadata and reset upload panel to default state
        function saveMetaData(e) {
          e.stopPropagation();
          e.preventDefault();
          if (!duplicateFileNameCheck()) {

            //TODO need to call save metadata API service once it is ready

            resetDefaultDragDrop();
          }
        }

        //This function checks for duplicate metadata file name
        function duplicateFileNameCheck() {
          var flag = false;
          if (uploadStack.length > 0) {
            var tileDiv, stackLength, metadataFileName, duplicateMsg;
            for (stackLength = 0; stackLength < uploadStack.length; stackLength++) {
              if (uploadStack[stackLength].status === 200) {
                tileDiv = angular.element('#tileFor' + uploadStack[stackLength].guid);
                metadataFileName = angular.element('#FormName_' + uploadStack[stackLength].guid);
                if (metadataFileName.val().trim() === '') {
                  flag = true;
                }
                if ((curPage === FormListConst.FORM_LIST_PAGE) &&
                  (_.where(formBuilderGridData.items, {FormName: metadataFileName[0].value}).length > 0)) {
                  duplicateMsg = angular.element('#DuplicateFileName_' + uploadStack[stackLength].guid);
                  duplicateMsg.show();
                  duplicateMsg.text(FormListConst.FORM_LIST_DUPLICATE_METADATA_FILE_NAME);
                  $('.tileHolder').height(tileDiv.height() + 1);
                  flag = true;
                }
                else {
                  angular.element('#DuplicateFileName_' + uploadStack[stackLength].guid).hide();
                }
              }
            }
          }
          return flag;
        }

        //This function resets the file upload area to default state; once user clicks on close button
        function resetDefaultDragDrop() {
          importButtonToggle.removeAttr('disabled');
          uploadShowCase.hide();
          $('#saveButton,#closeButton').hide();
          uploadStack = [];
          dragDropArea.remove();
          uploadShowCase.remove();
          angular.element('.clearfix.actionButtonHolder').remove();
          objNextGenFileUpload = {};
          initializeUploadControl();
        }

        // Binding enableSaveButton() to fileUploadControlHolder
        $('.fileUploadControlHolder').bind('keyup change', enableSaveButton);

        //This function enables the save button when user changes any metadata
        function enableSaveButton() {
          $('#saveButton').attr('disabled', false);
        }

      });
    }
  }
}());
