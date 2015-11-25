elli.builder.update = (function () {
    'use strict';

    var storage = window.IFB_NAMESPACE.Storage,
      selectedControl,
      builder = elli.builder,
      workspace = builder.workspace,
      constant = builder.constant.workSpaceConstant,
      utility = builder.utility,
      controlConstant = builder.constant.controlConstant,
      controlTypes = builder.constant.controlTypes,
      containerTypes = builder.constant.containerTypes,
      formSchemaConstant = builder.constant.formSchema;

    var SCHEMA_CONST = {
        propertiesPanel: $('#propertiesPanelTabs'),
        paragraphHeight: '#paragraph-height',
        paragraphWidth: '#paragraph-width',
        paragraphStyle: '#paragraph-style',
        done: $('#savePropertyChanges'),
        tab: '#propertiesPanelTabs ul li',
        activeTab: '.k-state-active',
        formSchema: 'formSchema',
        firstElementfromGrep: 0,
        appearanceTabContent: '#appearanceTabContent',
        fontAppearance: $('#fontAppearance'),
        bgColorAppearance: $('#bgColorAppearance'),
        borderAppearance: $('#borderAppearance'),
        container: $('#propertiesPanelDiv'),
        delay: 600,
        form: 'Form',
        formID: 'FormId',
        gridPanel: 'grid-panel',
        selectedControls: '.new-Control.ui-selected',
        imageControlIdInput: 'input#control-controlId',
        imageSize: '#imageSizeSlider',
        imageSource: '#linkedPanelProperty',
        imageHoverText: '#imageHoverText',
        imageStyle: '#imageStyle',
        tabIndex: '#control-tabIndex',
        buttonText: '#control-button-text',
        hoverText: '#control-hover-text',
        buttonStyle: '#button-style',
        buttonControlIdInput: '#control-controlId',
        panelControlIdInput: '#panel-controlId',
        textAreaStyle: '#text-area-style',
        textAreaLabelPosition: '#text-area-labelPosition',
        textAreaLabel: '#text-area-label',
        textAreaWidth: '#control-width-text',
        textAreaHoverText: '#control-hover-text',
        textAreaHelpKey: '#control-hover-key',
        sessionStorage: 'sessionStorage'
    };

    var TAB_TYPE_CONST = {
        appearance: 'Appearance',
        behavior: 'Behavior',
        css: 'CSS'
    };

    function updateWorkspaceSchema(workspaceSchema, ctrlGuid, selectedControl) {
        var index = utility.getIndexOf(workspaceSchema, ctrlGuid);
        $.extend(true, workspaceSchema[index], selectedControl);
        storage.setItem(formSchemaConstant.workspaceSchema, workspaceSchema);
    }

    function updateFormSchema(schemaToUpdate, jsonObject) {

        var inputFormSchema = storage.getItem(SCHEMA_CONST.formSchema);
        if (inputFormSchema) {
            switch (schemaToUpdate) {
                case formSchemaConstant.Metadata:
                    inputFormSchema.Metadata = jsonObject;
                    break;
                case formSchemaConstant.Panels:
                    inputFormSchema.Panels = jsonObject;
                    break;
                case formSchemaConstant.Controls:
                    inputFormSchema.Controls = jsonObject;
                    break;
                case formSchemaConstant.Count:
                    inputFormSchema.Count = jsonObject;
                    break;
            }
            storage.setItem(SCHEMA_CONST.formSchema, inputFormSchema);
        }
        workspace.disableFormSaveButton(false);
    }

    function updatePropertiesInFormSchema(controlId, ctrlGuid) {
        storage.setStorageType(SCHEMA_CONST.sessionStorage);
        if (storage.getItem(SCHEMA_CONST.formID)) {
            workspace.createFormSchema();
        }
        var inputFormSchema = storage.getItem(SCHEMA_CONST.formSchema);
        if (controlId.indexOf(SCHEMA_CONST.form) >= 0) {
            inputFormSchema = updateFormProperties(inputFormSchema);
        } else if (controlId.indexOf(SCHEMA_CONST.gridPanel) >= 0) {
            inputFormSchema.Panels = updatePanelProperties(inputFormSchema.Panels, controlId);
        } else {
            inputFormSchema.Controls = updateControlProperties(inputFormSchema.Controls, controlId);
            var workspaceSchema = workspace.getWorkspaceSchema();
            updateWorkspaceSchema(workspaceSchema, ctrlGuid, selectedControl);
            var controlData = builder.json.controls.getControls(controlConstant.controlContainer);
            updateFormSchema(formSchemaConstant.Controls, controlData);
        }
        workspace.disableFormSaveButton(false);
    }

    function updateFormProperties(inputFormSchema) {
        workspace.disableFormSaveButton(false);

        var selectedTab = $(SCHEMA_CONST.tab +
        SCHEMA_CONST.activeTab).find('a').text();
        var j;
        if (selectedTab === TAB_TYPE_CONST.appearance) {
            // todo : read it from DOM when Appearance tab is ready
            var formProperties = {
                style: {
                    font: SCHEMA_CONST.fontAppearance.val(),
                    backgroundColor: SCHEMA_CONST.bgColorAppearance.val(),
                    border: SCHEMA_CONST.borderAppearance.val()
                }
            };
            var keys = utility.getKeys(formProperties);
            if (inputFormSchema !== null) {
                if (!inputFormSchema.Properties.ui) {
                    inputFormSchema.Properties.ui = {};
                }
                for (j = 0; j < keys.length; j++) {
                    inputFormSchema.Properties.ui[keys[j]] = formProperties[keys[j]];
                }
            }
        }
        else if (selectedTab === TAB_TYPE_CONST.behavior) {
            //todo : read it from DOM when behavior tab is ready
            var scriptFiles = [{
                AssetId: 'script1', Type: 'Scripts', uri: '/scripts/script1.js'
            },
              {
                  AssetId: 'script2', Type: 'Scripts', uri: '/scripts/script3.js'
              }];

            inputFormSchema.Assets = utility.getArrayDifference(scriptFiles,
              inputFormSchema.Assets);
        }
        else {
            //todo : read it from DOM when CSS tab is ready
            var styleFiles = [{
                AssetId: 'style1', Type: 'Styles', uri: '/styles/style1.css'
            },
              {
                  AssetId: 'style2', Type: 'Styles', uri: '/styles/test_styles.css'
              }];

            inputFormSchema.Assets = utility.getArrayDifference(styleFiles,
              inputFormSchema.Assets);

        }

        return inputFormSchema;
    }

    function updateSelectedControlJSON(controlObj) {
        var ctrlPropCount,
          selectedControl = controlObj.selectedControl;
        if (!selectedControl) {
            selectedControl = {};
        }
        if (!selectedControl.Properties) {
            selectedControl.Properties = {};
        }
        if (!selectedControl.Properties.ui) {
            selectedControl.Properties.ui = {};
        }

        if (controlObj.appearanceKeys) {
            for (ctrlPropCount = 0; ctrlPropCount < controlObj.appearanceKeys.length; ctrlPropCount++) {
                selectedControl.Properties.ui[controlObj.appearanceKeys[ctrlPropCount]] =
                  controlObj.appearanceProperties[controlObj.appearanceKeys[ctrlPropCount]];
            }
        }

        if (controlObj.behaviorKeys) {
            for (ctrlPropCount = 0; ctrlPropCount < controlObj.behaviorKeys.length; ctrlPropCount++) {
                selectedControl[controlObj.behaviorKeys[ctrlPropCount]] =
                  controlObj.behaviorProperties[controlObj.behaviorKeys[ctrlPropCount]];
            }
        }
    }

    function updateControlProperties(formControls, controlId) {
        var selectedControlObj, hoverText, behaviorKeys, appearanceKeys, appearanceProperties, behaviorProperties,
          propertyPanelConstant = builder.constant.propertyPanelConstant;

        // Below block of code will update the JSON schema for single selected control
        var selectedControlType = $(SCHEMA_CONST.selectedControls).attr('controltype'),
          updatedControlID, tabIndex;

        var controlState = builder.propertyPanel.getEnabledState();
        if (selectedControlType === controlTypes.button) {
            tabIndex = $(SCHEMA_CONST.tabIndex).val();
            updatedControlID = $(SCHEMA_CONST.buttonControlIdInput).val();
            if (updatedControlID) {
                $(SCHEMA_CONST.selectedControls).attr('id', updatedControlID);
                behaviorProperties = {
                    type: selectedControlType,
                    id: updatedControlID,
                    enabled: controlState,
                    tabIndex: tabIndex
                };
                behaviorKeys = utility.getKeys(behaviorProperties);
            }

            var buttonText = $(SCHEMA_CONST.buttonText).val();
            hoverText = $(SCHEMA_CONST.hoverText).val();
            var className = $(SCHEMA_CONST.buttonStyle).data('kendoDropDownList').text();
            var buttonStyleValue = $(SCHEMA_CONST.buttonStyle).data('kendoDropDownList').value();
            var buttonType = $(propertyPanelConstant.buttonType).data('kendoDropDownList').text();
            var buttonTypeValue = $(propertyPanelConstant.buttonType).data('kendoDropDownList').value();

            var activeBtnClass = '.' + propertyPanelConstant.btnActiveClass;
            var selectedButtonId = $(propertyPanelConstant.standardBtnClass + activeBtnClass).attr('id');
            var selectedButtonText = $('#' + selectedButtonId).attr('name');

            appearanceProperties = {
                value: buttonText,
                title: hoverText,
                'class': className,
                buttonType: buttonType ? buttonType : null,
                buttonStyleValue: buttonStyleValue ? buttonStyleValue : null,
                selectedButtonId: selectedButtonId ? selectedButtonId : null,
                selectedButtonText: selectedButtonText ? selectedButtonText : null,
                buttonTypeValue: buttonTypeValue ? buttonTypeValue : null
            };

            appearanceKeys = utility.getKeys(appearanceProperties);

        }
        else if (selectedControlType === controlTypes.panel) {
            var interaction = window.IFB_NAMESPACE.KendoInteraction;

            var containerType, containerTypeValue, panelStyleValue, panelStyleTxt, panelWidth, panelHeight, groupBoxHeader,
              groupBoxHeaderStyleValue, groupBoxHeaderStyleText, groupBoxStyleValue, groupBoxStyleText, groupBoxWidth, groupBoxHeight,
              categoryBoxHeader, categoryBoxHeaderStyleValue, categoryBoxHeaderStyleText, categoryBoxStyleValue,
              categoryBoxStyleText, categoryBoxWidth, categoryBoxHeight;
            updatedControlID = $(SCHEMA_CONST.panelControlIdInput).val();
            if (updatedControlID) {
                $(SCHEMA_CONST.selectedControls).attr('id', updatedControlID);
                behaviorProperties = {
                    type: selectedControlType,
                    id: updatedControlID,
                    enabled: controlState,
                    controlId: updatedControlID
                };
                behaviorKeys = utility.getKeys(behaviorProperties);
            }

            containerType = interaction.getDropDownList(propertyPanelConstant.containerType).text();
            containerTypeValue = interaction.getDropDownList(propertyPanelConstant.containerType).value();
            if (containerType === containerTypes.panel) {
                panelStyleValue = interaction.getDropDownList(propertyPanelConstant.panelStyle).value();
                panelStyleTxt = interaction.getDropDownList(propertyPanelConstant.panelStyle).text();
                panelWidth = $(propertyPanelConstant.paragraphWidth).val();
                panelHeight = $(propertyPanelConstant.paragraphHeight).val();

                appearanceProperties = {
                    containerType: containerType ? containerType : null,
                    containerTypeValue: containerTypeValue ? containerTypeValue : null,
                    panelStyleValue: panelStyleValue ? panelStyleValue : null,
                    panelStyleText: panelStyleTxt ? panelStyleTxt : null,
                    width: panelWidth,
                    height: panelHeight
                };
            } else if (containerType === containerTypes.groupBox) {
                groupBoxHeader = $(propertyPanelConstant.groupHeader).val();
                groupBoxWidth = $(propertyPanelConstant.paragraphWidth).val();
                groupBoxHeight = $(propertyPanelConstant.paragraphHeight).val();
                groupBoxHeaderStyleValue = interaction.getDropDownList(propertyPanelConstant.groupHeaderStyle).value();
                groupBoxHeaderStyleText = interaction.getDropDownList(propertyPanelConstant.groupHeaderStyle).text();
                groupBoxStyleValue = interaction.getDropDownList(propertyPanelConstant.containerStyle).value();
                groupBoxStyleText = interaction.getDropDownList(propertyPanelConstant.containerStyle).text();

                appearanceProperties = {
                    containerType: containerType ? containerType : null,
                    groupBoxHeader: groupBoxHeader ? groupBoxHeader : null,
                    containerTypeValue: containerTypeValue ? containerTypeValue : null,
                    groupBoxHeaderStyleValue: groupBoxHeaderStyleValue ? groupBoxHeaderStyleValue : null,
                    groupBoxHeaderStyleText: groupBoxHeaderStyleText ? groupBoxHeaderStyleText : null,
                    groupBoxStyleValue: groupBoxStyleValue ? groupBoxStyleValue : null,
                    groupBoxStyleText: groupBoxStyleText ? groupBoxStyleText : null,
                    width: groupBoxWidth,
                    height: groupBoxHeight
                };
            } else if (containerType === containerTypes.categoryBox) {
                categoryBoxHeader = $(propertyPanelConstant.categoryHeader).val();
                categoryBoxWidth = $(propertyPanelConstant.paragraphWidth).val();
                categoryBoxHeight = $(propertyPanelConstant.paragraphHeight).val();
                categoryBoxHeaderStyleValue = interaction.getDropDownList(propertyPanelConstant.categoryHeaderStyle).value();
                categoryBoxHeaderStyleText = interaction.getDropDownList(propertyPanelConstant.categoryHeaderStyle).text();
                categoryBoxStyleValue = interaction.getDropDownList(propertyPanelConstant.containerCategoryStyle).value();
                categoryBoxStyleText = interaction.getDropDownList(propertyPanelConstant.containerCategoryStyle).text();

                appearanceProperties = {
                    containerType: containerType ? containerType : null,
                    categoryBoxHeader: categoryBoxHeader ? categoryBoxHeader : null,
                    containerTypeValue: containerTypeValue ? containerTypeValue : null,
                    categoryBoxHeaderStyleValue: categoryBoxHeaderStyleValue ? categoryBoxHeaderStyleValue : null,
                    categoryBoxHeaderStyleText: categoryBoxHeaderStyleText ? categoryBoxHeaderStyleText : null,
                    categoryBoxStyleValue: categoryBoxStyleValue ? categoryBoxStyleValue : null,
                    categoryBoxStyleText: categoryBoxStyleText ? categoryBoxStyleText : null,
                    width: categoryBoxWidth,
                    height: categoryBoxHeight
                };
            }

            appearanceKeys = utility.getKeys(appearanceProperties);
        }
        else if (selectedControlType === controlTypes.dropdown) {
            var dropdownType, dropdownStyle, dropdownLabel, dropdownLabelPosition, dropdownWidth, dropdownHelpKey;
            tabIndex = $(SCHEMA_CONST.tabIndex).val();
            updatedControlID = $(SCHEMA_CONST.buttonControlIdInput).val();
            dropdownType = $(propertyPanelConstant.dropdownType).data('kendoDropDownList').text();
            dropdownStyle = $(propertyPanelConstant.dropdownStyle).data('kendoDropDownList').text();
            dropdownLabel = $(propertyPanelConstant.dropdownLabel).val();
            dropdownLabelPosition = $(propertyPanelConstant.dropdownLabelPosition).data('kendoDropDownList').text();
            dropdownWidth = $(propertyPanelConstant.dropdownWidth).val();
            dropdownHelpKey = $(propertyPanelConstant.dropdownHelpKey).val();
            if (updatedControlID) {
                $(SCHEMA_CONST.selectedControls).attr('id', updatedControlID);
                behaviorProperties = {
                    type: selectedControlType,
                    id: updatedControlID,
                    enabled: controlState,
                    tabIndex: tabIndex
                };
                behaviorKeys = utility.getKeys(behaviorProperties);
                $(SCHEMA_CONST.selectedControls).attr('id', 'container_' + updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' label').attr('id', 'label_' + updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' span.control_Dropdown').attr('id', updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' span.icon_Dropdown').attr('id', 'icon_' + updatedControlID);
            }
            appearanceProperties = {
                type: dropdownType,
                style: dropdownStyle,
                label: dropdownLabel,
                labelPosition: dropdownLabelPosition,
                width: dropdownWidth,
                helpKey: dropdownHelpKey
            };

            appearanceKeys = utility.getKeys(appearanceProperties);
        }

        else if (selectedControlType === controlTypes.imageCtrl) {
            updatedControlID = $(SCHEMA_CONST.imageControlIdInput).val();
            $(SCHEMA_CONST.selectedControls).attr('id', updatedControlID);
            behaviorProperties = {
                type: selectedControlType,
                id: updatedControlID,
                enabled: controlState
            };
            behaviorKeys = utility.getKeys(behaviorProperties);
        }

        else if (selectedControlType === controlTypes.paragraph) {
            var paragraphHeight = $(SCHEMA_CONST.paragraphHeight).val();
            var paragraphWidth = $(SCHEMA_CONST.paragraphWidth).val();
            hoverText = $(SCHEMA_CONST.hoverText).val();
            updatedControlID = $(SCHEMA_CONST.buttonControlIdInput).val();
            $(SCHEMA_CONST.selectedControls).attr('id', updatedControlID);
            var paragraphStyle = $(SCHEMA_CONST.paragraphStyle).data('kendoDropDownList').text();
            var paragraphStyleValue = $(SCHEMA_CONST.paragraphStyle).data('kendoDropDownList').value();
            if (updatedControlID) {
                $(SCHEMA_CONST.selectedControls).attr('id', updatedControlID);
                behaviorProperties = {
                    type: selectedControlType,
                    id: updatedControlID,
                    enabled: controlState
                };
                behaviorKeys = utility.getKeys(behaviorProperties);
                $(SCHEMA_CONST.selectedControls).attr('id', 'container_' + updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' div.paragraphEditor').attr('id', 'paragraphEditor_' + updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' div.paragraphDialog').attr('id', 'paragraphDrag_' + updatedControlID);
            }
            appearanceProperties = {
                height: paragraphHeight,
                width: paragraphWidth,
                title: hoverText,
                'class': paragraphStyle,
                paragraphStyleValue: paragraphStyleValue
            };

            appearanceKeys = utility.getKeys(appearanceProperties);
        }

        else if (selectedControlType === controlTypes.multilineTextBox) {
            tabIndex = $(SCHEMA_CONST.tabIndex).val();
            updatedControlID = $(SCHEMA_CONST.buttonControlIdInput).val();
            var textAreaStyle, textAreaLabel, textAreaLabelPosition, textAreaWidth, textAreaHoverText, textAreaHelpKey;
            textAreaStyle = $(SCHEMA_CONST.textAreaStyle).data('kendoDropDownList').text();
            textAreaLabelPosition = $(SCHEMA_CONST.textAreaLabelPosition).data('kendoDropDownList').text();
            textAreaLabel = $(SCHEMA_CONST.textAreaLabel).val();
            textAreaWidth = $(SCHEMA_CONST.textAreaWidth).val();
            textAreaHoverText = $(SCHEMA_CONST.textAreaHoverText).val();
            textAreaHelpKey = $(SCHEMA_CONST.textAreaHelpKey).val();

            if (updatedControlID) {
                $(SCHEMA_CONST.selectedControls).attr('id', updatedControlID);
                behaviorProperties = {
                    type: selectedControlType,
                    id: updatedControlID,
                    enabled: controlState,
                    tabIndex: tabIndex
                };
                behaviorKeys = utility.getKeys(behaviorProperties);
                $(SCHEMA_CONST.selectedControls).attr('id', 'container_' + updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' label').attr('id', 'label_' + updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' span').attr('id', updatedControlID);
            }
            appearanceProperties = {
                style: textAreaStyle,
                label: textAreaLabel,
                labelPosition: textAreaLabelPosition,
                width: textAreaWidth,
                hoverText: textAreaHoverText,
                helpKey: textAreaHelpKey
            };

            appearanceKeys = utility.getKeys(appearanceProperties);
        }

        else if (selectedControlType === controlTypes.textBox) {
            var textInputInteraction = window.IFB_NAMESPACE.KendoInteraction;
            tabIndex = $(SCHEMA_CONST.tabIndex).val();
            updatedControlID = $(SCHEMA_CONST.buttonControlIdInput).val();
            var inputTextStyle, inputTextLabel, inputTextLabelPosition, inputTextWidth, inputTextHover, inputTextHelpKey,
              inputTextMaxChar, StyleValue, PositionValue;
            inputTextStyle = textInputInteraction.getDropDownList(propertyPanelConstant.textInputStyle).text();
            StyleValue = textInputInteraction.getDropDownList(propertyPanelConstant.textInputStyle).value();
            inputTextLabelPosition = textInputInteraction.getDropDownList(propertyPanelConstant.inputTextPosition).text();
            PositionValue = textInputInteraction.getDropDownList(propertyPanelConstant.inputTextPosition).value();
            inputTextLabel = $(propertyPanelConstant.inputTextLabel).val();
            inputTextWidth = $(propertyPanelConstant.inputTextWidth).val();
            inputTextHover = $(propertyPanelConstant.inputTextHover).val();
            inputTextHelpKey = $(propertyPanelConstant.inputTextHelpKey).val();
            inputTextMaxChar = $(propertyPanelConstant.inputTextMaxChar).val();

            appearanceProperties = {
                controlStyle: inputTextStyle,
                controlStyleValue: StyleValue,
                controlPositionValue: PositionValue,
                label: inputTextLabel,
                labelPosition: inputTextLabelPosition,
                width: inputTextWidth,
                hoverText: inputTextHover,
                helpKey: inputTextHelpKey,
                maxChar: inputTextMaxChar
            };
            if (updatedControlID) {
                behaviorProperties = {
                    type: selectedControlType,
                    id: updatedControlID,
                    enabled: controlState,
                    tabIndex: tabIndex
                };
                $(SCHEMA_CONST.selectedControls).attr('id', 'container_' + updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' label').attr('id', 'label_' + updatedControlID);
                $(SCHEMA_CONST.selectedControls + ' span').attr('id', updatedControlID);
                behaviorKeys = utility.getKeys(behaviorProperties);

            }

            appearanceKeys = utility.getKeys(appearanceProperties);
        }

        selectedControl = $.grep(formControls, function (control) {
            return control.id === controlId;
        })[SCHEMA_CONST.firstElementfromGrep];

        if (!selectedControl) {
            selectedControl = {};
        }

        formControls = formControls.filter(function (ctrl) {
            return ctrl.id !== controlId;
        });

        selectedControlObj = {
            selectedControl: selectedControl,
            appearanceKeys: appearanceKeys,
            behaviorKeys: behaviorKeys,
            appearanceProperties: appearanceProperties,
            behaviorProperties: behaviorProperties
        };

        updateSelectedControlJSON(selectedControlObj);
        formControls.push(selectedControl);

        return formControls;
    }

    function readControlPropertiesFromSchema(controlId) {
        var inputFormSchema = storage.getItem(SCHEMA_CONST.formSchema);
        if (inputFormSchema.Controls.length === 1 && inputFormSchema.Controls[0].id === controlId) {
            return inputFormSchema.Controls[0].Properties.ui;
        }
    }

    function updatePanelProperties(formPanels, controlId) {
        var selectedTab = $(SCHEMA_CONST.tab +
        SCHEMA_CONST.activeTab).find('a').text();
        if (selectedTab === TAB_TYPE_CONST.appearance) {
            // todo : read it from DOM when Appearance tab is ready
            var panelProperties = {
                style: {
                    font: SCHEMA_CONST.fontAppearance.val(),
                    backgroundColor: SCHEMA_CONST.bgColorAppearance.val(),
                    border: SCHEMA_CONST.borderAppearance.val()
                }
            };
            var keys = utility.getKeys(panelProperties);

            var style = utility.createStyleString(keys, panelProperties);

            var selectedPanel = $.grep(formPanels, function (panel) {
                return panel.id === controlId;
            })[SCHEMA_CONST.firstElementfromGrep];

            if (selectedPanel) {
                formPanels = formPanels.filter(function (panel) {
                    return panel.id !== controlId;
                });
                selectedPanel.style = selectedPanel.style ? selectedPanel.style +
                    style : style;
                formPanels.push(selectedPanel);
            }
        }
        return formPanels;
    }

    return {
        init: function () {

        },
        updateCount: function () {
            var elementsCountForSchema = {};
            elementsCountForSchema[constant.panelCount] = workspace.getGridPanelCount();
            elementsCountForSchema[constant.controlCount] = workspace.getControlsCount();
            elementsCountForSchema[constant.assetCount] = workspace.getAssetCount();
            updateFormSchema(formSchemaConstant.Count, elementsCountForSchema);
        },

        updateFormSchema: function (schemaToUpdate, jsonObject) {
            updateFormSchema(schemaToUpdate, jsonObject);
        },
        readControlProperties: function (controlId) {
            return readControlPropertiesFromSchema(controlId);
        },
        updatePropertiesInFormSchema: function (controlId, crtlGuid) {
            updatePropertiesInFormSchema(controlId, crtlGuid);
        }
    };
}());
elli.builder.update.init();
