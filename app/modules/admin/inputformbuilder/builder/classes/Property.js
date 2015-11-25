elli.builder.property = (function () {
  'use strict';

  var options = {
      form: ['codeURL', 'styleURL'],
      bg: ['color'],
      border: ['width', 'style', 'color'],
      borderStyle: ['solid', 'dashed', 'dotted', 'groove', 'ridge', 'double', 'inset', 'outset'],
      borderPosition: ['left', 'right', 'top', 'bottom', 'all'],
      text: ['size', 'font', 'color', 'alignment', 'wrap', 'overflow'],                               //label | paragraph
      font: ['arial', 'verdana', 'helvetica'],
      layout: ['height', 'width', 'top', 'left'],
      label: ['top', 'left', 'right'],
      common: ['help', 'title', 'enabled', 'visible', 'tabIndex'],
      button: ['action', 'type'],
      input: ['type', 'mask', 'maxLength', 'minLength', 'alignment', 'rolodex', 'zipcode', 'lock'],     //text | textarea
      img: ['url'],
      borrower: ['borrower', 'coborrower'],
      rolodex: ['id', 'field'],
      header: ['color', 'background', 'text'],
      code: ['editor', 'find', 'macro']
    },

    propertyMap = {
      Panel: {
        ui: {background: options.bg, border: options.border},                         //Grid Panel
        data: {},
        events: {}
      },
      PanelBox: {
        ui: {
          background: options.bg,
          border: options.border,
          layout: options.layout,
          common: options.common,
          header: options.header
        },
        data: {},
        events: {}
      }
    };

  var builder = elli.builder, propertyPanelConstant = elli.builder.constant.propertyPanelConstant,
    interaction = window.IFB_NAMESPACE.KendoInteraction, defaultValues;

  function getElem(type, label, inMultiple) {
    var elem;

    switch (type) {
      default:
      case 'text' :
      case 'alphanumeric':
      case 'numeric':
        elem = createInputControl('text');
        break;
      case 'boolean':
        elem = createInputControl('checkbox');
        break;
      case 'select' :
        elem = $('<select>');
        break;
      case 'label' :
        elem = $('<label>');
        break;
      case 'fieldset' :
        elem = createFieldSetControl(label);
        break;
      case 'section' :
        elem = createPropertySection(label);
        break;
      case 'break' :
        elem = createBreakTag;
        break;
      case 'controlId':
        elem = createInputControl('text');
        break;
      case 'tabIndex' :
        elem = createInputControl('text');
        break;
      case 'span' :
        elem = createSpan(label);
        break;
      case 'rightPlaceHolder' :
        elem = createRightPlaceHolder(label);
        break;
      case 'button' :
        elem = createButton(type);
        break;
      case 'standardButton' :
        elem = createStandardButtons(inMultiple);
        break;
      case 'cssEditor' :
        elem = createCssEditor();
        break;
    }

    return elem;
  }

  function createCssEditor() {
    var editorCtrl = $('<div>');
    editorCtrl.attr('id', 'editor-read-zone');
    return editorCtrl;
  }

  function createAceEditor(editorId) {
    var editorACE = ace.edit(editorId);
    editorACE.setTheme('ace/theme/chrome');
    editorACE.getSession().setMode('ace/mode/css');
    editorACE.$blockScrolling = Infinity;
    var lines = new Array();
    var cssFilePath = '../../../styles/common.less';
    $.get(cssFilePath, function (data) {
      lines = data.split('\n');
      var finalText = '';
      for (var i = 0; i < lines.length; i++) {
        finalText += lines[i];
        finalText += '\n';
      }
      editorACE.setValue(finalText);
      editorACE.clearSelection();
      editorACE.setReadOnly(true);
      editorACE.getSession().setUseWorker(false);
    });
  }

  function createBreakTag() {
    var brCtrl = $('</br>');
    return brCtrl;
  }

  function createSpan(id) {
    var spanCtrl = $('<span>');
    spanCtrl.attr('id', id);
    return spanCtrl;
  }

  function createButton(type) {
    var buttonCtrl = $('<input>');
    buttonCtrl.attr('type', type);
    return buttonCtrl;
  }

  function createRightPlaceHolder(id) {
    var spanCtrl = $('<span>');
    spanCtrl.attr('id', id);
    spanCtrl.attr('class', 'spanPlaceholder');
    return spanCtrl;
  }

  function createInputControl(type, value) {
    var ctrl = $('<input>');
    ctrl.attr('type', type);
    if (value) {
      var attr = type === 'checkbox' ? 'checked' : 'value';
      ctrl.attr(attr, value);
    }

    return ctrl;
  }

  function createFieldSetControl(label) {
    var ctrl = $('<fieldset>'), childElem = $('<legend>');
    childElem.html(label);
    ctrl.append(childElem);

    return ctrl;
  }

  function createPropertySection(label) {
    var ctrl = $('<div>');
    if ($.trim(label).length > 0) {
      ctrl.html(label);
    }
    return ctrl;
  }

  function createStandardButtons(inMultiple) {
    var buttonCount;
    var controlContainer = $('<div>');
    for (buttonCount = 0; buttonCount < inMultiple.length; buttonCount++) {
      var button = getElem('button');
      $(button).attr('id', 'standard-button' + (buttonCount + 1));
      $(button).addClass(inMultiple[buttonCount].styleClass);
      $(button).attr('name', inMultiple[buttonCount].text);
      controlContainer.append(button);
    }
    return controlContainer;
  }

  function createPropertyElements(propArray, container) {
    var j = 0; var isEditor = false;
    for (var i = 0; i < propArray.length; i++) {
      var currentItem = propArray[i];
      var propertyContainer = getElem(currentItem.type, currentItem.label);
      propertyContainer.attr('id', currentItem.name + '_container');

      for (var p = 0; p < currentItem.properties.length; p++) {
        var controlContainer = $('<div>');
        controlContainer.addClass = 'controlContainer';
        var currentProp = currentItem.properties[p];
        if (currentProp.isVisible) {
          controlContainer.attr('style', currentProp.isVisible);
          controlContainer.attr('id', currentProp.name + '_container');
        }
        if (currentProp.separator) {
          controlContainer.attr('class', currentProp.separator);
        }

        if (!currentProp.textOnly) {
          var labelElem = getElem('label');
          labelElem.html(currentProp.label);
          if (currentProp.styleClass) {
            labelElem.attr('class', currentProp.styleClass);
          }
          if (currentProp.id) {
            labelElem.attr('id', currentProp.id);
          }
          controlContainer.append(labelElem);
        }

        if (currentProp.br) {
          var breakElem = getElem(currentProp.br);
          controlContainer.append(breakElem);
        }

        if (!currentProp.labelOnly) {
          var propElem = getElem(currentProp.type);
          propElem.attr('id', currentProp.name);
          if (currentProp.placeholder) {
            propElem.attr('placeholder', currentProp.placeholder);
          }
          if (currentProp.controlClass) {
            propElem.attr('class', currentProp.controlClass);
          }
          if (currentProp.type === 'boolean') {
            var propElem1 = getElem('span', 'switch_container' + (j + 1)).attr('class', 'switch_container');
            var temp = propElem;
            propElem1.append(temp);
            propElem = propElem1;
            j++;
          }
          controlContainer.append(propElem);
        }

        if (currentProp.rightPlaceHolder) {
          var spanPlaceholder = getElem(currentProp.rightPlaceHolder);
          controlContainer.append(spanPlaceholder);
        }
        if (currentProp.inMultiple) {
          var buttons = getElem(currentProp.type, null, currentProp.inMultiple);
          controlContainer.append(buttons);
        }

        if (currentProp.editor) {
          var editor = getElem(currentProp.type, currentProp.label);
          controlContainer.attr('class', 'editor-read-zone-container');
          controlContainer.append(editor);
          isEditor = true;
        }

        propertyContainer.append(controlContainer);
      }

      $(container).append(propertyContainer);

      if (isEditor) {
        createAceEditor('editor-read-zone');
        isEditor = false;
      }

    }
    if ($(propertyPanelConstant.enabledMultiControl)) {
      interaction.enableDisableSwitch(propertyPanelConstant.enabledMultiControl, true);
      for (var t = 1; t <= j; t++) {
        interaction.applyBorderKendoSwitch(propertyPanelConstant.switchContainer + t);
        var enableDimmed = (t === 1);
        enableControlState(propertyPanelConstant.switchContainer + t, enableDimmed);
      }
    }
  }

  function enableControlState(containerId, enableDimmed) {
    var propertyPanel = builder.propertyPanel;
    $(containerId).on('click', function () {
      interaction.applyBorderKendoSwitch(containerId);
      if (enableDimmed) {
        // Dim control if mode is disabled
        if (!$(propertyPanelConstant.enabledMultiControl).prop('checked')) {
          $(propertyPanelConstant.hiddenSelectedControls).fadeTo('fast', 1);
          propertyPanel.setEnabledState(true);
        }
        else {
          $(propertyPanelConstant.hiddenSelectedControls).fadeTo('fast', 0.4);
          propertyPanel.setEnabledState(false);
        }
      }

    });
  }

  function clearProperties(container) {
    $(container).children().remove();
  }

  function setValues(loadValues) {
    defaultValues = loadValues;
  }

  return {
    getProperties: function (ctrlType) {
      return propertyMap[ctrlType];
    },
    load: function (ctrlContent, container, loadValues, subControlData) {
      setValues(loadValues);
      clearProperties(container);
      createPropertyElements(ctrlContent, container);
    },
    clearProperties: clearProperties
  };
}());

