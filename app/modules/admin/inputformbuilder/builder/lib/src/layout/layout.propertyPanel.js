elli.builder.propertyPanel = (function () {
    'use strict';

    var storage = window.IFB_NAMESPACE.Storage,
      interaction = window.IFB_NAMESPACE.KendoInteraction,
      builder = elli.builder,
      controlEnabledSt = true,
      controlTypes = builder.constant.controlTypes,
      tabNames = builder.constant.tabNames,
      buttonTypes = builder.constant.buttonTypes, workspace = builder.workspace,
      containerTypes = elli.builder.constant.containerTypes,
      propertyPanelConstant = builder.constant.propertyPanelConstant,
      controlProperties = builder.property, previousSelectedControl = '',
      propertyPanel = {}, loadControlValues = {}, propertiesFromSchema = {}, isNewControlSelected, loadOptions = {};

    var SCHEMA_CONST = {
        done: $('#savePropertyChanges'),
        propertiesPanel: $('#propertiesPanelTabs'),
        paragraphHeight: '#paragraph-height',
        paragraphWidth: '#paragraph-width',
        paragraphStyle: '#paragraph-style',
        tab: '#propertiesPanelTabs ul li',
        activeTab: '.k-state-active',
        formSchema: 'formSchema',
        paragraphStyleValue: 'paragraphStyleValue',
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
        selectedControls: '.grid_container .ui-selected, .hidden-workspace .ui-selected',
        workspaceAndHiddenSelectedControls: '.new-Control.ui-selected',
        panelControlIdInput: '#panel-controlId',
        imageControlIdInput: 'input#control-id',
        imageSize: '#imageSizeSlider',
        imageSource: '#linkedPanelProperty',
        imageHoverText: '#imageHoverText',
        imageStyle: '#imageStyle',
        tabIndex: '#control-tabIndex',
        buttonText: '#control-button-text',
        hoverText: '#control-hover-text',
        buttonStyle: '#button-style',
        buttonControlIdInput: '#control-controlId'
    };

    var TAB_TYPE_CONST = {
        appearance: 0,
        behavior: 1,
        css: 2
    };

    function resetPropertyPanel() {
        $(propertyPanelConstant.selectedControls).fadeTo('fast', 1);
        propertyPanelConstant.controlId = SCHEMA_CONST.container;
    }

    function initPropertyPanel() {
        $(propertyPanelConstant.searchBox).keyup(function () {
            var val = $(propertyPanelConstant.searchBox).val(),
              logic = 'or',
              filters = [
                {
                    field: 'Title',
                    operator: 'contains',
                    value: val
                },
                {
                    field: 'LastModifiedBy',
                    operator: 'contains',
                    value: val
                }
              ];
            interaction.filterGrid(propertyPanelConstant.grid, logic, filters);
        });
        //Define cog button click event - open the property panel
        $(propertyPanelConstant.cog).click(function () {
            loadPropertyPanelForControl(controlTypes.form, null);
        });

        //Define Close button click event - close the property panel
        $(propertyPanelConstant.cancel).click(function () {
            resetPropertyPanel();
            expandOrCollapsePropertiesPanel(false);
            workspace.removeAllControlsSelection();
        });

        $(propertyPanelConstant.apply).click(function () {
            toggleApplyText(true);
        });

        $(propertyPanelConstant.clear).click(function () {
            toggleApplyText(false);
        });
        storage.setStorageType(workspace.sessionStorage);
    }

    function toggleApplyText(isApplyClicked) {
        var grid = interaction.createGrid(propertyPanelConstant.grid), textValue;
        if (isApplyClicked) {
            var item = grid.dataItem(grid.select());
            textValue = item.Title;
        }
        else {
            grid.clearSelection();
            textValue = 'None';
        }
        $(propertyPanelConstant.linked).text(textValue);
    }

    function onSelect(e) {
        var selectedIndex = $(e.item).index();
        loadTabContent(selectedIndex, isNewControlSelected);
    }

    function setTabStrip(tabIndexToSelect, tabIndexToHide) {
        var tabStrip = interaction.createTabStrip(propertyPanelConstant.tabDivs);
        /*Create tab strip*/
        tabStrip.bind('select', onSelect);
        $(tabStrip.items()).show();
        /*Initially show all tabs and then hide tab*/
        tabStrip.tabGroup.children('li').removeClass().addClass(hideBehaviourTabForGridSelection(tabStrip, tabIndexToHide));
        tabStrip.select(tabIndexToSelect);
        /*Select desired tab*/
    }

    function hideBehaviourTabForGridSelection(tabStrip, tabIndexToHide) {
        if (tabIndexToHide) {
            $(tabStrip.items()[tabIndexToHide]).hide();
            /* If Grid panel is selected*/
            return 'twoTabs';
        }
        else {
            return 'threeTabs';
        }
    }

    function hideAllTabs() {
        $(propertyPanelConstant.appearanceTabDiv).hide();
        $(propertyPanelConstant.behaviourTabDiv).hide();
        $(propertyPanelConstant.cssTabDiv).hide();
    }

    function setControlId(isNewControlSelected, ctrlId) {
        return isNewControlSelected ? propertyPanelConstant.controlId : ($(propertyPanelConstant.controlIdInput).val() || ctrlId);
    }

    function showTab(selectedTab) {
        if (selectedTab === TAB_TYPE_CONST.appearance) {
            $(propertyPanelConstant.appearanceTabDiv).show();
        }
        else if (selectedTab === TAB_TYPE_CONST.behavior) {
            $(propertyPanelConstant.behaviourTabDiv).show();
        }
        else {
            $(propertyPanelConstant.cssTabDiv).show();
        }
    }

    function hideTab(selectedTab) {
        if (selectedTab === TAB_TYPE_CONST.appearance) {
            $(propertyPanelConstant.appearanceTabDiv).hide();
        }
        else if (selectedTab === TAB_TYPE_CONST.behavior) {
            $(propertyPanelConstant.behaviourTabDiv).hide();
        }
        else {
            $(propertyPanelConstant.cssTabDiv).hide();
        }
    }

    function loadImageControl(selectedTab, controlPropertiesData) {
        var imageStructure = {
            Image: builder.image.imageContent
        }, imageContent;

        loadOptions = {
            type: controlTypes.imageCtrl,
            isCssReadOnly: false
        };

        propertyPanel.propertiesFromSchema = {
            controlId: setControlId(isNewControlSelected, controlPropertiesData.id),
            enabled: controlEnabledSt || controlPropertiesData.enabled
        };

        setPropertiesToControlFromSchema(propertyPanel.propertiesFromSchema);

        if (selectedTab === TAB_TYPE_CONST.appearance) {
            //TODO: below will get removed once image appearance gets completed.
            $(propertyPanelConstant.appearanceTabDiv).children().remove();
        }
        else if (selectedTab === TAB_TYPE_CONST.behavior) {
            loadOptions.container = propertyPanelConstant.behaviourTabDiv;
            loadOptions.tabType = tabNames.behavior;
            var imageType = !loadOptions.subType ? loadOptions.type : loadOptions.subType;
            imageContent = imageStructure[imageType];
            controlProperties.load(imageContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);
            setPropertyValuesToControl(loadOptions.type);
        } else {
            loadOptions.tabType = tabNames.cssStyle;
            loadOptions.isCssReadOnly = true;
            //TODO: below will get removed once image css gets completed.
            $(propertyPanelConstant.cssTabDiv).children().remove();
        }
    }

    function loadParagraphControl(selectedTab, controlPropertiesData) {
        var paragraphStructure = {
            Paragraph: builder.paragraph.paragraphContent
        };
        var paragraphContent, paragraphProperties = builder.paragraph;

        loadOptions = {
            type: controlTypes.paragraph,
            isCssReadOnly: false
        };
        propertyPanel.propertiesFromSchema = {
            paragraphHeight: ($(propertyPanelConstant.paragraphHeight).val() || '') || controlPropertiesData.Properties.ui.height,
            paragraphWidth: ($(propertyPanelConstant.paragraphWidth).val() || '') || controlPropertiesData.Properties.ui.width,
            paragraphStyle: controlPropertiesData.Properties.ui['class'] || paragraphProperties.paragraphData[0].text,
            paragraphStyleValue: controlPropertiesData.Properties.ui['paragraphStyleValue'],
            controlHoverText: controlPropertiesData.Properties.ui.title || '',
            controlId: propertyPanelConstant.controlId,
            enabled: true
        };

        setPropertiesToControlFromSchema(propertyPanel.propertiesFromSchema);

        if (selectedTab === TAB_TYPE_CONST.appearance) {
            loadOptions.container = propertyPanelConstant.appearanceTabDiv;
            loadOptions.tabType = tabNames.appearance;
            paragraphContent = paragraphStructure[loadOptions.type];
            controlProperties.load(paragraphContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);
            interaction.initDropDown(propertyPanelConstant.paragraphStyle, paragraphProperties.paragraphData);
            setPropertyValuesToControl(loadOptions.type);
        } else if (selectedTab === TAB_TYPE_CONST.behavior) {
            loadOptions.container = propertyPanelConstant.behaviourTabDiv;
            loadOptions.tabType = tabNames.behavior;
            paragraphContent = paragraphStructure[loadOptions.type];
            controlProperties.load(paragraphContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);
            setPropertyValuesToControl(loadOptions.type);
        } else {
            //TODO: below will get removed once image css gets completed.
            $(propertyPanelConstant.cssTabDiv).children().remove();
        }
    }

    function loadMultiLineTextboxControl(selectedTab, controlPropertiesData) {
        var multilineTextBoxStructure = {
            MultilineTextBox: builder.multilineTextBox.multilineTextBoxContent
        };

        var multilineTextBoxContent, textAreaProperties = builder.multilineTextBox;
        loadOptions = {
            type: controlTypes.multilineTextBox,
            isCssReadOnly: false
        };

        propertyPanel.propertiesFromSchema = {
            controlId: propertyPanelConstant.controlId,
            tabIndex: '0',
            enabled: true
        };

        setPropertiesToControlFromSchema(propertyPanel.propertiesFromSchema);
        if (selectedTab === TAB_TYPE_CONST.appearance) {
            loadOptions.container = propertyPanelConstant.appearanceTabDiv;
            loadOptions.tabType = tabNames.appearance;
            multilineTextBoxContent = multilineTextBoxStructure[loadOptions.type];
            controlProperties.load(multilineTextBoxContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);
            interaction.initDropDown(propertyPanelConstant.textAreaStyle, textAreaProperties.multilineTextBoxData);
            interaction.initDropDown(propertyPanelConstant.textAreaLabelPosition, textAreaProperties.multilineTextBoxStyle);
            setPropertyValuesToControl(loadOptions.type);

        } else if (selectedTab === TAB_TYPE_CONST.behavior) {
            loadOptions.container = propertyPanelConstant.behaviourTabDiv;
            loadOptions.tabType = tabNames.behavior;
            multilineTextBoxContent = multilineTextBoxStructure[loadOptions.type];
            controlProperties.load(multilineTextBoxContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);

            interaction.initDropDown(propertyPanelConstant.fieldSource, textAreaProperties.fieldSource);
            interaction.initDropDown(propertyPanelConstant.lockIconPosition, textAreaProperties.lockIconPosition);
            interaction.initDropDown(propertyPanelConstant.addressBookControlId, textAreaProperties.addressBookControlId);
            interaction.initDropDown(propertyPanelConstant.addressBookField, textAreaProperties.addressBookField);
            setPropertyValuesToControl(loadOptions.type);
        } else {
            loadOptions.tabType = tabNames.cssStyle;
            loadOptions.isCssReadOnly = true;
            //TODO: below will get removed once image css gets completed.
            $(propertyPanelConstant.cssTabDiv).children().remove();
        }
    }

    function loadTextboxControl(selectedTab, controlPropertiesData) {
        var textInputFieldStructure = {
            TextBox: builder.textInput.textInputFieldContent
        };
        var textInputFieldContent, textInputFieldProperties = builder.textInput;
        loadOptions = {
            type: controlTypes.textBox,
            isCssReadOnly: false
        };

        propertyPanel.propertiesFromSchema = {
            controlId: propertyPanelConstant.controlId,
            tabIndex: '0',
            enabled: true,
            textBoxWidth: ($(propertyPanelConstant.inputTextWidth).val() || '') || controlPropertiesData.Properties.ui.width,
            controlHoverText: controlPropertiesData.Properties.ui.hoverText || '',
            controlHelpKey: controlPropertiesData.Properties.ui.helpKey || '',
            maxCharacter: controlPropertiesData.Properties.ui.maxChar,
            controlLabel: controlPropertiesData.Properties.ui.label,
            controlStyle: controlPropertiesData.Properties.ui.controlStyle || textInputFieldProperties.inputTextBoxData[0].text,
            controlStyleValue: controlPropertiesData.Properties.ui.controlStyleValue || '',
            controlPosition: controlPropertiesData.Properties.ui.labelPosition || textInputFieldProperties.inputTextBoxStyle[0].text,
            controlPositionValue: controlPropertiesData.Properties.ui.controlPositionValue || ''
        };

        setPropertiesToControlFromSchema(propertyPanel.propertiesFromSchema);

        if (selectedTab === TAB_TYPE_CONST.appearance) {
            loadOptions.container = propertyPanelConstant.appearanceTabDiv;
            loadOptions.tabType = tabNames.appearance;
            textInputFieldContent = textInputFieldStructure[loadOptions.type];
            controlProperties.load(textInputFieldContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);
            interaction.initDropDown(propertyPanelConstant.textInputStyle, textInputFieldProperties.inputTextBoxData);
            interaction.initDropDown(propertyPanelConstant.inputTextPosition, textInputFieldProperties.inputTextBoxStyle);
            setPropertyValuesToControl(loadOptions.type);

        } else if (selectedTab === TAB_TYPE_CONST.behavior) {
            loadOptions.container = propertyPanelConstant.behaviourTabDiv;
            loadOptions.tabType = tabNames.behavior;
            textInputFieldContent = textInputFieldStructure[loadOptions.type];
            controlProperties.load(textInputFieldContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);

            interaction.initDropDown(propertyPanelConstant.textInputFieldSource, textInputFieldProperties.fieldSource);
            interaction.initDropDown(propertyPanelConstant.textInputlockIconPosition, textInputFieldProperties.lockIconPosition);
            interaction.initDropDown(propertyPanelConstant.addressBookControlId, textInputFieldProperties.addressBookControlId);
            interaction.initDropDown(propertyPanelConstant.addressBookField, textInputFieldProperties.addressBookField);
            setPropertyValuesToControl(loadOptions.type);
        }
        else {
            //TODO: below will get removed once image css gets completed.
            $(propertyPanelConstant.cssTabDiv).children().remove();
        }
    }

    function loadButtonControl(selectedTab, controlPropertiesData) {
        var buttonStructure = {
            Button: builder.button.buttonContent
        };

        var buttonContent, buttonProperties = builder.button,
          loadOptions = {
              type: controlTypes.button,
              isCssReadOnly: false
          };

        propertyPanel.propertiesFromSchema = {
            buttonType: propertyPanelConstant.controlType,
            buttonStyle: controlPropertiesData.Properties.ui['class'] || buttonProperties.buttonStyle[0].text,
            controlButtonText: controlPropertiesData.Properties.ui.value || '',
            controlHoverText: controlPropertiesData.Properties.ui.title || '',
            controlId: setControlId(isNewControlSelected, controlPropertiesData.id),
            tabIndex: $(propertyPanelConstant.controlTabIndex).val() || controlPropertiesData.tabIndex || '0',
            enabled: controlEnabledSt || controlPropertiesData.enabled,
            subButtonType: controlPropertiesData.Properties.ui.buttonType,
            selectedButtonId: controlPropertiesData.Properties.ui.selectedButtonId || '',
            selectedButtonText: controlPropertiesData.Properties.ui.selectedButtonText || '',
            buttonStyleValue: controlPropertiesData.Properties.ui.buttonStyleValue || '',
            buttonTypeValue: controlPropertiesData.Properties.ui.buttonTypeValue || ''
        };

        propertiesFromSchema = propertyPanel.propertiesFromSchema;

        setPropertiesToControlFromSchema(propertiesFromSchema);

        if (selectedTab === TAB_TYPE_CONST.appearance) {
            loadOptions.container = propertyPanelConstant.appearanceTabDiv;
            loadOptions.tabType = tabNames.appearance;
            buttonContent = buttonStructure[loadOptions.type];
            controlProperties.load(buttonContent[loadOptions.tabType].items, loadOptions.container, propertyPanel.propertiesFromSchema);
            interaction.initDropDown(propertyPanelConstant.buttonType, buttonProperties.buttonData);
            interaction.initDropDown(propertyPanelConstant.buttonStyle, buttonProperties.buttonStyle);
            if (propertiesFromSchema.subButtonType === buttonTypes.standardButton) {
                controlProperties.load(buttonProperties.standardButtonContent[loadOptions.tabType].items,
                  propertyPanelConstant.standardBtnContainer, propertiesFromSchema);

                onDropDownOptionChange(buttonProperties, loadOptions, propertiesFromSchema.buttonType, null,
                  propertiesFromSchema.subButtonType);
            }

            bindEventToDropdown(buttonProperties, loadOptions, propertiesFromSchema.buttonType, propertyPanelConstant.buttonType);
            setPropertyValuesToControl(loadOptions.type);
        } else if (selectedTab === TAB_TYPE_CONST.behavior) {
            loadOptions.container = propertyPanelConstant.behaviourTabDiv;
            loadOptions.tabType = tabNames.behavior;
            loadOptions.subType = undefined;
            var buttonType = !loadOptions.subType ? loadOptions.type : loadOptions.subType;
            buttonContent = buttonStructure[buttonType];
            controlProperties.load(buttonContent[loadOptions.tabType].items, loadOptions.container, propertyPanel.propertiesFromSchema);
            setPropertyValuesToControl(loadOptions.type);
        } else {
            loadOptions.tabType = tabNames.cssStyle;
            loadOptions.isCssReadOnly = true;
            //TODO: below will get removed once image css gets completed.
            $(propertyPanelConstant.cssTabDiv).children().remove();
        }
    }

    function loadDropdownControl(selectedTab, controlPropertiesData) {
        var dropdownStructure = {
            Dropdown: builder.dropdown.dropdownContent
        },
          dropdownProperties = builder.dropdown,
          dropdownFieldProperties = builder.dropdown, dropdownContent;

        loadOptions = {
            type: controlTypes.dropdown,
            isCssReadOnly: false
        };

        propertyPanel.propertiesFromSchema = {
            controlId: propertyPanelConstant.controlId,
            tabIndex: '0',
            enabled: true
        };

        setPropertiesToControlFromSchema(propertyPanel.propertiesFromSchema);

        if (selectedTab === TAB_TYPE_CONST.appearance) {
            loadOptions.container = propertyPanelConstant.appearanceTabDiv;
            loadOptions.tabType = tabNames.appearance;
            dropdownContent = dropdownStructure[loadOptions.type];
            controlProperties.load(dropdownContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);
            interaction.initDropDown(propertyPanelConstant.dropdownType, dropdownProperties.dropdownType);
            interaction.initDropDown(propertyPanelConstant.dropdownStyle, dropdownProperties.dropdownStyle);
            interaction.initDropDown(propertyPanelConstant.dropdownLabelPosition, dropdownProperties.dropdownLabelPosition);
        }
        else if (selectedTab === TAB_TYPE_CONST.behavior) {
            loadOptions.container = propertyPanelConstant.behaviourTabDiv;
            loadOptions.tabType = tabNames.behavior;
            dropdownContent = dropdownStructure[loadOptions.type];
            controlProperties.load(dropdownContent[loadOptions.tabType].items, loadOptions.container,
              propertyPanel.propertiesFromSchema);

            interaction.initDropDown(propertyPanelConstant.dropDownFieldSource, dropdownFieldProperties.fieldSource);
            setPropertyValuesToControl(loadOptions.type);
        }
        else {
            dropdownContent = dropdownStructure[loadOptions.type];
            openCssStyleTab(loadOptions, controlProperties, dropdownContent);
        }
    }

    function getFormattedText(type) {
        var container = type.replace(' ', '');
        return container.substring(0, 1).toLowerCase() + container.substring(1);
    }

    function loadPanelControl(selectedTab, controlPropertiesData) {
        var selectedControl = false;

        if (previousSelectedControl === '' || previousSelectedControl === propertyPanelConstant.controlId) {
            selectedControl = true;
        }
        var panelStructure = {
            Panel: builder.container.panel
        },

          panelProperties = builder.container, panelContent;
        var selectedContainerType = interaction.getDropDownList(propertyPanelConstant.containerType);
        loadOptions = {
            type: controlTypes.panel,
            isCssReadOnly: false
        };

        propertyPanel.propertiesFromSchema = {
            containerType: propertyPanelConstant.controlType,
            containerTypeValue: controlPropertiesData.Properties.ui.containerTypeValue,
            panelStyleValue: controlPropertiesData.Properties.ui.panelStyleValue,
            width: controlPropertiesData.Properties.ui.width || '',
            height: controlPropertiesData.Properties.ui.height || '',
            controlId: setControlId(isNewControlSelected, controlPropertiesData.id),
            enabled: controlEnabledSt || controlPropertiesData.enabled,
            subContainerType: controlPropertiesData.Properties.ui.containerType,
            groupBoxHeader: controlPropertiesData.Properties.ui.groupBoxHeader,
            groupBoxHeaderStyleValue: controlPropertiesData.Properties.ui.groupBoxHeaderStyleValue,
            groupBoxStyleValue: controlPropertiesData.Properties.ui.groupBoxStyleValue,
            categoryBoxHeader: controlPropertiesData.Properties.ui.categoryBoxHeader,
            categoryBoxHeaderStyleValue: controlPropertiesData.Properties.ui.categoryBoxHeaderStyleValue,
            categoryBoxStyleValue: controlPropertiesData.Properties.ui.categoryBoxStyleValue

        };
        propertiesFromSchema = propertyPanel.propertiesFromSchema;

        setPropertiesToControlFromSchema(propertiesFromSchema);
        if (selectedContainerType && selectedControl) {
            var dropdownSelectedContainer = selectedContainerType.text();
            var containerType = getFormattedText(dropdownSelectedContainer);
            panelStructure.Panel = builder.container[containerType];
        } else {

            if (controlPropertiesData.id === propertyPanelConstant.controlId && controlPropertiesData.Properties.ui.containerType) {
                var type = controlPropertiesData.Properties.ui.containerType;
                var container = getFormattedText(type);
                panelStructure.Panel = builder.container[container];
            }
            loadOptions.container = propertyPanelConstant.appearanceTabDiv;
            var appearanceTab = tabNames.appearance;
            loadOptions.tabType = appearanceTab;
            panelContent = panelStructure[loadOptions.type];
            loadTab(appearanceTab, panelContent);

            interaction.initDropDown(propertyPanelConstant.containerType, panelProperties.containerType);
            interaction.initDropDown(propertyPanelConstant.panelStyle, panelProperties.panelStyle);
            interaction.initDropDown(propertyPanelConstant.containerCategoryStyle, panelProperties.containerCategoryStyle);
            interaction.initDropDown(propertyPanelConstant.containerHeaderStyle, panelProperties.containerHeaderStyle);

            loadOptions.container = propertyPanelConstant.behaviourTabDiv;
            loadOptions.tabType = tabNames.behavior;
            panelContent = panelStructure[loadOptions.type];

            loadTab(loadOptions.tabType, panelContent);
            setPropertyValuesToControl(loadOptions.type);
            $(SCHEMA_CONST.panelControlIdInput).val(propertyPanel.propertiesFromSchema.controlId);
            bindEventToDropdown(panelProperties, loadOptions, propertiesFromSchema.containerType, propertyPanelConstant.containerType);
        }

        if (selectedTab === TAB_TYPE_CONST.appearance) {
            $(propertyPanelConstant.appearanceTabDiv).show();
            loadOptions.tabType = tabNames.appearance;
            loadOptions.container = propertyPanelConstant.appearanceTabDiv;
        } else if (selectedTab === TAB_TYPE_CONST.behavior) {
            $(propertyPanelConstant.behaviourTabDiv).show();
            loadOptions.container = propertyPanelConstant.behaviourTabDiv;
            loadOptions.tabType = tabNames.behavior;
        }
        else {
            panelContent = panelStructure[loadOptions.type];
            openCssStyleTab(loadOptions, controlProperties, panelContent);
        }
    }

    function loadTabContent(selectedTab) {
        var propertyPanelConstant = builder.constant.propertyPanelConstant;

        hideAllTabs();
        /*Hide all divs*/
        showTab(selectedTab);

        var controlPropertiesData = getPropertiesFromSchema(propertyPanelConstant.controlId);

        switch (propertyPanelConstant.controlType) {
            //This will load content for Grid Panel control
            case controlTypes.gridPanel:
                //TODO: write code when grid appearance & behaviour story comes and remove below hideAllTabs() function call.
                hideAllTabs();
                /*Hide all divs*/
                break;
            case controlTypes.imageCtrl:
                loadImageControl(selectedTab, controlPropertiesData);
                break;
            case controlTypes.paragraph:
                loadParagraphControl(selectedTab, controlPropertiesData);
                break;
            case controlTypes.multilineTextBox:
                loadMultiLineTextboxControl(selectedTab, controlPropertiesData);
                break;
            case controlTypes.textBox:
                loadTextboxControl(selectedTab, controlPropertiesData);
                break;
            case controlTypes.button:
                loadButtonControl(selectedTab, controlPropertiesData);
                break;
            case controlTypes.dropdown:
                loadDropdownControl(selectedTab, controlPropertiesData);
                break;
            case controlTypes.panel:
                loadPanelControl(selectedTab, controlPropertiesData);
                break;
            default:
                //TODO: write code when grid appearance & behaviour story comes and remove below hideAllTabs() function call.
                hideAllTabs();
                /*Hide all divs*/
                break;
        }
    }

    function loadTab(tabName, panelContent) {
        controlProperties.load(panelContent[tabName].items, loadOptions.container,
          propertyPanel.propertiesFromSchema);
    }

    function openCssStyleTab(loadOptions, controlProperties, controlContent) {
        loadOptions.container = propertyPanelConstant.cssTabDiv;
        loadOptions.tabType = tabNames.cssStyle;
        controlProperties.load(controlContent[loadOptions.tabType].items, loadOptions.container,
          propertyPanel.propertiesFromSchema);
    }

    Object.defineProperty(loadControlValues, 'propertiesFromSchema', {
        get: function () {
            return loadControlValues;
        },
        set: function (newValue) {
            loadControlValues = newValue;
        },
        enumerable: true,
        configurable: true
    });

    function bindEventToDropdown(controProperties, loadOptions, ctrlType, eventToControl) {

        var controlDropDown = interaction.getDropDownList(eventToControl);
        controlDropDown.bind('change', function () {
            onDropDownOptionChange(controProperties, loadOptions, ctrlType, this);
        });
    }

    function onDropDownOptionChange(ctrlProperties, loadOptions, ctrlType, dropDownRef, dropdownControl) {
        switch (ctrlType) {
            case 'Button':
                {
                    var buttonTypeSelected = dropDownRef ? dropDownRef.text() : dropdownControl;
                    if (buttonTypeSelected === buttonTypes.standardButton) {
                        controlProperties.load(ctrlProperties.standardButtonContent[loadOptions.tabType].items,
                          propertyPanelConstant.standardBtnContainer, propertyPanel.propertiesFromSchema);
                        $(propertyPanelConstant.standardBtnSelectedText).text('none');
                        if (propertiesFromSchema.subButtonType === buttonTypes.standardButton) {
                            setPropertyValuesToControl(loadOptions.type);
                        }
                        $(propertyPanelConstant.standardBtnClass).on('click', function (e) {
                            var currentBtnId = '#' + e.currentTarget.id;
                            var btnText = $(currentBtnId).attr('name');
                            $(propertyPanelConstant.standardBtnClass).removeClass(propertyPanelConstant.btnActiveClass);
                            $(currentBtnId).addClass(propertyPanelConstant.btnActiveClass);
                            $(propertyPanelConstant.standardBtnSelectedText).text(btnText);
                        });
                    } else {
                        controlProperties.clearProperties(propertyPanelConstant.standardBtnContainer);
                    }
                    break;
                }
            case 'Panel':
                {
                    var selectedContainer = dropDownRef ? dropDownRef.text() : dropdownControl;
                    var containerType = getFormattedText(selectedContainer);
                    controlProperties.load(ctrlProperties[containerType][loadOptions.tabType].items,
                      loadOptions.container, propertyPanel.propertiesFromSchema);

                    interaction.initDropDown(propertyPanelConstant.containerStyle, ctrlProperties.containerStyle);
                    interaction.initDropDown(propertyPanelConstant.containerCategoryStyle, ctrlProperties.containerCategoryStyle);
                    interaction.initDropDown(propertyPanelConstant.containerHeaderStyle, ctrlProperties.containerHeaderStyle);
                    interaction.initDropDown(propertyPanelConstant.containerType, ctrlProperties.containerType);
                    interaction.getDropDownList(propertyPanelConstant.containerType).value(dropDownRef.value());
                    bindEventToDropdown(ctrlProperties, loadOptions, propertiesFromSchema.containerType, propertyPanelConstant.containerType);
                    interaction.initDropDown(propertyPanelConstant.panelStyle, ctrlProperties.panelStyle);
                    controlProperties.load(ctrlProperties[containerType][tabNames.behavior].items,
                      propertyPanelConstant.behaviourTabDiv, propertyPanel.propertiesFromSchema);
                    $(SCHEMA_CONST.panelControlIdInput).val(propertyPanel.propertiesFromSchema.controlId);
                }
        }
    }

    function setPropertiesToControlFromSchema(propertiesFromSchema) {
        propertyPanel = builder.propertyPanel;
        propertyPanel.propertiesFromSchema = propertiesFromSchema;
    }

    function getPropertiesFromSchema(ctrlId) {
        var workspaceConstant = builder.constant.workSpaceConstant,
          inputFormSchema, control, controlSchema;

        storage.setStorageType(workspaceConstant.sessionStorage);
        inputFormSchema = storage.getItem(workspaceConstant.formSchema);

        for (control in inputFormSchema.Controls) {
            if (inputFormSchema.Controls[control].id === ctrlId) {
                controlSchema = inputFormSchema.Controls[control];
                break;
            }
        }
        return controlSchema;
    }

    function setPropertyValuesToControl(ctrlType) {
        switch (ctrlType) {
            case controlTypes.imageCtrl:
                $(propertyPanelConstant.controlIdInput).val(propertyPanel.propertiesFromSchema.controlId);
                interaction.setValueToSwitch(propertyPanelConstant.enabledControl, propertyPanel.propertiesFromSchema.enabled);
                break;

            case controlTypes.multilineTextBox:
            case controlTypes.textBox:
                interaction.setValueToDropDown(propertyPanelConstant.textInputStyle, propertyPanel.propertiesFromSchema.controlStyleValue);
                interaction.setValueToDropDown(propertyPanelConstant.inputTextPosition, propertyPanel.propertiesFromSchema.controlPositionValue);
                $(propertyPanelConstant.inputTextLabel).val(propertyPanel.propertiesFromSchema.controlLabel);
                $(propertyPanelConstant.inputTextHover).val(propertyPanel.propertiesFromSchema.controlHoverText);
                $(propertyPanelConstant.inputTextHelpKey).val(propertyPanel.propertiesFromSchema.controlHelpKey);

                $(propertyPanelConstant.inputTextMaxChar).val(propertyPanel.propertiesFromSchema.maxCharacter);
                $(propertyPanelConstant.inputTextWidth).val(propertyPanel.propertiesFromSchema.textBoxWidth);
                break;
            case controlTypes.dropdown:
                $(propertyPanelConstant.controlIdInput).val(propertyPanel.propertiesFromSchema.controlId);
                $(propertyPanelConstant.controlTabIndex).val(propertyPanel.propertiesFromSchema.tabIndex);
                break;

            case controlTypes.paragraph:
                interaction.setValueToDropDown(propertyPanelConstant.paragraphStyle, propertiesFromSchema.paragraphStyleValue);
                $(propertyPanelConstant.paragraphHeight).val(propertyPanel.propertiesFromSchema.paragraphHeight);
                $(propertyPanelConstant.paragraphWidth).val(propertyPanel.propertiesFromSchema.paragraphWidth);
                $(propertyPanelConstant.controlHoverText).val(propertyPanel.propertiesFromSchema.controlHoverText);
                $(propertyPanelConstant.controlIdInput).val(propertyPanel.propertiesFromSchema.controlId);

                break;
            case controlTypes.button:
                interaction.setValueToDropDown(propertyPanelConstant.buttonType, propertiesFromSchema.buttonTypeValue);
                interaction.setValueToDropDown(propertyPanelConstant.buttonStyle, propertiesFromSchema.buttonStyleValue);
                if (propertiesFromSchema.subButtonType === buttonTypes.standardButton) {
                    $('#' + propertyPanel.propertiesFromSchema.selectedButtonId).addClass(propertyPanelConstant.btnActiveClass);
                    $(propertyPanelConstant.standardBtnSelectedText).text(propertiesFromSchema.selectedButtonText);
                }
                $(propertyPanelConstant.controlHoverText).val(propertiesFromSchema.controlHoverText);
                $(propertyPanelConstant.controlButtonText).val(propertiesFromSchema.controlButtonText);
                $(propertyPanelConstant.controlIdInput).val(propertiesFromSchema.controlId);
                interaction.setValueToSwitch(propertyPanelConstant.enabledControl, propertiesFromSchema.enabled);
                $(propertyPanelConstant.controlTabIndex).val(propertiesFromSchema.tabIndex);
                break;

            case controlTypes.panel:
                interaction.setValueToDropDown(propertyPanelConstant.containerType, propertiesFromSchema.containerTypeValue);
                if (propertiesFromSchema.subContainerType === containerTypes.groupBox) {
                    interaction.getDropDownList(propertyPanelConstant.containerStyle).value(propertiesFromSchema.groupBoxStyleValue);
                    interaction.getDropDownList(propertyPanelConstant.containerHeaderStyle).value(propertiesFromSchema.groupBoxHeaderStyleValue);
                    $(propertyPanelConstant.groupHeader).val(propertiesFromSchema.groupBoxHeader);
                }
                else if (propertiesFromSchema.subContainerType === containerTypes.categoryBox) {
                    interaction.setValueToDropDown(propertyPanelConstant.containerCategoryStyle).value(propertiesFromSchema.categoryBoxStyleValue);
                    interaction.setValueToDropDown(propertyPanelConstant.containerHeaderStyle, propertiesFromSchema.categoryBoxHeaderStyleValue);
                    $(propertyPanelConstant.categoryHeader).val(propertiesFromSchema.categoryBoxHeader);
                }
                else {
                    interaction.setValueToDropDown(propertyPanelConstant.panelStyle, propertiesFromSchema.panelStyleValue);
                }

                $(propertyPanelConstant.paragraphWidth).val(propertiesFromSchema.width);
                $(propertyPanelConstant.paragraphHeight).val(propertiesFromSchema.height);
                $(propertyPanelConstant.panelControlId).val(propertiesFromSchema.controlId);
                break;
        }
    }

    function expandOrCollapsePropertiesPanel(isExpand) {
        if (isExpand) {
            $(propertyPanelConstant.container).show('slide', { direction: 'right' }, propertyPanelConstant.delay);
            //select first tab by default
            interaction.createTabStrip(propertyPanelConstant.tabDivs).select(' li:first');
        }
        else {
            $(propertyPanelConstant.container).hide('slide', { direction: 'right' }, propertyPanelConstant.delay);
        }
    }

    //This function opens property panel and set tabs and
    //this will be called in order to open property panel on click of any control. Also need to add
    // controlId parameter to this
    function loadPropertyPanelForControl(controlType) {
        //Tab 0 - appearance, Tab 1- behavior, Tab - 2 Css
        propertyPanelConstant.controlType = controlType;
        var selectedTab, noOfTabs, tabIndexToHide;
        switch (controlType) {
            case controlTypes.gridPanel:
                selectedTab = 0;
                //For Grid Panel only two tabs needs to be shown
                noOfTabs = 2;
                //Hide Appearance tab
                tabIndexToHide = 1;
                break;
            default:
                //This is default loading of PropertyPanel
                selectedTab = 0;
                //For Grid Panel only two tabs needs to be shown
                noOfTabs = 3;
                tabIndexToHide = null;
                break;
        }
        setTabStrip(selectedTab, tabIndexToHide);
        expandOrCollapsePropertiesPanel(true);
    }

    function validationCheck(controlId, ctrlGuid, ctrlType) {
        var isValid = true, ctrlIdInput, fieldLabel = [], inputData = [];
        switch (ctrlType) {
            case 'Button':
                var buttonType = interaction.getValueFromDropDown(propertyPanelConstant.buttonType);
                if (buttonType === buttonTypes.standardButton) {
                    isValid = $(propertyPanelConstant.standardBtnClass).hasClass(propertyPanelConstant.btnActiveClass);
                }
                //todo: to make it generic
                if ($(SCHEMA_CONST.buttonControlIdInput).length > 0) {
                    ctrlIdInput = $(SCHEMA_CONST.buttonControlIdInput).val();
                    isValid = builder.validationUpdate.validateControlID(ctrlIdInput, ctrlGuid);
                    if (isValid) {
                        $(SCHEMA_CONST.workspaceAndHiddenSelectedControls).attr('id', ctrlIdInput);
                        propertyPanelConstant.controlId = ctrlIdInput;
                    }
                }
                break;
            case 'Panel':
                var containerType = interaction.getValueFromDropDown(propertyPanelConstant.containerType);
                fieldLabel = ['Height', 'Width'];
                if (containerType === containerTypes.panel) {
                    var panelHeight = $(propertyPanelConstant.paragraphHeight).val();
                    var panelWidth = $(propertyPanelConstant.paragraphWidth).val();
                    inputData = [panelHeight, panelWidth];
                } else if (containerType === containerTypes.groupBox) {
                    var groupBoxHeight = $(propertyPanelConstant.paragraphHeight).val();
                    var groupBoxWidth = $(propertyPanelConstant.paragraphWidth).val();
                    inputData = [groupBoxHeight, groupBoxWidth];
                } else if (containerType === containerTypes.categoryBox) {
                    var categoryHeight = $(propertyPanelConstant.paragraphHeight).val();
                    var categoryWidth = $(propertyPanelConstant.paragraphWidth).val();
                    inputData = [categoryHeight, categoryWidth];
                }
                if ($(propertyPanelConstant.panelControlId).length > 0) {
                    ctrlIdInput = $(propertyPanelConstant.panelControlId).val();
                    isValid = builder.validationUpdate.validateControlID(ctrlIdInput, ctrlGuid);
                    if (isValid) {
                        isValid = builder.validationUpdate.validateInputMeasurement(inputData, fieldLabel);
                    }
                }
                break;
            case 'Paragraph':
                fieldLabel = ['Width', 'Height'];
                var paragraphHeight = $(SCHEMA_CONST.paragraphHeight).val();
                var paragraphWidth = $(SCHEMA_CONST.paragraphWidth).val();
                inputData = [paragraphWidth, paragraphHeight];
                fieldLabel = ['Width'];
                isValid = builder.validationUpdate.validateInputTextMeasurement(inputData, fieldLabel);
                break;
            case 'MultilineTextBox':
                var multilineWidth = $(propertyPanelConstant.textAreaWidth).val();
                fieldLabel = ['Width'];
                isValid = builder.validationUpdate.validateInputTextMeasurement(multilineWidth, fieldLabel);
                break;
            case 'TextBox':
                var inputBox = true;
                var inputBoxWidth = $(propertyPanelConstant.inputTextWidth).val();
                fieldLabel = ['Width'];
                isValid = builder.validationUpdate.validateInputTextMeasurement(inputBoxWidth, fieldLabel);
                fieldLabel = ['Max Characters'];
                var inputBoxMaxChars = $(propertyPanelConstant.inputTextMaxChar).val();
                inputData = [inputBoxMaxChars];
                isValid = builder.validationUpdate.validateInputTextMeasurement(inputData, fieldLabel, inputBox);
                break;

            case 'Dropdown':
                var dropdownWidth = $(propertyPanelConstant.dropdownWidth).val();
                fieldLabel = ['Width'];
                isValid = builder.validationUpdate.validateInputTextMeasurement(dropdownWidth, fieldLabel);
                break;
            default:
                break;
        }

        return isValid;
    }

    function checkNewControlSelected(ctrlId) {
        if (ctrlId) {
            return propertyPanelConstant.controlId !== ctrlId;
        }
        return false;
    }

    return {
        init: function () {
            SCHEMA_CONST.done.click(function () {
                //Todo : assign the selected component's id to this variable.
                var workspaceAndHiddenSelectedControls = $(SCHEMA_CONST.workspaceAndHiddenSelectedControls);
                var controlId = workspaceAndHiddenSelectedControls.attr('id'),
                  ctrlGuid = workspaceAndHiddenSelectedControls.attr('data-cid'),
                  ctrlType = workspaceAndHiddenSelectedControls.attr('controltype');
                if (validationCheck(controlId, ctrlGuid, ctrlType)) {
                    builder.update.updatePropertiesInFormSchema(propertyPanelConstant.controlId, ctrlGuid);
                    expandOrCollapsePropertiesPanel(false);
                    workspace.removeAllControlsSelection();
                    propertyPanelConstant.controlId = $(SCHEMA_CONST.panelControlIdInput).val();
                }
            });

            initPropertyPanel();
            interaction.enableDisableSwitch(propertyPanelConstant.controlStateInput, true);
        },

        getEnabledState: function () {
            return controlEnabledSt;
        },

        loadPropertyPanel: function (controlType, id) {
            isNewControlSelected = checkNewControlSelected(id);
            previousSelectedControl = propertyPanelConstant.controlId;
            if (isNewControlSelected) {
                propertyPanelConstant.controlId = id;
            }
            return loadPropertyPanelForControl(controlType);
        },

        closePropertyPanel: function (isExpand) {
            return expandOrCollapsePropertiesPanel(isExpand);
        },

        setEnabledState: function (state) {
            controlEnabledSt = state;
        }
    };
}());
elli.builder.propertyPanel.init();
