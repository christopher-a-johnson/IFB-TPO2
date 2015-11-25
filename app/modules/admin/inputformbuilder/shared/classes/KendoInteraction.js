IFB_NAMESPACE.KendoInteraction = (function (Utility) {

  'use strict';

  var _activeGridRow = '', _formEnabled = false, dataItem, ttPosition, _currentPage, _currentPageConstant;
  var params = {},
    kendoInteraction = {},
    CONSTANTS = {
      imageBehaviorState: '#span-enable-image-control .km-switch-container',
      kmSwitch: ' .km-switch',
      kmSwitchContainer: ' .km-switch-container',
      kmSwitchHandle: ' .km-switch-handle',
      kmSwitchOn: 'km-switch-on',
      kmSwitchOff: 'km-switch-off',
      kmBlueBorder: 'switchBorderBlue',
      kmGreyBorder: 'switchBorderGrey',
      setSwitchEnabled: 'setSwitchEnabled',
      paragraphEditorClass: '.paragraphEditor',
      containerId: 'container_',
      contenteditable: 'contenteditable',
      paragraphDialogClass: '.paragraphDialog',
      btnHyperLinkInsert: '#btnHyperLinkInsert',
      btnHyperLinkCancel: '#btnHyperLinkCancel',
      textAlignClass: 'text-align',
      txtLinkUrl: '#txtLinkUrl',
      txtLinkText: '#txtLinkText',
      txtLinkId: '#txtLinkId',
      txtLinkTitle: '#txtLinkTitle',
      txtLinkClass: '#txtLinkClass',
      hyperLinkButton: '#hyperLinkButton',
      kJustifyRightClass: '.k-justifyRight',
      kJustifyLeft: '.k-justifyLeft',
      kJustifyCenter: '.k-justifyCenter'
    };

  kendoInteraction.init = function (obj) {
    $.each(obj, function (key, value) {
      params[key] = value;
    });
  };

  kendoInteraction.Grid = {
    //NGENY-753 set current page constant came from the controller
    setCurrentPage: function (page, pageNameConstant) {
      _currentPage = page;
      _currentPageConstant = pageNameConstant;
    },
    getSelectedRowData: function () {
      return _activeGridRow;
    },
    setSelectedRowData: function (data) {
      _activeGridRow = data;
      _formEnabled = data.Enabled;
    },
    getFormEnabled: function () {
      return _formEnabled;
    },
    getRowByDataItem: function (item) {
      dataItem = $(params.gridObj).data('kendoGrid').dataItem(item);
      return dataItem;
    },
    selectRow: function (data) {
      this.unselectRows();
      this.setSelectedRowData();
      $('[data-uid=' + data.uid + ']').addClass('k-state-selected');
    },
    unselectRows: function () {
      $('tr[data-uid]').removeClass('k-state-selected');
    },
    findRowElement: function (uid) {
      var gridRow = $(params.gridObj).data('kendoGrid')
        .tbody
        .find('tr[data-uid="' + uid + '"]');

      var rowInfo = {
        id: uid,
        height: $(gridRow).height(),
        width: $(gridRow).width(),
        left: $(gridRow).position().left,
        top: $(gridRow).position().top,
        columns: $(gridRow).children().length,
        htmlObj: gridRow
      };

      return rowInfo;
    },
    addRow: function () {
      $(params.gridObj).data('kendoGrid').addRow();
    },
    editRow: function () {
      $(params.gridObj).data('kendoGrid').editRow(this.getSelectedRowData());
    },
    deleteRow: function () {
      var v = this.findRowElement(this.getSelectedRowData().uid);
      $(params.gridObj).data('kendoGrid').removeRow(v.htmlObj);
    },
    modifyPagerLayout: function () {
      var pagerElem = $(params.gridObj).attr('id') + ' > .k-grid-pager';
      var pagerElements = $(pagerElem).children();

      $(pagerElem).prepend(pagerElements[4]).prepend(pagerElements[5]);
      $(pagerElements[2]).remove();
      $(pagerElements[0]).insertAfter(pagerElements[3]);
      $(pagerElements[1]).insertAfter(pagerElements[3]);
    },

    columnResize: function (e) {
      var resizedField = e.column.field;
      var colGroups = $(params.gridObj + ' colgroup');
      var gridColumns = $(params.gridObj).data('kendoGrid').columns;
      var columnArray = getFrozenColumns(gridColumns);
      $.each(colGroups, function (cgKey, cgValue) {
        //var childIndex = 0;
        var childKey = 0;
        var childItem = '';
        $.each(columnArray, function (cKey, cValue) {
          if (cValue.column === resizedField) {
            childKey = cValue.index + 1;
          }
        });
        if (childKey > 0) {
          childItem = ':nth-child(' + childKey + ')';
          $(cgValue).find(childItem).css('width', e.oldWidth);
        }
      });
    },

    editGridRow: function (e) {
      $('.k-grid-update').text('Save').css('float', 'right');
      $('.k-grid-cancel').text('Cancel');
      if (_currentPage === _currentPageConstant.FORM_LIST_PAGE) {
        if (e.model.isNew()) {
          $('.k-window-title').text('Duplicate');
          e.model.set('Name', _activeGridRow.Name + '_copy');
          e.model.set('Description', _activeGridRow.Description);
          e.model.set('Enabled', false);
          e.model.set('OldFormName', _activeGridRow.Name);
          //TODO : Delete the following two rows after server call is in place as these values supposed to come from server
          e.model.set('ModifiedBy', _activeGridRow.ModifiedBy);
          e.model.set('ModifiedDate', _activeGridRow.ModifiedDate);
        } else {
          $('.k-window-title').text('Quick Edit');
          e.model.set('Enabled', (_activeGridRow.Enabled !== 0));
        }
      }
      //NGENY-753- Setting the filed values for Styles duplicate popup
      else if (_currentPage === _currentPageConstant.STYLES_PAGE || _currentPage === _currentPageConstant.EDIT_STYLES_PAGE) {
        if (e.model.isNew()) {
          $('.k-window-title').text('Duplicate');
          e.model.set('Title', _activeGridRow.Title + '_copy');
          e.model.set('Description', _activeGridRow.Description);
          e.model.set('Enabled', false);
          e.model.set('OldStyleName', _activeGridRow.Title);
          //TODO : Delete the following two rows after server call is in place as these values supposed to come from server
          e.model.set('FileSize', _activeGridRow.FileSize);
          e.model.set('LastModifiedBy', _activeGridRow.LastModifiedBy);
          e.model.set('LastModifiedDateTime', _activeGridRow.LastModifiedDateTime);
        } else {
          $('.k-window-title').text('Quick Edit');
          e.model.set('Enabled', (_activeGridRow.Enabled !== 0));
        }
      }
    }
  };

  kendoInteraction.Tooltip = {
    adjustPosition: function (ttObj, dir, px) {
      var ttId = '#' + ttObj.popup.element[0].id;
      var ttWrapper = $(ttId).parent();

      ttPosition = Utility.Position;
      ttPosition.adjustObject(ttWrapper, dir, px);
    }
  };

  function getFrozenColumns(cols) {
    var columnArray = [];
    $.each(cols, function (key, value) {
      if (value.freeze === true) {
        columnArray.push({'index': key, 'column': value.field});
      }
    });
    return columnArray;
  }

  // Enable/disable kendo switch used in NGENY-3555 & on form control (layout.metadata.js)
  kendoInteraction.applyBorderKendoSwitch = function (containerId) {
    if ($(containerId + CONSTANTS.kmSwitch).hasClass(CONSTANTS.kmSwitchOn)) {
      $(containerId + CONSTANTS.kmSwitchContainer).removeClass(CONSTANTS.kmGreyBorder).addClass(CONSTANTS.kmBlueBorder);
      if ($(containerId + CONSTANTS.kmSwitchHandle).hasClass(CONSTANTS.setSwitchEnabled)) {
        $(containerId + CONSTANTS.kmSwitchContainer).removeClass(CONSTANTS.setSwitchEnabled);
      }
    } else {
      $(containerId + CONSTANTS.kmSwitchContainer).removeClass(CONSTANTS.kmBlueBorder).addClass(CONSTANTS.kmGreyBorder);
    }
  };

  kendoInteraction.enableDisableSwitch = function (controlElem, state) {
    // Set Enable/Disabled mode for controls
    $(controlElem).kendoMobileSwitch({
      onLabel: '<div class="on-label-with-tick"></div>',
      offLabel: 'X',
      checked: state
    });
    // If enabled mode: apply blue border
    if (state) {
      $(CONSTANTS.imageBehaviorState).addClass(CONSTANTS.kmBlueBorder);
    }
  };

  kendoInteraction.setValueToSwitch = function (id, val) {
    setTimeout(function () {
      $(id).data('kendoMobileSwitch').check(val);
      kendoInteraction.applyBorderKendoSwitch(id);
    }, 100);
  };

  kendoInteraction.setValueToDropDown = function (ctrlId, textValue) {
    setTimeout(function () {
      var dropdownlist = $(ctrlId).data('kendoDropDownList');
      dropdownlist.value(textValue);
    }, 100);
  };
  kendoInteraction.getValueFromDropDown = function (ctrlId) {
    var dropdownlist = $(ctrlId).data('kendoDropDownList');
    return dropdownlist.text();
  };

  kendoInteraction.initDropDown = function (controlId, data) {
    $(controlId).kendoDropDownList({
      dataTextField: 'text',
      dataValueField: 'value',
      dataSource: data,
      index: 0
    });
  };

  kendoInteraction.getDropDownList = function (controlId) {
    return $(controlId).data('kendoDropDownList');
  };

  kendoInteraction.filterGrid = function (grid, logic, filters) {
    $(grid).data('kendoGrid').dataSource.filter({
      logic: logic,
      filters: filters
    });
  };

  kendoInteraction.createTabStrip = function (tabDivs) {
    return $(tabDivs).kendoTabStrip().data('kendoTabStrip');
  };

  kendoInteraction.createGrid = function (gridId) {
    return $(gridId).data('kendoGrid');
  };

  kendoInteraction.setGrid = function (grid, dataSourceUri, isScrollable, isPageable, columnsData, isSortable, isSelectable) {
    var stylesDataSource = new kendo.data.DataSource({
      transport: {
        read: dataSourceUri,
        type: 'Json'
      },
      scrollable: isScrollable
    });
    $(grid).kendoGrid({
      dataSource: stylesDataSource,
      pageable: isPageable,
      columns: columnsData,
      scrollable: isScrollable,
      sortable: isSortable,
      selectable: isSelectable,
      height: 315
    });
  };

  function openHyperlinkWindow() {
    setTimeout(function () {
      $(CONSTANTS.paragraphDialogClass).kendoWindow({
        visible: false,
        title: 'Insert Hyper Link',
        modal: true,
        width: '435',
        height: '400',
        content: {
          template: hyperLinkTemplate()
        }
      });
      var dialogBox = $(CONSTANTS.paragraphDialogClass).data('kendoWindow');
      dialogBox.open().center();
      getSelectedNodeInfo();
      $(CONSTANTS.btnHyperLinkInsert).click(insertHyperLink);
      $(CONSTANTS.btnHyperLinkCancel).click(function () {
        $(CONSTANTS.paragraphDialogClass).kendoWindow('close');
      });
    }, 100);
  }

  kendoInteraction.assignKendoEditor = function () {
    $(CONSTANTS.paragraphEditorClass).kendoEditor({
      tools: [
        {
          name: 'custom',
          template: '<li class="k-tool-group k-button-group" >' +
          '<span id="hyperLinkButton" unselectable="on" class="k-tool-icon k-createLink"></span>' +
          '<span class="k-tool-text">Create Link</span></li>'
        },
        'justifyLeft',
        'justifyCenter',
        'justifyRight'
      ]
    });

    $(CONSTANTS.hyperLinkButton).bind('click', openHyperlinkWindow);
    $(CONSTANTS.kJustifyRightClass).click(function () {
      $(CONSTANTS.paragraphEditorClass).css(CONSTANTS.textAlignClass, 'right');
    });
    $(CONSTANTS.kJustifyLeft).click(function () {
      $(CONSTANTS.paragraphEditorClass).css(CONSTANTS.textAlignClass, 'left');
    });
    $(CONSTANTS.kJustifyCenter).click(function () {
      $(CONSTANTS.paragraphEditorClass).css(CONSTANTS.textAlignClass, 'center');
    });
  };

  function hyperLinkTemplate() {
    return kendo.template(
      '<div class="k-editor-dialog k-popup-edit-form k-edit-form-container k-window-content k-content" ' +
      'data-role="window" tabindex="0"><div class="k-edit-label"><label >Web address</label></div>    ' +
      '<div class="k-edit-field"><input type="text" class="k-input k-textbox" id="txtLinkUrl" value="http://"></div>' +
      '<div class="k-edit-label k-editor-link-text-row"><label>Text</label></div>' +
      '<div class="k-edit-field k-editor-link-text-row"><input type="text" class="k-input k-textbox"' +
      ' id="txtLinkText"></div> <div class="k-edit-label"><label>ToolTip</label></div> <div class="k-edit-field">' +
      '<input type="text" class="k-input k-textbox" id="txtLinkTitle"></div><div class="k-edit-label"><label>Id' +
      '</label></div><div class="k-edit-field"><input type="text" class="k-input k-textbox" id="txtLinkId"></div>' +
      '<div class="k-edit-label"><label>Class</label></div>  <div class="k-edit-field"><input type="text" ' +
      'class="k-input k-textbox" id="txtLinkClass"></div> <div class="k-edit-label"></div> <div class="k-edit-field">' +
      '<input type="checkbox"  id="txtLinkTarget"><label>Open link in new window</label></div>  ' +
      '<div class="k-edit-buttons k-state-default"> <button class="k-dialog-insert k-button k-primary"' +
      ' id="btnHyperLinkInsert">Insert</button>' + '<button class="k-dialog-close k-button" id="btnHyperLinkCancel">' +
      'Cancel</button>      </div>      </div>');
  }

  function getSelectedNodeInfo() {
    var nodeText;
    if (window.getSelection) {
      var selection = window.getSelection();
      nodeText = selection;
      if (selection.anchorNode.nodeType !== null && selection.anchorNode.nodeType === 3) {
        var range = selection.getRangeAt(0);
        var selectedNodeParent = range.commonAncestorContainer.parentNode;
        if (selectedNodeParent.nodeName === 'A') {             // selected text's parent node is 'A'
          assignNodeInfo(selectedNodeParent, nodeText);
        } else {                                               // selected text's parent node is plain text
          $(CONSTANTS.txtLinkText).val(selection);
        }
      }
    }
  }

  function assignNodeInfo(selectedNode, nodeText) {
    $(CONSTANTS.txtLinkUrl).val(selectedNode.href);
    $(CONSTANTS.txtLinkText).val(nodeText);
    $(CONSTANTS.txtLinkId).val(selectedNode.id);
    $(CONSTANTS.txtLinkTitle).val(selectedNode.title);
    $(CONSTANTS.txtLinkClass).val(selectedNode.className);
  }

  function insertHyperLink() {
    var editor = $(CONSTANTS.paragraphEditorClass).data('kendoEditor');
    var hrefText = $(CONSTANTS.txtLinkUrl).val();
    var hyperLinkText = $(CONSTANTS.txtLinkText).val();
    var hyperLinkId = $(CONSTANTS.txtLinkId).val();
    var hyperLinkToolTip = $(CONSTANTS.txtLinkTitle).val();
    var hyperLinkClass = $(CONSTANTS.txtLinkClass).val();
    if (!(hrefText === 'http://' || hyperLinkText === '')) {
      editor.exec('inserthtml', {
        value: '<a href =' + hrefText + ' id=' + hyperLinkId + ' title=' + hyperLinkToolTip + ' ' +
        'class=' + hyperLinkClass + '  > ' + hyperLinkText + '</a>'
      });
      $(CONSTANTS.paragraphDialogClass).kendoWindow('close');
    }
  }

  kendoInteraction.resetKendoSwitch = function (ctrlId, containerId) {
    $(ctrlId).attr('value', false);
    $(containerId + ' ' + CONSTANTS.kmSwitchContainer).removeClass(CONSTANTS.kmBlueBorder)
      .addClass(CONSTANTS.kmGreyBorder);
    $(containerId + ' ' + CONSTANTS.kmSwitch).removeClass(CONSTANTS.kmSwitchOn).addClass(CONSTANTS.kmSwitchOff);
    $(containerId + ' ' + CONSTANTS.kmSwitchHandle).attr('style', 'transform : translateX(0px) translateY(0px)');
  };

  return kendoInteraction;
}(IFB_NAMESPACE.KendoInteraction || {}));
