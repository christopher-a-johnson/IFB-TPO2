/**
 * Creates a new Control.
 * @class
 * @param {jQuery} $ - jQuery Object.
 *
 */

elli.builder.control = (function ($, kendo) {
  'use strict';

  var builder = elli.builder,
    history = builder.history,
    utility = builder.utility,
    constant = builder.constant,
    controlConstant = constant.controlConstant,
    controlTypes = constant.controlTypes,
    workSpaceConstant = constant.workSpaceConstant,
    formSchemaConstant = constant.formSchema,
    gridConstant = constant.gridConstant,
    ctrlZindex = 1000,
    gridSelectedCountLimit = 1,
    ctrlId, ctrlType;

  var interaction = window.IFB_NAMESPACE.KendoInteraction;

  //TEMPLATES
  function getControl(ctrlType) {
    var templateType = 'single',
      tmpl,
      ctrl = {},
      bindings = ['select', 'drag'];

    switch (ctrlType) {
      case 'Panel':
        templateType = 'panel';
        bindings.push('drop');
        bindings.push('resize');
        break;
      case 'GroupBox':
        templateType = 'panelbox';
        bindings.push('drop');
        bindings.push('resize');
        break;
      case 'Paragraph':
        templateType = 'paragraph';
        bindings.push('editor');
        break;
      case 'Image':
      case 'Borrower':
      case 'Button':
      case 'Contact':
      case 'Rolodex':
      case 'Zipcode':
        break;
      default:
        templateType = 'single';
        break;
      case 'MultilineTextBox':
      case 'TextBox':
        templateType = 'combined';
        break;
      case 'Dropdown':
      case 'Calendar':
      case 'FieldLock':
        templateType = 'advanced';
        break;
      case 'RadioButton':
      case 'Checkbox':
        templateType = 'list';
        bindings.push('sort');
        break;
      case 'ImageButton'  :
        templateType = 'single';
        break;
      case 'Container':
        templateType = 'panel';
        break;
    }

    tmpl = $('#controlTemplate_' + templateType);

    ctrl.template = kendo.template(tmpl.html());
    ctrl.bindings = bindings;

    return ctrl;
  }

  function createElement(elemParams, ctrlParams) {
    var scriptTemplate = ctrlParams.template,
      elem = scriptTemplate(elemParams),
      bind = ctrlParams.bindings;

    elem = $.trim(elem);
    $(elem).attr('data-cid', elemParams.cid);
    elem = assignZindex(elem);

    if ($.inArray(bind, 'select') > -1) {
      createSelectable(elem);
    }
    if ($.inArray(bind, 'drag') > -1) {
      createDraggable(elem);
    }
    if ($.inArray(bind, 'drop') > -1) {
      createDroppable(elem);
    }
    if ($.inArray(bind, 'resize') > -1) {
      createResizable(elem);
    }
    if ($.inArray(bind, 'sort') > -1) {
      createSortable(elem);
    }
    if ($.inArray(bind, 'editor') > -1) {
      createEditor(elem);
    }

    return elem;
  }

  function createControl(id, type) {
    var elem = {},
      ctrlParams = getControl(type);

    elem.controlId = id;
    elem.controlType = type;
    elem.cid = utility.generateGUID();
    elem.element = $(createElement(elem, ctrlParams));

    elem.properties = ctrlParams.properties;

    return elem;
  }

  function assignZindex(elem) {
    $(elem).css('z-index', ctrlZindex);
    ctrlZindex++;
    return elem;
  }

  function addHistory(elem, action, id) {
    var params = {
      elems: elem,
      action: action + ': ' + id
    };
    history.addHistory(params);
  }

  function checkGridContainerClicked(selectedId) {
    return (selectedId.indexOf(gridConstant.gridPanelContainer) === -1) &&
      (selectedId.indexOf(gridConstant.gridPanelHeader) === -1);
  }

  function isControlInContainer(selectedId, selectedControl) {
    var isInContainer = $('#' + selectedControl).closest('div.parentControl').length > 0;
    return isInContainer;
  }

  //BINDINGS
  function createSelectable(ctrl, controlType, filter) {
    var selectRange = false, deselectQueue = [], selectQueue = [],
      propertyPanel = builder.propertyPanel,
      layerPanel = builder.layerPanel,
      isGridPanelSelectedManually = false,
      selectedId = null;
    var selectedControl;
    ctrl.selectable({
        filter: filter,
        selected: function (event, ui) {
          if (selectedId) {
            var GridContainerHasNotClicked = checkGridContainerClicked(selectedId);
            var isCtrlInHiddenWorkspace = ($('#' + selectedControl).parent(workSpaceConstant.hiddenWorkspaceId).length > 0);
            // Parent(grid Panel) has got selected without manually selecting it, so need to deselect it explicitly
            if (selectedControl !== null && GridContainerHasNotClicked && !isGridPanelSelectedManually && !isCtrlInHiddenWorkspace) {
              deselectQueue.push(ui.selecting);
              $('#' + selectedControl).removeClass(controlConstant.classUiSelected);
              selectedControl = null;
            }
            else {
              isGridPanelSelectedManually = true;
            }

            var isInContainer = isControlInContainer(selectedId, selectedControl);
            if (isCtrlInHiddenWorkspace && isInContainer) {
              deselectQueue.push(ui.selecting);
              $('#' + selectedControl).removeClass(controlConstant.classUiSelected);
              selectedControl = null;
            }
          }
        },
        selecting: function (event, ui) {
          if (event.originalEvent.originalEvent.detail === 0) {
            selectRange = true;
            return true;
          }

          var eventOriginator = $(event.originalEvent.target);
          var eventOriginatorControl = $(event.originalEvent.target).attr('id');
          var eventOriginatorControlType = $(event.originalEvent.target).attr('controlType') ||
            eventOriginator.parent().attr('controlType');
          var isChildControl = $.inArray(eventOriginatorControlType, controlConstant.resizableControls) > -1;
          if (eventOriginatorControl && eventOriginatorControl !== $(ui.selecting).attr('id')) {
            if (eventOriginatorControl) {
              if (eventOriginatorControl.indexOf('_') > -1 && isChildControl) {
                selectedId = eventOriginator.parent().attr('id');
                selectedId = '#' + selectedId;
              }
              else { // control is simple like button, imageButton
                selectedId = eventOriginatorControl;
                if ($.inArray(selectedId.replace(new RegExp('[0-9]', 'g'), ''), controlConstant.resizableControls) > -1) {
                  selectedId = controlConstant.container + selectedId;
                }
                else {
                  selectedId = '#' + selectedId;
                }
              }
            }
            var gridContainerHasClickedExplicitly = selectedId.indexOf(gridConstant.gridPanelContainer) > -1 ||
              selectedId.indexOf(gridConstant.gridPanelHeader) > -1;

            var controlToSelect = gridContainerHasClickedExplicitly ? ui.selecting :
              ($(ui.selecting).find(workSpaceConstant.newControl).filter(selectedId).length === 0 ?
                $(ui.selecting).find(workSpaceConstant.newControl).filter('#' + $(selectedId).closest('div').attr('id')) :
                $(ui.selecting).find(workSpaceConstant.newControl).filter(selectedId));
            if (controlToSelect.length === 0) {
              controlToSelect = ui.selecting;
            }
            ctrlId = $(controlToSelect).attr('id');
            ctrlType = $(controlToSelect).attr('controlType') || constant.controlTypes.gridPanel;

            if (!($(ui.selecting).hasClass(controlConstant.classUiSelected))) {
              selectedControl = $(ui.selecting).attr('id');
            }

            if ($(controlToSelect).hasClass(controlConstant.classUiSelected)) {
              // Grid Panel is explicitly getting deselected
              if (selectedId.indexOf(gridConstant.gridPanelContainer) > -1) {
                isGridPanelSelectedManually = false;
              }
              deselectQueue.push(controlToSelect);
              $(controlToSelect).removeClass(controlConstant.classUiSelecting)
                .removeClass(controlConstant.classUiSelected);
            } else {
              selectQueue.push((controlToSelect));
              $(controlToSelect).addClass(controlConstant.classUiSelected);
            }
          }
          else {
            var queue = $(ui.selecting).hasClass(controlConstant.classUiSelected) ? deselectQueue : selectQueue;
            queue.push(ui.selecting);
            ctrlType = ui.selecting.getAttribute('controlType');
            ctrlId = ui.selecting.getAttribute('id');
          }

        },
        unselecting: function (event, ui) {
          $(ui.unselecting).addClass(controlConstant.classUiSelected);
        },
        stop: function () {
          if ($(workSpaceConstant.modePropertyClass).hasClass('active')) {
            if (selectQueue.length > 0 || deselectQueue.length > 0) {
              if (!selectRange) {
                $.each(deselectQueue, function (indx, value) {
                  $(value)
                    .removeClass(controlConstant.classUiSelecting)
                    .removeClass(controlConstant.classUiSelected);
                  selectQueue = $.grep(selectQueue, function (currentVal) {
                    return currentVal !== value;
                  });
                });
              }
            }
            selectRange = false;
            deselectQueue = [];
            // If any items are selected then open Property panel
            var expandPanel = false;
            if (selectQueue.length > 0) {
              if ($('#' + ctrlId).hasClass(controlConstant.classUiSelected)) {
                var controlId = utility.removePrefix('container_', ctrlId);
                builder.propertyPanel.loadPropertyPanel(ctrlType, controlId);
              } else {
                propertyPanel.closePropertyPanel(expandPanel);
              }
            }
            else {

              propertyPanel.closePropertyPanel(expandPanel);
              layerPanel.clearLayerPanelList();
            }
            var gridPanelSelectedCount = $(controlConstant.selectedGridPanel).length;

            if (gridPanelSelectedCount === gridSelectedCountLimit) { /*selection of a grid panel will create layer panel*/
              layerPanel.createControlMenu();
            } else {
              layerPanel.clearLayerPanelList();
            }
          }
        }
      }
    );
    setSelectable(ctrl, false);
  }

  function setSelectable(ctrl, bool) {
    $(ctrl).selectable({disabled: !bool});
  }

  function createResizable(ctrl, attrContainment) {
    ctrl = $(ctrl).resizable({
      containment: attrContainment ? attrContainment : controlConstant.uiContainment,
      grid: controlConstant.uiPixelGrid,
      resize: function (event, ui) {
        if ($(this).attr('controltype') === controlTypes.multilineTextBox) {
          handleMultiLineTextBoxResize(ctrl, ui);
        }
      },
      stop: function () {
        var controlData = builder.json.controls.getControls(controlConstant.controlContainer);
        builder.update.updateFormSchema(formSchemaConstant.Controls, controlData);
      }
    });
    setResizable(ctrl, true);
    return ctrl;
  }

  function handleMultiLineTextBoxResize(ctrl, ui) {
    var extraSpanWidth = 18,
      extraLabelHeight = 8,
      extraSpanHeight = 2,
      radixParameter = 10,
      multilineTexboxSpan = ctrl[0].children[1].id,
      multilineTextBoxLabel = ctrl[0].children[0].id,
      currentControlHeight = ui.size.height,
      currentControlWidth = ui.size.width,
      handleAxis = $(ctrl[0]).data('ui-resizable').axis,
      currentSpanWidth = $('#' + multilineTexboxSpan).width(),
      currentLabelWidth = $('#' + multilineTextBoxLabel).width();
    if (handleAxis === 'e' || handleAxis === 'se') {
      $(ctrl[0]).resizable('option', 'minWidth', parseInt($(ctrl[0]).css('min-width'), radixParameter));
      var width = currentControlWidth - (currentLabelWidth + currentSpanWidth);
      var totalSpanWidth = currentSpanWidth + width;
      /*container right and left border 2px
       * label right and left border 2px
       * label right and left padding 12px
       * span right and left border 2px
       * total 18px need to subtract to get span width
       * */
      $('#' + multilineTexboxSpan).width(totalSpanWidth - extraSpanWidth);
      /* span width 18px*/
    }
    if (handleAxis === 's' || handleAxis === 'se') {
      $(ctrl[0]).resizable('option', 'minHeight', parseInt($(ctrl[0]).css('min-height'), radixParameter));
      $('#' + multilineTextBoxLabel).height(currentControlHeight - extraLabelHeight);
      /*label padding 6 + label border 2*/
      $('#' + multilineTexboxSpan).height(currentControlHeight - extraSpanHeight);
      /*span border 2*/
    }
  }

  function setResizable(ctrl, bool) {
    if (!bool) {
      $(ctrl).resizable('destroy');
    } else {
      $(ctrl).resizable({
        handles: constant.controlConstant.resizeHandle,
        disabled: !bool
      });
    }
  }

  function createDraggable(ctrl) {
    var data = {};
    $(ctrl).draggable(
      {
        revert: 'invalid',
        grid: [controlConstant.uiPixelGrid, controlConstant.uiPixelGrid],
        start: function (event, ui) {
          data = $(this).position();
          builder.layoutgrid.elementEventHistory(this, data, 'start');
        },
        stop: function (event, ui) {
          data = $(this).position();
          builder.layoutgrid.elementEventHistory(this, data, 'stop', 'move');
        },
        drag: function () {
        }
      }
    );
    setDraggable(ctrl, true);
    return ctrl;
  }

  function setDraggable(ctrl, bool) {
    $(ctrl).draggable('option', 'disabled', !bool);
  }

  function createDroppable(control, isHiddenWorkspaceCall, dropXPos, dropYPos) {
    //$(ctrl).droppable();
    var layout = builder.layoutgrid;
    $(control.container).droppable({
      greedy: control.isGreedy,
      activeClass: control.activeClass,
      containment: control.containment,
      accept: function (draggedItem) {
        var containerWidth = $(control.container).width();
        var containerHeight = $(control.container).height();
        var itemWidth = $(draggedItem).width();
        var itemHeight = $(draggedItem).height();
        if (containerWidth >= itemWidth && containerHeight >= itemHeight) {
          return (draggedItem.hasClass(controlConstant.controlButton) && !draggedItem.hasClass(controlConstant.ribbonLayoutCtrl))
            || draggedItem.hasClass(controlConstant.newControl);
        }
      },
      out: function () {
        if (isHiddenWorkspaceCall) {
          layout.changeDroppableStatus(!isHiddenWorkspaceCall);
        }
      },
      over: function () {
        if (isHiddenWorkspaceCall) {
          layout.changeDroppableStatus(isHiddenWorkspaceCall);
        }
      },
      drop: function (event, ui) {
        var ctrl = ui.draggable;
        var isNewControl = ctrl.hasClass(controlConstant.controlButton);
        var targetElemId = event.target.id;
        var topPos = ctrl.offset().top - $(this).offset().top;
        var leftPos = ctrl.offset().left - $(this).offset().left;
        topPos = topPos < 0 ? 0 : topPos;
        leftPos = leftPos < 0 ? 0 : leftPos;

        var newCtrl, controlsAttr, width, height;
        if (isNewControl) {
          newCtrl = layout.addControlsOnGridPanel(ctrl, $('#' + targetElemId), leftPos, topPos);

        }
        controlsAttr = layout.isControlFit(newCtrl, this, ctrl, isNewControl);
        width = controlsAttr.pWidth - (leftPos + controlsAttr.cWidth);
        height = controlsAttr.pHeight - (topPos + controlsAttr.cHeight);
        var isAdjustCtrlSpanHover = isNewControl || topPos === 0 || leftPos === 0 || width < 0 || height < 0;

        if (controlsAttr.test) {
          if (isNewControl) {
            $(this).append(newCtrl);
            var isParagraphClass = newCtrl.hasClass(controlConstant.controlParagraphClass);
            var isModePropertyClassActive = $(workSpaceConstant.modePropertyClass).hasClass(workSpaceConstant.active);
            if (isParagraphClass) {
              $('.' + controlConstant.controlParagraphClass).draggable({cancel: controlConstant.paragraphEditorClass});

              $(controlConstant.paragraphEditorClass).dblclick(function () {
                $(gridConstant.gridListContainer).selectable('destroy');
                var grid = $(gridConstant.gridContainerUL).gridster().data('gridster');
                grid.disable().disable_resize();
                $(this).attr(controlConstant.contenteditable, 'true');
                $(this).focus();
                if (isModePropertyClassActive) {
                  createSelectable($(gridConstant.gridListContainer), constant.controlTypes.gridPanel, gridConstant.filter);
                  $(this).attr(controlConstant.contenteditable, 'false');
                }
              })
                .blur(function () {
                  $(gridConstant.gridContainerUL).gridster().data('gridster').enable().enable_resize();
                  $(this).resizable();
                });
              interaction.assignKendoEditor();

            }
            ctrl = newCtrl;
          }
          else if (ctrl.parent().attr('id') !== targetElemId) {
            ctrl.detach().appendTo(event.target).css('top', topPos + 'px').css('left', leftPos + 'px');
          }
          else {
            ctrl.css('top', topPos + 'px').css('left', leftPos + 'px');
          }

          if (isAdjustCtrlSpanHover) {
            layout.adjustCtrlSpanHover(ctrl, controlsAttr, dropXPos, dropYPos, width, height);
          }

          if (control.changeDroppableStatus) {
            layout.changeDroppableStatus(false);
          }
        }
        $(workSpaceConstant.newControl).addClass(controlConstant.moveCursor);
        $(workSpaceConstant.newControl).find(controlConstant.label).addClass(controlConstant.moveCursor);
        var controlData = builder.json.controls.getControls(controlConstant.controlContainer);
        builder.update.updateFormSchema(formSchemaConstant.Controls, controlData);
      }
    });
    setDroppable(control.container, true);
  }

  function setDroppable(ctrl, bool) {
    $(ctrl).droppable('option', bool);
  }

  function createSortable(ctrl) {
    $(ctrl).sortable();
    setSortable(ctrl, true);
  }

  function setSortable(ctrl, bool) {
    $(ctrl).sortable('option', bool);
  }

  function setEvents(elem, val) {
    setDraggable(elem, val);
    setResizable(elem, val);
    setSelectable($(gridConstant.gridListContainer), !val);
    setSelectable($(workSpaceConstant.hiddenWorkspace), !val);
  }

  /* Inline Editor */
  function createEditor(ctrl) {
    $(ctrl).kendoEditor({
      resizable: true,
      tools: [
        'bold',
        'italic',
        'underline',
        'createLink',
        'unlink'
      ]
    });
  }

  return {
    create: function (controlType, controlId) {
      var elem = createControl(controlId, controlType);
      addHistory(elem, 'create', controlId);
      return elem;
    },
    createSelectable: function (ctrl, controlType, filter) {
      createSelectable(ctrl, controlType, filter);
    },
    createDraggable: function (ctrl) {
      return createDraggable(ctrl);
    },
    createDroppable: function (ctrl, isHiddenWorkspaceCall, dropXPos, dropYPos) {
      return createDroppable(ctrl, isHiddenWorkspaceCall, dropXPos, dropYPos);
    },
    createResizable: function (ctrl, attrContainment) {
      return createResizable(ctrl, attrContainment);
    },
    copy: function (ctrl, newCtrlId) {
      var elem = createControl(newCtrlId, ctrl.controlType),
        currStyle = ctrl.element.attr('style');

      elem.properties = ctrl.properties;
      elem.element.attr('style', currStyle);

      addHistory(elem, 'copy', ctrl.controlId + ' to ' + newCtrlId);

      return elem;
    },

    modify: function (controlId) {
      //properties are changing in this function
      var elem = $('#' + controlId);
      addHistory(elem, 'modified', controlId);
    },

    deleteControl: function (controlId) {
      var elem = $('#' + controlId);
      addHistory(elem, 'removed', controlId);
      elem.remove();
    },

    setControlMode: function (elem, mode) {
      if (mode === 'select') {
        // changed it from true to false because this property is referring a value for 'disabled' attribute
        setEvents(elem, false);
      }
      if (mode === 'drag') {
        setEvents(elem, true);
      }
    },

    activateControl: function (controlId) {
      $(controlId).addClass('active');
    },
    inactiveGridPanel: function () {
      $('ul.gridListContainer li').removeClass('active');
    },
    selectControl: function (controlId) {
      $(controlId).addClass(controlConstant.selectedElement);
    },
    deselectAllControl: function (newCtrl) {
      $(newCtrl).removeClass(controlConstant.selectedElement);
    },
    bindEvents: function (controlId) {
      //var ctrl = $('#' + controlId);

    }
  };

}(jQuery, kendo));

/* TEMPLATE EXAMPLES
 var scriptData = { firstName: 'John', lastName: 'Doe' };
 $('#script').html(scriptTemplate(scriptData));

 var javascriptData = ['First', 'Second', 'Third'];
 $('#javascript').html(javascriptTemplate(javascriptData));
 */
