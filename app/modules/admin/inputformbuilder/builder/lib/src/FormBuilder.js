//TODO: I (Xiaomin) have to disable this file for now (06/01/2015) as there are twoo many JSHINT
//errors. Will review when we start to use this file in the implemenetation.
//CONST
//var CONSTANTS = {
//  panel: $('#fileUpload'),
//  panelControl: $('#fileUpload').find('span')
//};
//
//var kendo = window.kendo;
//var frozenColumnsArray=[];
//var formListGrid, formListGridTooltip;
//
////GLOBAL VARS
//var uploadError = 0;
//var FileUploadFiles = {};
//var uploadPanelVisible = false;
//
//function initFormListGrid(data) {
//  'use strict';
//  var templateGridRow = kendo.template($('#rowTemplate').html());
//  var templateGridRowDetails = kendo.template($('#detailTemplate').html());
//
//  formListGrid = $('#grid').kendoGrid({
//    dataSource: {
//      data: data,
//      schema: {
//        model: {
//          id: 'Id',
//          fields: {
//            Id: {editable: false, nullable: false},
//            FormName: {type: 'string'},
//            Description: {type: 'string'},
//            Enabled: {type: 'boolean'},
//            LastModifiedBy: {type: 'string'},
//            LastModifiedDateTime: {type: 'string'}
//          }
//        }
//      },
//      pageSize: 20,
//      sort: {
//        field: 'LastModifiedDateTime',
//        dir: 'desc'
//      }
//    },
//    scrollable: true,
//    sortable: true,
//    resizable: true,
//    columnResize: onGridColumnResize,
//    editable: {
//      mode: 'popup',
//      template: templateGridRowDetails,
//      window: {draggable: false},
//      confirmation: false
//    },
//    edit: function (e) {
//      $('.k-grid-update').text('Save').css('float', 'right');
//
//      if (e.model.isNew()) {
//        $('.k-window-title').text('Duplicate');
//        e.model.set('FormName', 'Copy of ' + _activeItem.FormName);
//        e.model.set('Description', _activeItem.Description);
//        //enabled
//      } else {
//        $('.k-window-title').text('Quick Edit');
//      }
//    },
//    remove: function (e) {
//      //console.log('removed');
//    },
//    columns: [
//      {field: 'SEL', width: 44, title: ' ', freeze: true},
//      {field: 'FormName', width: 250, title: 'Form Name'},
//      {field: 'Description', width: 300, title: 'Form Description', freeze: true},
//      {field: 'Enabled', width: 70, title: 'Enabled'},
//      {field: 'LastModifiedBy', width: 150, title: 'Last Modified By'},
//      {field: 'LastModifiedDateTime', width: 180, title: 'Time Stamp'},
//      {field: 'Id', hidden: true}
//    ],
//    pageable: {
//      pageSize: 20,
//      pageSizes: true,
//      input: true,
//      messages: {display: '{0}-{1} of {2} forms', page: '', itemsPerPage: 'per page'}
//    },
//    rowTemplate: templateGridRow
//  }).data('kendoGrid');
//
//  //look into adding this into grid object
//  $.each(formListGrid.options.columns, function (index, value) {
//    if (value.freeze === true) {
//      frozenColumnsArray.push({'index': index, 'column': value['field']});
//    }
//  });
//
//  var pagerElements = $('#grid > .k-grid-pager').children();
//
//  $('#grid > .k-grid-pager').prepend(pagerElements[4]).prepend(pagerElements[5]);
//
//  $(pagerElements[2]).remove();
//  $(pagerElements[0]).insertAfter(pagerElements[3]);
//  $(pagerElements[1]).insertAfter(pagerElements[3]);
//
//  /*
//   [
//   0   <a class='k-link k-pager-nav k-pager-first k-state-disabled' title='Go to the first page' href='#' data-page='1' tabindex='-1'>
//   1   <a class='k-link k-pager-nav k-state-disabled' title='Go to the previous page' href='#' data-page='1' tabindex='-1'>
//   2   <ul class='k-pager-numbers k-reset'>
//   3   <span class='k-pager-input k-label'>
//   4   <a class='k-link k-pager-nav' title='Go to the next page' href='#' data-page='2' tabindex='-1'>
//   5   <a class='k-link k-pager-nav k-pager-last' title='Go to the last page' href='#' data-page='2' tabindex='-1'>
//   6   <span class='k-pager-sizes k-label'>
//   7   <span class='k-pager-info k-label'>1 - 20 of 39 items</span>
//   ]
//   */
//}
//
//function initFormListDetailWindow() {
//  dialogWindow.kendoWindow({
//    modal: true,
//    visible: false,
//    resizable: false,
//    draggable: false
//  }).data('kendoWindow');
//}
//
//function initFormListTooltip() {
//  'use strict';
//  var templateRowControls = kendo.template($('#rowControlTooltip').html());
//  var formListGridTooltip = $('#grid').kendoTooltip({
//    filter: '.MENU img',
//    autoHide: false,
//    position: 'right',
//    width: $('#grid').width() - 60,
//    callout: false,
//    show: function (e) {
//      selectGridRowControls();
//      $('.k-tooltip-button').hide();
//      adjustTooltipPosition($(this)[0], 'left', 7);
//    },
//    hide: function (e) {
//      hideGridRowControls();
//    },
//    showOn: 'click',
//    content: function (e) {
//      var dataItem = getDataItem(e.target.closest('tr'));
//      var template = template_rowControls;
//      _activeItem = dataItem;
//      return template(dataItem);
//    }
//  }).data('kendoTooltip');
//}
//
//function initFileUploadFile() {
//  $('#importFiles').kendoUpload({
//    multiple: true,
//    async: {
//      saveUrl: '/Upload/Save',
//      removeUrl: '/Upload/Remove',
//      autoUpload: false
//    },
//    template: kendo.template($('#fileUploadTemplate').html()),
//    localization: {
//      dropFilesHere: 'efrm files allowed only'
//    },
//    select: onFileUploadSelect,
//    success: onFileUploadSuccess,           //TODO:Create handler to handle all responses
//    upload: onFileUpload,
//    remove: onFileUploadRemove,
//    complete: onFileUploadComplete,       //All responses come back as success if JSON string is returned
//  });
//
//  $('#fileUploadLabel').append($('.k-upload-button'));
//  $('.k-dropzone').prepend($('#fileUploadLabel'));
//}
//
//function onFileUploadSelect(e) {
//  'use strict';
//  var btn = $('<button id=\'cancelFileUpload\' class=\'k-button\'>Cancel</button>');
//  //console.log($('.k-upload').filter('#cancelFileUpload'));
//
//
//  setTimeout(function () {
//    if ($('#cancelFileUpload').length === 0) {
//      $('.k-upload-selected').before(btn)
//    }
//  }, 50);
//
//
//  $.each(e.files, function (index, value) {
//    value.state = 'selected';
//    FileUploadFiles[value.uid] = value;
//  });
//}
//
//function onFileUpload() {
//  'use strict';
//  $('.k-dropzone, #cancelFileUpload').hide();
//}
//
//function onFileUploadSuccess(e) {
//  'use strict';
//  var response = e.response.data;
//
//  var uid = e.files[0].uid;
//  var listItem = 'li[data-uid=' + uid + ']';
//
//  $(listItem + ' .k-progress .fileDetails').hide();
//
//  //for testing populate array object that populates table
//  if (response.Errors.toLowerCase() === 'false') {
//    var obj = {
//      Id: response.Id,
//      FormName: 'Justo Cetero Inimicus Vis Te',
//      Description: 'Justo Cetero Inimicus Vis Tejusto Cetero Inimicus Vis Tejusto',
//      Enabled: 0,
//      LastModifiedBy: response.ModifiedBy,
//      LastModifiedDateTime: response.ModifiedTimeStamp
//    };
//    formsList.push(obj);
//
//    $(listItem + ' .k-progress .fileDetails').show();
//    FileUploadFiles[uid].uploaded = true;
//    FileUploadFiles[uid].imageId = response.ImageId;
//  } else {
//    $(listItem).removeClass('k-file-success').addClass('k-file-error');
//
//    var msg = '<span>' + response.Message + '</span>';
//    var btn = $('<button>Close</button>');
//    btn.attr('id', 'confirmationButton');
//    btn.on('click', function () {
//      $('#uploadErrors').remove();
//      resetUploadPanel();
//    });
//
//    $(listItem + ' .k-progress').append(msg);
//    FileUploadFiles[uid].uploaded = false;
//  }
//
//}
//
//function onFileUploadComplete() {
//  'use strict';
//  var totalFiles = FileUploadFiles.length;
//  var totalErrors = 0;
//
//  $.each(FileUploadFiles, function () {
//    if (this.uploaded === false) {
//      totalErrors++;
//    }
//  });
//
//  var btn = $('<button class=\'k-button\'/>');
//
//  if (totalFiles === totalErrors) {
//    btn.attr('id', 'fileUploadClose').text('Ok and Close');
//    btn.on('click', function () {
//      resetUploadPanel();
//    });
//  } else {
//    btn.attr('id', 'fileUploadSave').text('Save and Close');
//    btn.on('click', function () {
//      saveFileMetadata();
//    });
//
//    //formListGrid.refresh();                       ///////         refresh grid (SERVER)
//    formListGrid.dataSource.data(formsList);        //////          refresh grid (LOCAL) ||||||||||||||||||||| REMOVE
//  }
//
//  $('#cancelFileUpload').after(btn);
//}
//
//function onFileUploadRemove(e) {
//  'use strict';
//  var uid = e.files[0].uid;
//  var obj = 'li[data-uid=' + uid + ']';
//  $(obj).hasClass('k-file-success');
//  if ($(obj).hasClass('k-file-success')) {
//    var conf = confirm('This file has been uploaded and will be permanently deleted. Are you sure you want to remove this file?');
//
//    if (!conf) {
//      e.preventDefault();
//    }
//  }
//}
//
//function saveFileMetadata() {
//  'use strict';
//  $.each(FileUploadFiles, function () {
//    if (this.uploaded === true) {
//      var uid = this.uid;
//      var listItem = 'li[data-uid=' + uid + ']';
//      var listFileDetails = $(listItem + ' .k-progress .fileDetails');
//
//      var data = {
//        formName: listFileDetails.children('.upload-formName').val(),
//        formDescription: listFileDetails.children('.upload-formDescription').val(),
//        enabled: listFileDetails.children('.upload-formEnabled').prop('checked')
//      }
//      //console.log(data);
//      //$.post(url,data)
//    }
//  });
//
//  //resetUploadPanel();
//}
//
//function resetUploadPanel() {
//  'use strict';
//  $('.k-upload-files').remove();
//  $('.k-upload-status').remove();
//  $('.k-upload.k-header').addClass('k-upload-empty');
//  $('.k-upload-button').removeClass('k-state-focused');
//  $('.k-dropzone').show();
//  uploadPanelVisible = false;
//  collapsePanel();
//}
//
//function initUploadPanel() {
//  'use strict';
//  //var contentElement = $('#fileUpload');
//  //var closeElem = 'span.k-i-arrowhead-s';
//  //var openElem = 'span.k-i-arrowhead-e';
//
//  //toggle
//  $('#importButton').on('click', function (e) {
//    togglePanel();
//  });
//}
//
//function initStandardFormsWindow() {
//  'use strict';
//  var closeFormsWindow = function () {
//    //console.log('closed');
//  };
//
//  openFormsWindow.kendoWindow({
//    width: '600px',
//    height: '400px',
//    title: 'Open Standard Form',
//    actions: ['Close'],
//    draggable: false,
//    modal: true,
//    resizable: false,
//    visible: false,
//    close: closeFormsWindow
//  });
//
//  initStandardFormsListView();
//}
//
//function initStandardFormsListView() {
//  'use strict';
//  var standardFormsDS = new kendo.data.DataSource({
//    data: [
//      {name: 'At phaedrum pertinax vis', id: 14},
//      {name: 'An principes philosophia vis', id: 15},
//      {name: 'mei soluta eripuit corpora ne', id: 16},
//      {name: 'Vim ei nibh minim graeci', id: 17},
//      {name: 'est ad stet tempor virtute', id: 18},
//      {name: 'Vix reque legimus referrentur eu', id: 19},
//      {name: 'ei vis signiferumque vituperatoribus', id: 20},
//      {name: 'ius diceret sadipscing ad', id: 21},
//      {name: 'Ad aperiam euismod urbanitas nec', id: 22},
//      {name: 'Sit erat altera ea', id: 23},
//      {name: 'ei aperiri dignissim usu', id: 24},
//      {name: 'Quo ea fugit soluta consulatu', id: 25},
//      {name: 'in eam discere detraxit pertinax', id: 26},
//      {name: 'quot tota alienum et mei', id: 27},
//      {name: 'Veritus quaestio ei ius', id: 28},
//      {name: 'Ei iuvaret repudiandae eos', id: 29},
//      {name: 'Sed at vocent delectus', id: 30},
//      {name: 'detraxit adolescens his ei', id: 31},
//      {name: 'Fugit gubergren percipitur eos ei', id: 32},
//      {name: 'ne eam veri appareat singulis', id: 33},
//      {name: 'ad wisi reque vix', id: 34},
//      {name: 'Ex quem discere inciderint sit', id: 35},
//      {name: 'nam te congue disputando', id: 36},
//      {name: 'ei usu aperiri adolescens efficiantur', id: 37},
//      {name: 'Erat velit honestatis at mel', id: 38},
//      {name: 'nam ut inimicus volutpat', id: 39}
//    ]
//  });
//
//  createFormList('#standardFormsListView', standardFormsDS);
//}
//
//function createFormList(obj, ds) {
//  'use strict';
//  $(obj).kendoListView({
//    dataSource: ds,
//    selectable: true,
//    navigatable: true,
//    change: setSelectedFormListValue,
//    template: '<li id=\'#:id#\'>#:name#</li>'
//  });
//}
//function clearSelectedForms() {
//  'use strict';
//  $('#openFormTabs .tab').children('ul').each(function () {
//    $(this).data('kendoListView').clearSelection();
//  });
//}
//
//function setSelectedFormListValue() {
//  'use strict';
//  var data = this.dataSource.view(),
//    selected = $.map(this.select(), function (item) {
//      return data[$(item).index()].id;
//    });
//  selectedFormId = selected.join('');
//}
//function setDialogOptions(options) {
//  'use strict';
//  var dialog = dialogWindow.data('kendoWindow');
//  dialog.setOptions(options);
//}
//
//
////BINDINGS
//function initBindings() {
//  'use strict';
//  $('#openStandardFormButton').on('click', function () {
//    openDialog('standardForm');
//  });
//  $('#windowCloseButton').on('click', function () {
//    openFormsWindow.data('kendoWindow').close();
//  });
//}
//
////EVENTS
//function onGridColumnResize(e) {
//  'use strict';
//  var resizedField = e.column.field,
//      childIndex = 0, colGroup, childItem;
//
//  $('#grid colgroup').each(function (cgIndex, cgValue) {
//    colGroup = $(this);
//    childIndex = 0;
//
//    $.each(frozenColumnsArray, function (cIndex, cValue) {
//      if (cValue.column === resizedField) {
//        childIndex = cValue.index + 1;
//      }
//    });
//
//    if (childIndex > 0) {
//      childItem = ':nth-child(' + childIndex + ')';
//      $(cgValue).find(childItem).css('width', e.oldWidth);
//    }
//
//  });
//}
//
//
//function editForm(_activeItem) {
//  'use strict';
//  formListGrid.editRow(_activeItem);
//}
//
//function previewForm(_activeItem) {
//  'use strict';
//  var opts={};
//  opts.params = {
//    title: 'Form Preview : ' + _activeItem.FormName,
//    width: 900,
//    height: 600
//  };
//  openDialog('preview', opts);
//}
//
//function duplicateForm() {
//  'use strict';
//  formListGrid.addRow();
//  var opts={};
//  opts.params = {
//    title: 'Duplicate',
//    width: 300,
//    height: 150
//  };
//  //wait for the return from the server before opening this window
//  openDialog('duplicate', opts);
//}
//
//function deleteForm() {
//  'use strict';
//  var opts = {};
//  opts.params = {
//    title: 'Delete',
//    width: 300,
//    height: 150
//  };
//  opts.content = 'Warning!<br/>This will permanently delete the form.<br/>Are you sure you want to delete the form: ' + _activeItem.FormName + '?';
//  opts.callback = {type: 'confirm', action: 'delete'};
//  //$('.k-tooltip-button').click();
//  formListGridTooltip.hide();
//  formListGrid.removeRow('tr[data-uid=' + _activeItem.uid + ']');
//
//  openDialog('delete', opts);
//}
//
//function togglePanel() {
//  'use strict';
//  if (uploadPanelVisible) {
//    collapsePanel();
//  } else {
//    expandPanel();
//  }
//  uploadPanelVisible = !uploadPanelVisible;
//}
//function expandPanel() {
//  'use strict';
//  $(CONSTANTS.panelControl).removeClass('k-i-arrowhead-s').addClass('k-i-arrowhead-e');
//  kendo.fx(CONSTANTS.panel).expand('vertical').stop().play();
//}
//function collapsePanel() {
//  'use strict';
//  $(CONSTANTS.panelControl).removeClass('k-i-arrowhead-e').addClass('k-i-arrowhead-s');
//  kendo.fx(CONSTANTS.panel).expand('vertical').stop().reverse();
//}
//
//function adjustTooltipPosition(tt, dir, px) {
//  'use strict';
//  var ttId = '#' + tt.popup.element[0].id;
//  var ttWrapper = $(ttId).parent();
//
//  adjustObjectPosition(ttWrapper, dir, px);
//}
//
//function adjustObjectPosition(obj, dir, px) {
//  'use strict';
//  var objPos = obj.position(), size;
//
//  switch (dir) {
//    case 'left':
//      size = objPos.left + px;
//      break;
//    case 'right':
//      size = objPos.left - px;
//      break;
//    case 'top':
//      size = objPos.top + px;
//      break;
//    case 'bottom':
//      size = objPos.top - px;
//      break;
//    default:
//      size = 0;
//  }
//
//  if (size > 0) {
//    obj.css(dir, size);
//  }
//}
//
//function selectGridRowControls() {
//  'use strict';
//  var rowParams = getGridRow(_activeItem.uid);
//  rowParams.htmlObj.addClass('selectedGridRow');
//}
//function hideGridRowControls() {
//  'use strict';
//  var rowParams = getGridRow(_activeItem.uid);
//  rowParams.htmlObj.removeClass('selectedGridRow');
//}
//function getDataItem(item) {
//  'use strict';
//  var dataItem = $('#grid').data('kendoGrid').dataItem(item);
//  return dataItem;
//}
//
//function getGridRow(uid) {
//  'use strict';
//  var gridRow = $('#grid').data('kendoGrid')
//    .tbody
//    .find('tr[data-uid=' + uid + ']');
//
//  var rowInfo = {
//    id: uid,
//    height: $(gridRow).height(),
//    width: $(gridRow).width(),
//    left: $(gridRow).position().left,
//    top: $(gridRow).position().top,
//    columns: $(gridRow).children().length,
//    htmlObj: gridRow
//  };
//
//  return rowInfo;
//}
//
//
//function openDialog(type, opts) {
//  'use strict';
//  if (arguments[1]) {
//    setDialogOptions(opts.params);
//  }
//  if (type === 'preview') {
//    openFormPreview();
//  }
//
//  if (type === 'duplicate') {
//    openFormPreview();
//  }
//
//  if (type === 'delete') {
//    openFormPreview();
//  }
//
//  if (type === 'standardForm') {
//    openFormsWindow.data('kendoWindow').center().open();
//  }
//
//
//  var dialog = dialogWindow.data('kendoWindow');
//  if (opts.content !== 'undefined') {
//    dialog.content(opts.content);
//  }
//  dialog.center().open();
//
//}
//
//function openFormPreview() {
//  //console.log('preview');
//}
//
//function adjustDOMElements() {
//  'use strict';
//  $('#importButton span').removeClass('collapse');
//}
///*
// function initFormListDataSource() {
// var gridDataSource = new kendo.data.DataSource({
// transport: {
// read: {
// url: '/data/list-grid.json',
// dataType: 'json'
// }
// },
// schema: {
// model: {
// id: 'Id',
// fields: {
// Id: { editable: false, nullable: false },
// FormName: { editable: false, nullable: false },
// Description: { type: 'string' },
// Enabled: { type: 'boolean' },
// LastModifiedBy: { type: 'string' },
// LastModifiedDateTime: { type: 'string' }
// }
// },
// pageSize: 20,
// data: function (response) {
// return response;
// }
// }
// });
//
// gridDataSource.fetch(function () {
// console.log(gridDataSource.data());
// console.log(gridDataSource.view());
// });
// }*/
