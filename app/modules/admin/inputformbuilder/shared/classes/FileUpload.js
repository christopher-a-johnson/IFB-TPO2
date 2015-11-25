IFB_NAMESPACE.FileUpload = (function () {
  'use strict';

  var uploadStack = [], //upload file item store array
    uploadControlDragAreaDivId = '',//Id  of div where files are dragged and dropped or selected from select button
    filesUploadedAreaDivId = '', //Id  of div responsible for progress of all the selected files for upload
    maxFileNameLength = 30, //default max length of file name is 30
    maxFileSize = 400, // default file size maximum limit is 400kb
    isMultiFileUpload = true, //false when single file upload
    uploadButtonId = '', //Id  of button responsible for starting upload
    cancelButtonId = '', //Id  of button responsible for cancelling upload
    fileSelectButtonId = '', //Id of button used for firing file select
    fileUploadControlId = '',//Id of button used for file Upload
    filter = '', //file filter type  viz .css, .js etc
    saveUrl = '', // Upload url link path
    controlId = '', //div id to be made into draggable file upload area
    dropDirectionParaId = '',//paragraph direction to drop files
    supportedFileTypeParaId = '', //paragraph id for showing File validation errors
    dropDirectionMsg = '', // drop message direction in the control

    fileDropZoneCss = '', //css class for draggable div
    fileUploadCtrl = '', //file upload control
    fileFilterErrorMessage = '', // invalid file extension error message
    fileSizeErrorMessage = '', //invalid file size error message
    fileNameLengthErrorMessage = '', //file name character length validation
    supportedFormatsText = '',// supported file formats for drage drop
    fileTypeIconCss = '', //type of file type icon css class name
    dropZoneClass = ''; //css to the drag drop area

  var fileUpload = {}; // to be returned to with control state when the object is to be used in IFB angularJs integration

  function initialize(options) {
    uploadStack = []; // clear the upload stack

    saveUrl = options.url; // Upload url link path
    controlId = options.controlId; //div id to be made into draggable file upload area

    isMultiFileUpload = options.isMultiFileUpload; // get from user the type of file upload  i.e single file upload or muti-file upload

    filter = options.fileType; //file filter type  viz .css, .js etc
    fileFilterErrorMessage = options.fileFilterErrorMessage; //file extension validation error message
    maxFileSize = options.maxFileSize; //max file size - 400kb
    fileSizeErrorMessage = options.fileSizeErrorMessage; //file size error message
    maxFileNameLength = options.maxFileNameLength;
    fileNameLengthErrorMessage = options.fileNameLengthErrorMessage; //validation error message when file size exceeds 30 character length
    supportedFormatsText = options.supportedFormatsText;//text displaying which formats are supported for upload
    fileDropZoneCss = options.fileDropZoneCss; //css class for draggable div
    fileTypeIconCss = options.fileTypeIconCss; // type of icon for file type being uploaded
    dropDirectionMsg = options.dropDirectionMsg; // drop or drag file instruction message

    initializeDragDropDivArea();

    //after the control has been rendered and ids have been assigned to the controls fill the fileUpload object
    setUploadControlAccessProperties();

    return fileUpload;
  }

  /// set the upload file properties in the object , which need access during dom manipulation
  function setUploadControlAccessProperties() {
    fileUpload.uploadControlDragAreaDivId = uploadControlDragAreaDivId;
    fileUpload.uploadStack = uploadStack;
    fileUpload.filesUploadedAreaDivId = filesUploadedAreaDivId;
    fileUpload.uploadButtonId = uploadButtonId;
    fileUpload.cancelButtonId = cancelButtonId;
    fileUpload.fileSelectButtonId = fileSelectButtonId;
    fileUpload.fileUploadControlId = fileUploadControlId;
    fileUpload.filter = filter;
    fileUpload.saveUrl = saveUrl;
    fileUpload.isMultiFileUpload = isMultiFileUpload;
    fileUpload.fileDropZoneCss = fileDropZoneCss;
  }

  //intialize Upload Progress Area
  function initUploadProgressArea() {
    var uploadProgressAreaDiv = document.getElementById(filesUploadedAreaDivId);
    //clean the area for new uploads
    uploadProgressAreaDiv.innerHTML = '';
    //get the file icons class
    var fileIconClass = fileTypeIconCss;

    var tileDivHolder, tileDiv, progressBgDiv, par, errPar, nameSpan, fileName, fileUploadStatusFor, deleteThisFileIconSpan = '';
    var crossX = '';
    for (var i = 0; i < uploadStack.length; i++) {
      //Create main div
      tileDivHolder = document.createElement('DIV');
      tileDivHolder.className = 'tileHolder';
      tileDivHolder.id = 'tileFor' + uploadStack[i].guid;

      tileDiv = document.createElement('DIV');
      tileDiv.className = 'tile';
      //Create progressbar to show bottle filing effect
      progressBgDiv = document.createElement('DIV');
      progressBgDiv.className = 'progressBgDiv';
      progressBgDiv.id = 'progressFor' + uploadStack[i].guid;
      //add the progress div inside the tile div
      tileDiv.appendChild(progressBgDiv);

      //Create paragraph showing details of file
      par = document.createElement('P');
      par.className = 'clearfix';

      //Create span for name of file
      nameSpan = document.createElement('SPAN');
      nameSpan.className = 'name ellipsis ' + fileIconClass;
      fileName = document.createTextNode(uploadStack[i].name);
      nameSpan.appendChild(fileName);
      par.appendChild(nameSpan);
      tileDiv.appendChild(par);

      //Create paragraph showing error message
      errPar = document.createElement('DIV');
      errPar.className = 'errorMessageInTile';
      errPar.id = 'errorMessageInTile' + uploadStack[i].guid;
      tileDiv.appendChild(errPar);

      //Create delete button
      fileUploadStatusFor = document.createElement('DIV');
      fileUploadStatusFor.id = 'fileUploadStatusFor' + uploadStack[i].guid;
      fileUploadStatusFor.className = 'fileUploadStatusFor';

      deleteThisFileIconSpan = document.createElement('SPAN');
      deleteThisFileIconSpan.className = 'deleteSelection';

      crossX = document.createElement('SPAN');
      crossX.className = 'crossImageSrc';
      crossX.addEventListener('click', deleteFileFromUploadProgressDiv, false);
      crossX.id = uploadStack[i].guid;
      deleteThisFileIconSpan.appendChild(crossX);
      fileUploadStatusFor.appendChild(deleteThisFileIconSpan);

      tileDiv.appendChild(fileUploadStatusFor);
      tileDivHolder.appendChild(tileDiv);

      uploadProgressAreaDiv.appendChild(tileDivHolder);
    }

    document.getElementById(uploadButtonId).style.display = 'block';
    document.getElementById(cancelButtonId).style.display = 'block';
  }

  function fileSelectHandler(e) {
    // cancel event and hover styling
    fileDragHover(e);
    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;
    // process all File objects

    var f = '';
    if (isMultiFileUpload === true) {
      var i = 0;
      for (i = 0; i < (files.length); i++) {
        f = files[i];
        f.guid = getGuid(); // ToDo :Replace by generateGUID call in Utility Class when intergrating with Angular JS
        f.status = 'added';
        f.description = '';
        uploadStack.push(f);
      }
    }
    else { //if single file uplod is enabled
      if (uploadStack.length === 0) {

        if (files.length === 1) {
          f = files[0];
          f.guid = getGuid(); // ToDo :Replace by generateGUID call in Utility Class
          f.status = 'added';
          f.description = '';
          uploadStack.push(f);
          syncControlsForSingleFileUpload(files.length);
        }
      }

    }
    document.getElementById(fileSelectButtonId).className = 'fileUploadBtn';
    initUploadProgressArea();
    //any time during file rendering of control the upload stack becomes empty make sync behaviour of other controls
    if (uploadStack.length === 0) {
      syncControlsWhenUploadStackEmpty();
    }
  }

  function selectFile() {
    fileUploadCtrl.click();
  }

  function isFileValid(file) {
    var isValid = true;
    //check if file extension is valid
    if (isValid) {
      if (!isfileExtensionValid(file)) {
        file.status = 'invalid';
        file.description = fileFilterErrorMessage;
        isValid = false;
      }
    }
    //check if file name Length is valid
    if (isValid) {
      if (!isfileNameLengthValid(file)) {
        file.status = 'invalid';
        file.description = fileNameLengthErrorMessage;
        isValid = false;
      }
    }
    //check if file Size is valid
    if (isValid) {
      if (!isfileSizeValid(file)) {
        file.status = 'invalid';
        file.description = fileSizeErrorMessage;
        isValid = false;
      }
    }
  }

  function isfileSizeValid(file) {
    var fileSize = Math.floor(file.size) / (1024); //convert byts to KBs
    if (fileSize > maxFileSize) {
      return false;
    }
    else {
      return true;
    }
  }

  function isfileExtensionValid(file) {
    var allowedFileExtensions = filter;
    var extension = file.name.split('.').pop().toLowerCase();
    if (parseInt(allowedFileExtensions.indexOf(extension), 10) < 0) {
      return false;
    }
    else {
      return true;
    }
  }

  function isfileNameLengthValid(file) {
    var fileNameLength = file.name.length;
    if (fileNameLength > maxFileNameLength) {
      return false;
    }
    else {
      return true;
    }

  }

  function btnUpload() {
    //disable the upload and cancel buttons on Upload button click
    document.getElementById(uploadButtonId).disabled = true;
    document.getElementById(cancelButtonId).disabled = true;
    document.getElementById(fileSelectButtonId).disabled = true;

    //Check validation rules
    var i, j = 0;
    for (i = 0; i < uploadStack.length; i++) {
      isFileValid(uploadStack[i]);

      if (uploadStack[i].status === 'invalid') {
        //need to recreate the image variable every time
        var showExclamationMark = document.createElement('SPAN');
        showExclamationMark.className = 'notificationImageAtRightCorner exclamationImageSrc';
        //modify the div for upload file boxes when they fail validation
        document.getElementById('fileUploadStatusFor' + uploadStack[i].guid).innerHTML = '';// IMP: Need to remove text
        document.getElementById('fileUploadStatusFor' + uploadStack[i].guid).appendChild(showExclamationMark);
        document.getElementById('errorMessageInTile' + uploadStack[i].guid).innerHTML = uploadStack[i].description;
        document.getElementById('tileFor' + uploadStack[i].guid).className = 'tileHolder errorBg';
      }
    }

    //remove files from stack that are invalid
    //for that create a temporary array and keep only valid in it
    //copy this array information to uploadstack
    var tempValidFilesArray = [];
    for (i = 0, j = 0; i < uploadStack.length; i++) {
      if (uploadStack[i].status !== 'invalid') {
        tempValidFilesArray[j] = uploadStack[i];
        j++;
      }
    }
    uploadStack = [];
    uploadStack.push.apply(uploadStack, tempValidFilesArray);

    //now that upload stack has only valid files
    //upload  all the valid files that are left in the stack
    if (uploadStack.length > 0) {
      var l = 0;
      for (l = 0; l < uploadStack.length; l++) {
        uploadFile(uploadStack[l]);
      }
    }
  }

  function getXmlHttpRequestObject() {
    var xmlHttpReq = null;
    try {
      xmlHttpReq = new XMLHttpRequest();
      return xmlHttpReq;
    } catch (e) {
    }
    throw 'Unable to create  XMLHttpRequest object';
  }

  function showProgressBar(xhr, file) {
    // create progress bar
    var progressBarDiv = document.getElementById('progressFor' + file.guid);

    // progress bar
    xhr.upload.addEventListener('progress', function (e) {
      var uploadPercent = parseInt(e.loaded / e.total * 100, 10);
      if (uploadPercent > 0) {
        progressBarDiv.style.width = uploadPercent + '%';
        document.getElementById('fileUploadStatusFor' + file.guid).innerHTML = uploadPercent + '%';
      }
    }, false);
  }

  function uploadFile(file) {
    try {
      var xhr = getXmlHttpRequestObject();
      var xhrStatus = '';
      if (xhr.upload) {
        var showTick = document.createElement('SPAN');
        showTick.className = 'notificationImageAtRightCorner tickImageSrc';
        showProgressBar(xhr, file); //shows progress bar
        var data = new FormData();

        data.append('importFiles', file);
        // start upload
        xhr.onreadystatechange = function () {

          if (xhr.readyState === 4) {
            xhrStatus = xhr.status;

            setFileStatus(file, xhr);

            if (xhr.status === 200) {
              document.getElementById('fileUploadStatusFor' + file.guid).innerHTML = '';// it is need here to make innerHTML empty
              document.getElementById('fileUploadStatusFor' + file.guid).appendChild(showTick);
            }
          }
        };
        xhr.open('POST', saveUrl, true);
        xhr.send(data);
      }
    }
    catch (e) {
    }
  }

  function setFileStatus(file, xhr) {
    file.status = xhr.status;
    file.serverResponseMsg = JSON.parse(xhr.responseText);
    file.description = getFileUploadStatus(xhr.status);
  }

  function cancelUpload() {
    syncControlsWhenUploadStackEmpty();
  }

  function fileDragHover(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.className === dropZoneClass || e.target.className === dropZoneClass + ' hover') {
      e.target.className = (e.type === 'dragover' ? dropZoneClass + ' hover' : dropZoneClass);
      document.getElementById(fileSelectButtonId).className = 'fileUploadBtn camouflage';
      document.getElementById(fileSelectButtonId).className = 'fileUploadBtn camouflage';
    }
  }

  function dragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  function dragLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    if (e.target.className === dropZoneClass || e.target.className === dropZoneClass + ' hover') {
      e.target.className = (e.type === 'dragleave' ? dropZoneClass : dropZoneClass + ' hover');
      document.getElementById(fileSelectButtonId).className = 'fileUploadBtn';
      document.getElementById(fileSelectButtonId).className = 'fileUploadBtn';
    }
  }

  function deleteFileFromUploadProgressDiv(event) {
    ///cross browser remove  functionality
    var elementId, fileBoxDiv = '';
    var l = 0;
    for (l = 0; l < uploadStack.length; l++) {
      if (uploadStack[l].guid === (event.target.id)) {
        uploadStack.splice(l, 1);
        elementId = event.target.id;
        fileBoxDiv = document.getElementById('tileFor' + elementId);
        fileBoxDiv.outerHTML = '';
        fileBoxDiv = null;
        break;
      }
    }

    if (uploadStack.length === 0) {
      //hide the upload and cancel button when the upload stack is empty
      syncControlsWhenUploadStackEmpty();
    }
  }

  function syncControlsForSingleFileUpload() {
    document.getElementById(uploadButtonId).style.display = 'block';
    document.getElementById(cancelButtonId).style.display = 'block';
  }

  function syncControlsWhenUploadStackEmpty() {
    uploadStack = [];
    document.getElementById(filesUploadedAreaDivId).innerHTML = '';
    document.getElementById(uploadButtonId).style.display = 'none';
    document.getElementById(cancelButtonId).style.display = 'none';
  }

  // To Do Remove this function and use Utilty.generateGUID when integating with IFB angularJS
  function getGuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  //To Do Remove this function and use Utilty.generateGUID when integating with IFB angularJS
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  function getFileUploadStatus(statusCode) {
    var filUploadStatusMsg;
    switch (statusCode) {
      case 200:
        filUploadStatusMsg = 'File Upload Success';
        break;
      case 401:
        filUploadStatusMsg = 'File Upload UnAuthorized';
        break;
      case 403:
        filUploadStatusMsg = 'File Upload Forbidden';
        break;
      case 404:
        filUploadStatusMsg = 'Service Unavailable';
        break;
      case 500, 501:
        filUploadStatusMsg = 'Internal Server Error';
        break;
      case 504:
        filUploadStatusMsg = 'Gateway Timeout';
        break;
      default:
        filUploadStatusMsg = 'Unknown Error';
        break;
    }

    return filUploadStatusMsg;
  }

  function initializeDragDropDivArea() {

    var divToBind = document.getElementById(controlId);
    dropZoneClass = fileDropZoneCss;

    var directionWithButtonDiv = document.createElement('DIV');
    directionWithButtonDiv.id = 'directionWithButtonDiv' + getGuid();
    directionWithButtonDiv.className = 'directionWithButtonClass';

    var dropDirectionPara = document.createElement('P');
    dropDirectionPara.Id = 'dropDirectionParaId' + getGuid();
    dropDirectionParaId = dropDirectionPara.Id;
    var directionText = document.createTextNode(dropDirectionMsg);
    dropDirectionPara.appendChild(directionText);

    //select button
    var fileSelectButton = document.createElement('BUTTON');
    fileSelectButton.id = 'fileButton' + getGuid(); // ToDo :Replace by generateGUID call in Utility Class
    fileSelectButtonId = fileSelectButton.id;
    fileSelectButton.className = 'fileUploadBtn';
    fileSelectButton.textContent = 'Select Files';

    directionWithButtonDiv.appendChild(dropDirectionPara);
    directionWithButtonDiv.appendChild(fileSelectButton);

    //supportedFileTypePara
    var supportedFileTypePara = document.createElement('P');
    supportedFileTypePara.Id = 'supportedFileTypePara' + getGuid();
    supportedFileTypePara.className = 'supportedFileTypePara';
    supportedFileTypeParaId = supportedFileTypePara.Id;
    //showing supported file types message
    var supportedFilesFormatText = document.createTextNode(supportedFormatsText);
    supportedFileTypePara.appendChild(supportedFilesFormatText);

    var uploadControlDragAreaDiv = document.createElement('DIV');
    uploadControlDragAreaDiv.id = 'fileDrag' + getGuid(); // ToDo :Replace by generateGUID call in Utility Class
    uploadControlDragAreaDivId = uploadControlDragAreaDiv.id;
    uploadControlDragAreaDiv.className = dropZoneClass;
    uploadControlDragAreaDiv.appendChild(directionWithButtonDiv);
    uploadControlDragAreaDiv.appendChild(supportedFileTypePara);

    fileUploadCtrl = document.createElement('INPUT');
    fileUploadCtrl.id = 'fileInput' + getGuid(); // ToDo :Replace by generateGUID call in Utility Class
    fileUploadControlId = fileUploadCtrl.id;
    fileUploadCtrl.type = 'file';
    if (isMultiFileUpload) {
      //need to set 'multiple' in the input file control's mulitple property for selecting multiple files
      fileUploadCtrl.multiple = 'multiple';
    }

    var hidefileDiv = document.createElement('DIV');
    hidefileDiv.className = 'ifb_fileUploadCtrl';

    hidefileDiv.appendChild(fileUploadCtrl);
    uploadControlDragAreaDiv.appendChild(hidefileDiv);

    //progress Div
    var filesUploadedAreaDiv = document.createElement('DIV');
    filesUploadedAreaDiv.id = 'uploadShowCase' + getGuid(); // ToDo :Replace by generateGUID call in Utility Class
    filesUploadedAreaDivId = filesUploadedAreaDiv.id;
    filesUploadedAreaDiv.className = 'clearfix';

    //upload button
    var uploadButton = document.createElement('BUTTON');
    uploadButton.className = 'fileUploadBtn uploadButton';
    uploadButton.id = 'uploadButton' + getGuid(); // ToDo :Replace by generateGUID call in Utility Class
    uploadButtonId = uploadButton.id;
    uploadButton.textContent = 'Upload Files';

    //cancel button
    var cancelButton = document.createElement('BUTTON');
    cancelButton.className = 'fileUploadBtn cancelButton';
    cancelButton.id = 'cancelButton' + getGuid(); // ToDo :Replace by generateGUID call in Utility Class
    cancelButtonId = cancelButton.id;
    cancelButton.textContent = 'Cancel';

    divToBind.appendChild(uploadControlDragAreaDiv);
    divToBind.appendChild(filesUploadedAreaDiv);

    //add the cancel and upload buttons in a div
    var divButtonWrapper = document.createElement('DIV');
    divButtonWrapper.className = 'clearfix actionButtonHolder';
    divButtonWrapper.appendChild(cancelButton);
    divButtonWrapper.appendChild(uploadButton);
    divToBind.appendChild(divButtonWrapper);

    //add event listener to the click event of file select, upload and cancel button
    fileSelectButton.addEventListener('click', selectFile, false);
    uploadButton.addEventListener('click', btnUpload, false);
    cancelButton.addEventListener('click', cancelUpload, false);
    //add event listener to the change event of file select button
    fileUploadCtrl.addEventListener('change', fileSelectHandler, false);

    var xhrRequest = getXmlHttpRequestObject();

    if (xhrRequest.upload) {
      var divDragDrop = document.getElementById(uploadControlDragAreaDivId);
      divDragDrop.addEventListener('dragenter', dragEnter, false);
      divDragDrop.addEventListener('dragover', fileDragHover, false);
      divDragDrop.addEventListener('dragleave', dragLeave, false);
      divDragDrop.addEventListener('drop', fileSelectHandler, false);
    }
  }

  return {
    init: initialize
  };
}(IFB_NAMESPACE.FileUpload || {}));
