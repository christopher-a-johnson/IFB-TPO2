/**
 * Creates a new Workspace.
 * @class
 * @param {jQuery} $ - jQuery Object.
 */

elli.builder.workspace = (function ($) {
  'use strict';

  var builder = elli.builder,
    storage = window.IFB_NAMESPACE.Storage,
    kendoInteraction = window.IFB_NAMESPACE.KendoInteraction,
    control = builder.control,
    utility = builder.utility,
    workspaceConstant = builder.constant.workSpaceConstant,
    controlConstant = builder.constant.controlConstant,
    formAPIs = builder.constant.formAPIs,
    panel = builder.panel,
    constant = builder.constant,
    gridConstant = constant.gridConstant;

  var storageItem = 'Workspace',
    controlsCount = {},
    controls = [],
    controlObj = {},
    gridPanelCount = 0,
    assetCount = 0,
    formSchemaFileObj = {};

  var FORM_SCHEMA = {
    form_schema: 'formSchema',
    formSchema_JSON: {},
    propertiesSchema: 'propertiesSchema'
  };

  var formContainer = {
    formName: $('#formName'),
    newFormButton: $('#newButton'),
    gridContainer: $('div.gridContainer'),
    builderWorkspace: $('#builderWorkspace'),
    hiddenWorkspace: $('#hiddenWorkspace'),
    formDescription: $('#formDescription'),
    formModifiedBy: $('#lblModifiedBy'),
    formModifiedDate: $('#lblModifiedDate'),
    formEnabled: $('#formEnabled'),
    gridsterListHtml: '<ul class="gridListContainer" data-role="tooltip"></ul>',
    formBuilderForm: $('#formBuilderForm'),
    formWidthDropDown: $('#formWidthDropDown'),
    drawerHelpText: $('#drawerHelpText'),
    drawerCollapse: $('#drawerCollapse')
  };

  function getFormId() {
    return utility.getQueryString('FormId');
  }

  function initialize() {
    storage.setStorageType('sessionStorage');
    storage.removeItem(FORM_SCHEMA.propertiesSchema);
  }

  function clearCustomInputForm() {
    $(workspaceConstant.controlButtonClass).draggable({revert: true});
    $(workspaceConstant.controlButtonClass).draggable('disable');
    $('.gridContainer > ul').gridster().data('gridster').destroy(true);
    formContainer.gridContainer.html(formContainer.gridsterListHtml);
    formContainer.builderWorkspace.removeAttr('style');
    formContainer.hiddenWorkspace.attr('style', 'display : none');
    formContainer.drawerHelpText.text('Show Hidden Elements');
    formContainer.drawerCollapse.removeClass('drawerCollapse').addClass('drawerExpand');
    formContainer.formBuilderForm.removeAttr('style');
    formContainer.formWidthDropDown.val('Default');
    formContainer.hiddenWorkspace.empty();
    $(workspaceConstant.ribbonHeader).addClass('ribbon-header disabled-click');
    $(workspaceConstant.ribbonHeader).attr('data-disabled-header', 'true');
    formContainer.formName.val(workspaceConstant.newFormDefaultText);
    formContainer.formDescription.val(workspaceConstant.newFormDescription);
    formContainer.formModifiedBy.text('');
    $(workspaceConstant.layersPanel).hide();
    kendoInteraction.resetKendoSwitch(workspaceConstant.formEnabled, workspaceConstant.formEnabledField);
    formContainer.formModifiedDate.text('');
    $(workspaceConstant.formPropertiesPanel).show();
    $(workspaceConstant.propertyCollapse1).text('Hide');
    $(workspaceConstant.propertyCollapse).removeClass('k-i-arrowhead-s').addClass('k-i-arrowhead-n');
    $(workspaceConstant.modeMoveClass).removeClass(workspaceConstant.active);
    $(workspaceConstant.modePropertyClass).removeClass(workspaceConstant.active);
    $(workspaceConstant.modePropertyClass).attr('disabled', true);
    $(workspaceConstant.modeMoveClass).attr('disabled', true);
    builder.propertyPanel.closePropertyPanel(false);
    builder.layerPanel.clearLayerPanelList();
  }

  function disableFormSaveButton(state) {
    $(workspaceConstant.saveButton).prop('disabled', state);
  }

  function saveCustomInputForm(resetForm) {
    disableFormSaveButton(true);
    var formSchemaData = storage.getItem(FORM_SCHEMA.form_schema);

    // The case when user save form with form name only form schema will not be present
    if (!formSchemaData) {
      formSchemaData = {Metadata: builder.metaData.getFormMetaData()};
    }
    var restfulServices = utility.getRestfulServices();
    var duplicateFormMsg = 'Form name already exists. Please rename';
    restfulServices.post(formAPIs.saveInputFormAPI, formSchemaData).then
    (function (response) {
      //Reset the form when new form button is clicked
      if (resetForm) {
        clearCustomInputForm();
      }
      /*ToDO: Service response gives different error, UX expects different message.
       TODO: Need to add check for the duplicateFormMsg when getting correct formatted response*/
      if (response.data && response.status === workspaceConstant.responseBadDataError) {
        //If user get any error while saving the form then form should not get close and save button should get enable
        window.alert(duplicateFormMsg);
        disableFormSaveButton(false);
      }
    });
  }

  function loadFormSchema() {
    var formId = getFormId();
    var workspace = builder.workspace,
      metadata = builder.metaData,
      properties = builder.properties;
    var restfulServices = utility.getRestfulServices();
    var singleFormApi = formAPIs.getInputFormAPI + '?InputFormID=' +
      formId;
    restfulServices.getAll(singleFormApi).then(function (newPromise) {
      /*used to get data for post*/
      workspace.formSchemaJson = newPromise.body().data().GetInputFormResponse.InputFormData;
      metadata.extractMetadataFromJSON(workspace.formSchemaJson.Metadata);
      if (workspace.formSchemaJson.Properties) {
        properties.loadFormPropertyFromJSON(workspace.formSchemaJson);
      }
      if (workspace.formSchemaJson.Panels) {
        panel.load.createPanelFromJSON(workspace.formSchemaJson);
      }
      if (workspace.formSchemaJson.Controls) {
        panel.loadControls.getControlsJSON(workspace.formSchemaJson.Controls);
      }
      //while opening an existing form the save button should be disabled
      workspace.disableFormSaveButton(true);
    });
  }

  /* This property is available globally for workspace object.*/
  Object.defineProperty(formSchemaFileObj, 'formSchemaJson', {
    get: function () {
      return formSchemaFileObj;
    },
    set: function (newValue) {
      formSchemaFileObj = newValue;
    },
    enumerable: true,
    configurable: true
  });

  function getControlCountFromJsonSchema(ctrlId) {
    return Number((!!(ctrlId.match(/(\d+)/g)) ? (ctrlId.match(/(\d+)/g))
      : [1])[0]);
  }

  function createControlId(prop) {
    var propCount = controlsCount[prop], propId;

    do {
      propCount = (propCount > 0) ? ++propCount : 1;
      propId = prop + propCount;
    } while (propId === controlObj[propId]);

    setControlCount(prop, propCount);

    return propId;
  }

  function setControlCount(prop, val) {
    controlsCount[prop] = val;
  }

  function updateControls(ctrl, ctrlId, isNew) {
    controlObj[ctrlId] = ctrl;

    if (isNew) {
      controls.push(ctrl);
    }

    updateStorage();
  }

  function updateStorage() {
    storage.setItem(storageItem, controls);
  }

  // Handle move/resize mode click.
  function workSpaceMode() {
    // Move-resize mode click
    $(workspaceConstant.modeMoveClass).click(function () {
      enableMode(workspaceConstant.moveMode);
    });
    $(workspaceConstant.modePropertyClass).click(function () {
      enableMode(workspaceConstant.propertyMode);
    });
  }

  function saveFormSchema() {
    $(workspaceConstant.saveButton).click(function () {
      // Storage item is being stringified to JSON format in Storage class
      updateStorage();
      saveCustomInputForm();
    });
  }

  function openNewForm() {
    formContainer.newFormButton.click(function () {

      var isRibbonHeaderDisabled =
        $(workspaceConstant.ribbonHeader).data('disabled-header');
      if (!isRibbonHeaderDisabled || formContainer.formName.val() !==
        'New Form' ||
        formContainer.formDescription.val !== 'Description' ||
        formContainer.formEnabled.data('kendoMobileSwitch').check()) {
        var confirmMessage = 'Do you want to save changes of existing form or not?';
        var confirmChangesToForm = window.confirm(confirmMessage);
        if (confirmChangesToForm) {
          saveCustomInputForm(true);
        } else {
          clearCustomInputForm();
          disableFormSaveButton(false);
        }
      }
      else {
        clearCustomInputForm();
      }
    });
  }

  // Enable the mode
  function enableMode(mode) {
    var layoutGrid = builder.layoutgrid,
      layoutRibbon = builder.layoutribbon,
      workspace = builder.workspace,
      modeFlag = false, newControl;
    if (workspace.formSchemaJson) {
      $(workspaceConstant.modePropertyClass).removeAttr('disabled');
      $(workspaceConstant.modeMoveClass).removeAttr('disabled');
    }
    if (mode === workspaceConstant.moveMode) {
      toggleActiveModeClass(mode);
      workspace.removeAllControlsSelection();
      handleWorkspaceControls();
      builder.propertyPanel.closePropertyPanel(false);
    }
    else {
      control.createSelectable($(gridConstant.gridListContainer), constant.controlTypes.gridPanel, gridConstant.filter);
      if ($(controlConstant.paragraphEditorClass).length > 0 && ($(controlConstant.paragraphEditorClass).hasClass('k-editor'))) {
        $(controlConstant.paragraphEditorClass).attr('contenteditable', 'false');
      }
      toggleActiveModeClass(mode);
      modeFlag = true;
      newControl = $(workspaceConstant.newControl);
      control.setControlMode(newControl, 'select');
      $(workspaceConstant.rbnLayoutCtrlContainer).addClass(controlConstant.classDisabledClick);
    }
    toggleMousePointer(mode);
    layoutRibbon.initRibbonControls(modeFlag);
    layoutGrid.changeGridPanelResizableStatus(!modeFlag);
    layoutGrid.changeSelectableStatus(modeFlag);
    layoutGrid.changeDroppableStatus(modeFlag);
  }

  function toggleMousePointer(mode) {
    var newControl = $(workspaceConstant.newControl), classToRemove, classToAdd;
    if (mode === workspaceConstant.moveMode) {
      classToRemove = controlConstant.pointerCursor;
      classToAdd = controlConstant.moveCursor;
    }
    else {
      classToRemove = controlConstant.moveCursor;
      classToAdd = controlConstant.pointerCursor;
    }
    newControl.removeClass(classToRemove).addClass(classToAdd);
    newControl.find(controlConstant.label).removeClass(classToRemove).addClass(classToAdd);
  }

  function toggleActiveModeClass(mode) {
    if (mode === workspaceConstant.moveMode) {
      $(workspaceConstant.modeMoveClass).addClass(workspaceConstant.active);
      $(workspaceConstant.modePropertyClass).removeClass(workspaceConstant.active);
    } else {
      $(workspaceConstant.modeMoveClass).removeClass(workspaceConstant.active);
      $(workspaceConstant.modePropertyClass).addClass(workspaceConstant.active);
    }
  }

  function handleWorkspaceControls() {
    var formControls = controls; // get workspace controls
    for (var i = 0; i < formControls.length; i++) {
      // apply control behaviour
      builder.layoutgrid.addControlsOnGridPanel(formControls[i], null,
        formControls[i].element.css('left'),
        formControls[i].element.css('top'), formControls[i].controlType,
        formControls[i].controlId);
    }
  }

  /* this function gets called only when gridPanelCount = 0 */
  function createSchema() {
    FORM_SCHEMA.formSchema_JSON.Metadata =
      builder.metaData.getFormMetaData() || {};
    FORM_SCHEMA.formSchema_JSON.Panels =
      builder.workspacePanels.getAllPanels() || {};
    FORM_SCHEMA.formSchema_JSON.Controls =
      builder.json.controls.getControls() || [];
    FORM_SCHEMA.formSchema_JSON.Assets = [];
    FORM_SCHEMA.formSchema_JSON.Properties =
      builder.properties.getFormProperties() || {};

    initialize(); // creates session storage
    storage.setItem(FORM_SCHEMA.form_schema,
      FORM_SCHEMA.formSchema_JSON); // set formSchema object in session storage
  }

  return {
    init: function () {
      initialize();
      workSpaceMode();
      saveFormSchema();
      openNewForm();
    },
    loadFormSchema: function () {
      loadFormSchema();
    },
    createFormSchema: function () {
      createSchema();
    },
    controls: function () {
      return controls;
    },

    getSelectedObjects: function () {
      return $('.' + workspaceConstant.classUiSelected);
    },

    getControlCount: function (prop) {
      return controlsCount[prop];
    },

    getControlsCount: function () {
      return controls.length;
    },

    loadAllControls: function () {
      var $controls = $('div[controlType]');
      $.each($controls, function (i, val) {
        var prop = $(i).attr('controlType');
        this.addControl(prop);
      });
    },

    updateControls: function (ctrl, ctrlId, isNew) {
      updateControls(ctrl, ctrlId, isNew);
    },

    getControlById: function (ctrlId) {
      return controlObj[ctrlId];
    },

    getControls: function () {
      return controlObj;
    },

    removeAllControlsSelection: function() {
      $(workspaceConstant.gridContainerUISelected).removeClass(controlConstant.classUiSelected);
      $(workspaceConstant.gridPanelControlSelected).removeClass(controlConstant.classUiSelected);
      $(workspaceConstant.newControl).removeClass(controlConstant.classUiSelected);
      $(controlConstant.gridContainer).removeClass(controlConstant.classUiSelected);
      $(workspaceConstant.rbnLayoutCtrlContainer).removeClass(controlConstant.classDisabledClick);
    },

    setWorkspaceMode: function (mode) {
      $.each(controlObj, function (key, val) {
        var elem = this[key].element;
        control.setControlMode(elem, mode);
      });
    },

    addControl: function (ctrlType, ctrlId) {
      var ctrl;
      if (!ctrlId) {
        ctrlId = createControlId(ctrlType);
      }
      else {
        var propCount = getControlCountFromJsonSchema(ctrlId);

        var maxCnt = controlsCount[ctrlType];
        if (!maxCnt || maxCnt < propCount) {
          maxCnt = propCount;
        }
        setControlCount(ctrlType, maxCnt);
      }

      ctrl = control.create(ctrlType, ctrlId);
      updateControls(ctrl, ctrlId, true);
      FORM_SCHEMA.formSchema_JSON = builder.update.updateCount
      (workspaceConstant.controlCount);
      return ctrlId;
    },

    drawControl: function (control, parentElem, xPos, yPos, ctrlType, ctrlId) {
      return builder.layoutgrid.addControlsOnGridPanel(control, parentElem, xPos, yPos, ctrlType, ctrlId);
    },

    copyControl: function (ctrlId) {
      var ctrl = controlObj[ctrlId],
        newCtrlId = createControlId(ctrl.ctrlType),
        newCtrl = control.copy(ctrl, newCtrlId);
      updateControls(newCtrl, newCtrlId, true);
    },

    editControl: function (ctrlId) {
    },

    removeControl: function (ctrlId) {
      delete controlObj[ctrlId];     //////TODO: Revisit this for undo,might just update the object to reflect deleted
      updateStorage();
    },

    /* increament gridPanel counter */
    addPanel: function () {
      if (gridPanelCount === 0) {
        createSchema();
        storage.removeItem('propertiesSchema');
      }
      gridPanelCount++;
      FORM_SCHEMA.formSchema_JSON = builder.update.updateCount(workspaceConstant.panelCount);
      builder.workspacePanels.updateFormPanelsSchema();
    },

    /* decreament gridPanel counter */
    removePanel: function () {
      gridPanelCount--;
      FORM_SCHEMA.formSchema_JSON = builder.update.updateCount
      (workspaceConstant.panelCount);
    },

    /* return total grid panels count on workspace */
    getGridPanelCount: function () {
      return gridPanelCount;
    },
    /* enable the workspace mode  */
    enableMode: function (mode) {
      enableMode(mode);
    },
    disableFormSaveButton: function (state) {
      disableFormSaveButton(state);
    },
    addAsset: function () {
      //todo : This function to be used for add asset functionality in future
      assetCount++;
      FORM_SCHEMA.formSchema_JSON = builder.update.updateCount
      (workspaceConstant.assetCount);
    },
    getAssetCount: function () {
      return assetCount;
    },
    getFormSchema: function () {
      return FORM_SCHEMA.formSchema_JSON;
    },
    getWorkspaceSchema: function () {
      return storage.getItem(storageItem);
    },
    getControlsFromGridPanel: function (gridPanelId) {
      var controlDataObj = $('#' + gridPanelId).find(workspaceConstant.gridContainmentClass).children();
      return controlDataObj.length ? controlDataObj : undefined;
    },
    getNearestControlPositions: function (controlData) {
      var minX = 0, minY = 0;
      for (var i = 0; i < controlData.length; i++) {
        var offsetX = controlData[i].offsetWidth + controlData[i].offsetLeft;
        var offsetY = controlData[i].offsetHeight + controlData[i].offsetTop;
        if (offsetX > minX) {
          minX = offsetX;
        }
        if (offsetY > minY) {
          minY = offsetY;
        }
      }
      return {minX: minX, minY: minY};
    }
  };

}(jQuery));
elli.builder.workspace.init();
