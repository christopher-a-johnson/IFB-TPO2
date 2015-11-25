elli.builder.layoutgrid = (function () {
  'use strict';

  var dragGridPx = 4, layoutWorkspaceGrid, builder = elli.builder;
  var controlData, resizeMinX, resizeMinY;

  var utility = builder.utility,
    history = builder.history,
    workspace = builder.workspace,
    workspacePanels = builder.workspacePanels,
    constant = builder.constant,
    control = builder.control,
    GRID_CONSTANTS = constant.gridConstant,
    WORKSPACE_CONSTANTS = constant.workSpaceConstant,
    controlConstant = constant.controlConstant;

  /* Gridster plugin Initialization with 'gridSpacing' and 'formWidth' */
  function createGrid(gridspacing, width) {
    var panelHeight = window.WIZARD_CONST.panelHeight, panelWidth;
    var actualFormWidth = $(GRID_CONSTANTS.formBuilderForm).width();
    /* below formula is to calculate grid panel width */
    panelWidth = width || ($(GRID_CONSTANTS.workspace).width() / window.WIZARD_CONST.maxColumns) - (gridspacing * 2);

    layoutWorkspaceGrid = $(GRID_CONSTANTS.gridContainerUL).gridster({
      widget_margins: [gridspacing, gridspacing],
      widget_base_dimensions: [panelWidth, panelHeight],
      max_cols: window.WIZARD_CONST.maxGridsterCol,
      avoid_overlapped_widgets: true,
      draggable: {
        handle: GRID_CONSTANTS.handleButton,
        stop: function () {
          workspacePanels.updateFormPanelsSchema();
        }
      },
      resize: {
        enabled: true,
        axes: ['both'],
        start: function (event, ui, $widget) {
          onGridPanelResizeStart(event, ui, $widget, this, panelWidth, panelHeight);
        },
        stop: function (event, ui, $widget) {
          onGridPanelResizeStop(event, ui, $widget, this);
          workspacePanels.updateFormPanelsSchema();
        },
        resize: function () {
          setFormBuilderFormWidth(actualFormWidth);
        }
      }
    }).data('gridster');
    setFormBuilderFormWidth(actualFormWidth);
    control.createSelectable($(GRID_CONSTANTS.gridListContainer), constant.controlTypes.gridPanel,
      GRID_CONSTANTS.filter);
  }

  function onGridPanelResizeStart(event, ui, $widget, gridsterRef, panelWidth, panelHeight) {
    var gridPanelId = $widget.attr('id');

    var activeColumns = $widget.attr('data-sizex');
    var activeRows = $widget.attr('data-sizey');
    panelWidth = $widget.width();
    panelHeight = $widget.height();
    var columnWidth = panelWidth / activeColumns;
    var rowWidth = panelHeight / activeRows;

    controlData = workspace.getControlsFromGridPanel(gridPanelId);
    if (controlData) {
      var boundaryObj = workspace.getNearestControlPositions(controlData);
      resizeMinX = gridsterRef.resize_min_size_x;
      resizeMinY = gridsterRef.resize_min_size_y;
      var nearestXaxisControlPosition = boundaryObj.minX;
      var nearestYaxisControlPosition = boundaryObj.minY;
      var nearestXaxisMinimizeLimit = (nearestXaxisControlPosition) / columnWidth;
      var nearestYaxisMinimizeLimit = (nearestYaxisControlPosition) / rowWidth;
      gridsterRef.resize_min_size_x = Math.ceil(nearestXaxisMinimizeLimit);
      gridsterRef.resize_min_size_y = Math.ceil(nearestYaxisMinimizeLimit);
    }
  }

  function onGridPanelResizeStop(event, ui, $widget, gridsterRef) {
    if (controlData) {
      gridsterRef.resize_min_size_x = resizeMinX;
      gridsterRef.resize_min_size_y = resizeMinY;
    }
  }

  function setFormBuilderFormWidth(width) {
    $(GRID_CONSTANTS.formBuilderForm).width(width);
  }

  function changeGridPanelResizableStatus(status) {
    if (status) {
      layoutWorkspaceGrid.enable();
      layoutWorkspaceGrid.enable_resize();

    } else {
      layoutWorkspaceGrid.disable();
      layoutWorkspaceGrid.disable_resize();
    }
  }

  function changeSelectableStatus(status) {
    $(GRID_CONSTANTS.gridListContainer).selectable('option', 'disabled', !status);
  }

  function scrollDown() {
    $(document).scrollTop($(document).height());
  }

  function initAddGridPanelManually() {

    $(GRID_CONSTANTS.addLayoutPanel).draggable({
      drag: function () {
        var n = $(GRID_CONSTANTS.gridListContainerLi).size();
        if (n <= 0) {
          return false;
        }
      }
    });
    $(WORKSPACE_CONSTANTS.builderWorkspace).droppable({
      accept: GRID_CONSTANTS.addLayoutPanel,
      drop: function () {
        addGridPanel();
      }
    });

    $(GRID_CONSTANTS.addLayoutPanel).on('click', function () {
      var n = $(GRID_CONSTANTS.gridListContainerLi).size();
      if (n <= 0) {
        return false;
      }
      addGridPanel();
      if ($(GRID_CONSTANTS.gridListContainerLi).last().attr('data-col') === '1') {
        scrollDown();
      }
    });
  }

  $(GRID_CONSTANTS.addLayoutPanel).mouseenter(function () {
    var n = $(GRID_CONSTANTS.gridListContainerLi).size();
    if (n <= 0) {
      $(GRID_CONSTANTS.addLayoutPanel).css('cursor', 'all-scroll');
      return false;
    }
    else {
      $(GRID_CONSTANTS.addLayoutPanel).css('cursor', 'pointer');
      return true;
    }
  });

  function getNextGridRow() {
    var rows = $(GRID_CONSTANTS.gridListContainerLi);
    return rows.length + 1;
  }

  function getItemFromWorkspace(rowSpan, panelItem, colSpan, panelHTML, col, newRow) {
    var item;
    item = rowSpan || panelItem || colSpan
      ? layoutWorkspaceGrid.add_widget(panelHTML, rowSpan, parseInt(colSpan, 10), col, newRow)
      : layoutWorkspaceGrid.add_widget(panelHTML, 1, 1);
    return item;
  }

  function addGridPanel(rowSpan, colSpan, col, row, panelItem) {
    var guid = panelItem ? panelItem.id : utility.generateGUID();
    var newRow = row ? getNextGridRow(row) : undefined;
    var panelHTML;
    var tmpl = kendo.template($(GRID_CONSTANTS.scriptTemplateGridPanel).html());
    if (panelItem) {
      //Opening an existing form contains id for panel item. so need to remove 'grid-panel' string from
      //form id as kendo will also append this string while regenerating the panels.
      guid = panelItem.id.replace('grid-panel_', '');
      panelHTML = tmpl({guid: guid});
    }
    else {
      panelHTML = tmpl({guid: guid});
    }

    var item = getItemFromWorkspace(rowSpan, panelItem, colSpan, panelHTML, col, newRow);
    item.css('position', 'absolute');                   //Manually adjust the position of the grid panel so the margins and resize handle operate correctly

    addGridPanelBindings(item);

    /* increment grid panel counter in workspace */
    workspace.addPanel();
  }

  function addGridPanelBindings(panel) {
    var panelControlContainer = $(panel).children(GRID_CONSTANTS.fieldContainer),
      panelControl = $(panelControlContainer).parent(),
      panelHeader = $(panelControlContainer).prev();

    $(panelControlContainer).css('position', 'relative');
    $(panelControlContainer).outerHeight(panelControl.outerHeight(true) - panelHeader.outerHeight(true));

    var controlElem = {
      container: panelControlContainer,
      changeDroppableStatus: true
    };
    setEventsToControl(controlElem);
  }

  function setEventsToControl(ctrl, isHiddenWorkspaceCall) {
    var dropXPos = 0, dropYPos = 0;
    $(ctrl.container).mousemove(function (e) {
      var parentOffset = isHiddenWorkspaceCall ? $(this).offset() : $(this).parent().offset();
      var coords = calculateDropPosition(e, parentOffset);
      dropXPos = coords.xPos;
      dropYPos = coords.yPos;
    });
    control.createDroppable(ctrl, isHiddenWorkspaceCall, dropXPos, dropYPos);

  }

  function adjustCtrlSpanHover(ctrlElem, controlsAttr, dropXPos, dropYPos, width, height) {
    if (dropXPos + controlsAttr.cWidth > controlsAttr.pWidth || width < 0) {
      $('#' + ctrlElem[0].id).css('left', (dropXPos - ((dropXPos + controlsAttr.cWidth) - controlsAttr.pWidth)));
    }
    if (dropYPos + controlsAttr.cHeight > controlsAttr.pHeight || height < 0) {
      $('#' + ctrlElem[0].id).css('top', (dropYPos - ((dropYPos + controlsAttr.cHeight) - controlsAttr.pHeight)));
    }
  }

  function isControlFit(elem, target, ctrl, isNewCtrl) {
    var controlWidth, controlHeight;
    if (isNewCtrl) {
      var uiTestControls = document.createElement('DIV');
      $(uiTestControls).attr('id', 'testing-container');
      $(uiTestControls).append(elem);
      $('body').append(uiTestControls);
      var controlId = $(GRID_CONSTANTS.testingContainer).children().attr('id');
      controlWidth = $('#' + controlId).width();
      controlHeight = $('#' + controlId).height();

      $(GRID_CONSTANTS.testingContainer).detach();
    }
    else {
      controlWidth = ctrl.width();
      controlHeight = ctrl.height();
    }

    var parentWidth = $('#' + target.id).width();
    var parentHeight = $('#' + target.id).height();
    var controlsAttr = {
      cWidth: controlWidth,
      cHeight: controlHeight,
      pWidth: parentWidth,
      pHeight: parentHeight,
      test: true
    };
    if (controlWidth >= parentWidth - 5 || controlHeight >= parentHeight - 5) {
      controlsAttr.test = false;
    }
    return controlsAttr;
  }

  function calculateDropPosition(mouse, offset) {
    var coords = {},
      xPos = (mouse.pageX - offset.left),
      yPos = (mouse.pageY - offset.top);

    if (xPos % dragGridPx !== 0) {
      xPos = Math.floor(xPos / dragGridPx) * dragGridPx;
    }
    if (yPos % dragGridPx !== 0) {
      yPos = Math.floor(yPos / dragGridPx) * dragGridPx;
    }

    coords.xPos = xPos;
    coords.yPos = yPos;

    return coords;
  }

  function addGridPanelControl(dragCtrl, parentElem, xPos, yPos, ctrlType, ctrlId) {

    var controlObj, panelControl;
    if (!ctrlId) {
      ctrlType = dragCtrl.attr('controlType');
      ctrlId = workspace.addControl(ctrlType);
    }
    else {
      if (!dragCtrl) {
        ctrlId = workspace.addControl(ctrlType, ctrlId);
      }
    }
    controlObj = workspace.getControlById(ctrlId);
    panelControl = controlObj.element;
    //added a class to controls that are added to workspace for identification
    panelControl.css('position', 'absolute').css('left', xPos).css('top', yPos).addClass(controlConstant.newControl);
    panelControl = control.createResizable(panelControl, GRID_CONSTANTS.attrContainment);
    if (panelControl.hasClass(GRID_CONSTANTS.parentControl)) {
      var controlElem = {
        container: panelControl,
        changeDroppableStatus: false,
        isGreedy: true,
        activeClass: GRID_CONSTANTS.uiStateHover
      };
      setEventsToControl(controlElem);
      //panelControl = control.createDraggable(panelControl);
    }
    panelControl = control.createDraggable(panelControl);
    control.createSelectable($(WORKSPACE_CONSTANTS.hiddenWorkspace), ctrlType, GRID_CONSTANTS.filter);
    $(panelControl).click(function (event) {
      event.stopPropagation();
    });
    return panelControl;
  }

  function elementEventHistory(elem, data, event, action) {
    captureElementEvent(elem, event, data);

    if (event === 'stop') {
      var histParams = getElementEvent(elem, action);
      history.addHistory(histParams);
      resetElementEvent();
    }
  }

  var elemEvent = {};

  function captureElementEvent(elem, event, data) {
    elemEvent[event] = data;
  }

  function resetElementEvent() {
    elemEvent = {};
  }

  function getElementEvent(elem, action) {
    var event = {
      action: action + ': ' + $(elem).attr('id'),
      elems: {
        element: $(elem)
      }
    };

    $(elemEvent).each(function (key, value) {
      event.elems[key] = value;
    });

    return event;
  }

  //This function changes droppable status for all the grid panels
  function changeDroppableStatus(status) {
    var panels = $('div[id^="grid-panel-container_"]');
    panels.each(function () {
      $(this).droppable('option', 'disabled', status);
    });
  }

  //This Function enables hidden workspace to be droppable
  function enableHiddenWorkspace() {
    var control = {
      container: $(WORKSPACE_CONSTANTS.hiddenWorkspaceId),
      changeDroppableStatus: true,
      isGreedy: true,
      activeClass: GRID_CONSTANTS.uiStateHover,
      containment: $(WORKSPACE_CONSTANTS.hiddenWorkspaceId)
    };
    setEventsToControl(control, true);
  }

  return {
    init: function () {
      initAddGridPanelManually();
    },
    elementEventHistory: function (elem, data, event, action) {
      elementEventHistory(elem, data, event, action);
    },
    /* below function contains the logic for grid panel generation in workspace container.
     This function gets called when user click on Build button in layout Selector */
    createGridPanels: function (gridspacing, fromJSON, formWidth, panelData) {
      var c, i, r;
      /* below function call initialize the GridSter with 'gridSpacing' & and 'formwidth' */
      createGrid(gridspacing, formWidth);
      var layoutParams = window.wizardLayoutParams;
      if (!fromJSON) {
        var col = 1;
        layoutParams.cols = $(constant.gridConstant.panelCol).text();
        layoutParams.rows = $(constant.gridConstant.panelRow).text();
        var newColSpan = Math.round(Math.floor(window.WIZARD_CONST.maxColumns / layoutParams.cols));
        layoutParams.colSpan = newColSpan < 1 ? 1 : newColSpan;

        for (c = 1; c <= layoutParams.cols; c++) {
          for (r = 1; r <= layoutParams.rows; r++) {
            addGridPanel(layoutParams.colSpan, layoutParams.rowSpan, col, r);
            col += layoutParams.colSpan;
          }
        }
      } else {
        for (i = 0; i < panelData.length; i++) {
          addGridPanel(panelData[i].colspan, panelData[i].rowspan, panelData[i].col, panelData[i].row, panelData[i]);
        }
      }

      //Enable Hidden workspace to be droppable when any grid panel is added
      if (layoutParams.cols > 0 && layoutParams.rows > 0) {
        enableHiddenWorkspace();
        //enable move/resize mode after layout selection
        workspace.enableMode(constant.workSpaceConstant.moveMode);
      }
    },

    removeGridPanel: function (guid) {
      var panel = $(GRID_CONSTANTS.gridPanel + '_' + guid);
      layoutWorkspaceGrid.remove_widget(panel);

      /* decrement grid panel counter in workspace */
      workspace.removePanel();
    },

    addControlsOnGridPanel: function (control, parentElem, xPos, yPos, ctrlType, ctrlId) {
      return addGridPanelControl(control, parentElem, xPos, yPos, ctrlType, ctrlId);
    },
    isControlFit: function (elem, target, ctrl, isNewCtrl) {
      return isControlFit(elem, target, ctrl, isNewCtrl);
    },
    adjustCtrlSpanHover: function (ctrlElem, controlsAttr, dropXPos, dropYPos, width, height) {
      return adjustCtrlSpanHover(ctrlElem, controlsAttr, dropXPos, dropYPos, width, height);
    },
    changeSelectableStatus: function (status) {
      return changeSelectableStatus(status);
    },
    inactiveGridPanel: function () {
      $(GRID_CONSTANTS.ulGridListContainerLI).removeClass('active');
    },
    changeDroppableStatus: function (status) {
      changeDroppableStatus(status);
    },
    changeGridPanelResizableStatus: function (status) {
      changeGridPanelResizableStatus(status);
    }
  };

}());
elli.builder.layoutgrid.init();
