elli.builder.textInput = (function () {
  'use strict';
  var textInputField = {
    appearance: {
      items: [
        {
          type: 'fieldset',
          name: 'text-input-appearance',
          label: '',
          properties: [
            {
              type: 'select',
              name: 'text-input-style',
              label: 'Text Area Input Style',
              'default': 'EM-text-area-input',
              br: 'break',
              styleClass: 'textarea-linkedProperty',
              controlClass: 'text-area-style',
              separator: 'separator'
            },
            {
              type: 'text', name: 'control-inputText', label: 'Label',placeholder: 'Enter Your Label Here', 'default': 'em-text-area-input', br: 'break',
              styleClass: 'linkedProperty'
            },
            {
              type: 'select', name: 'control-labelPosition', label: 'Label Position', 'default': 'Top', br: 'break',
              styleClass: 'linkedProperty', controlClass: 'text-area-style', separator: 'separator'
            },
            {
              type: 'text', name: 'control-widthText', label: 'Width', 'default': '',
              styleClass: 'textarea-linkedProperty', separator: 'separator'
            },
            {
              type: 'text', name: 'control-maxchar-text', label: 'Max Characters', 'default': '',
              styleClass: 'textarea-linkedProperty'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'button_help_appearance',
          label: 'Text Input Help',
          properties: [
            {
              type: 'text',
              name: 'control-hover-input-text',
              label: 'Hover Text',
              'default': '',
              styleClass: 'linkedProperty'
            },
            {
              type: 'text',
              name: 'control-hover-input-key',
              label: 'Hover Key',
              'default': '',
              styleClass: 'linkedProperty'
            }
          ]
        }
      ]
    },
    behavior: {
      items: [
        {
          type: 'fieldset',
          name: 'textinput_behavior',
          label: 'Text Input Behavior',
          properties: [
            {
              type: 'boolean', name: 'control-enabled', label: 'Enabled', 'default': true,
              styleClass: 'switch_container linkedProperty', separator: 'separator', controlClass: 'control-id'
            },
            {
              type: 'controlId', name: 'control-controlId', label: 'Control ID', 'default': '',
              styleClass: 'linkedProperty', separator: 'separator', controlClass: 'control-id'
            },
            {
              type: 'tabIndex', name: 'control-tabIndex', label: 'Tab Index', 'default': '',
              styleClass: 'linkedProperty', controlClass: 'tab-index'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'button_data',
          label: 'Text Input Data',
          properties: [
            {
              type: 'action', name: 'control-field', label: 'Field', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', rightPlaceHolder: 'rightPlaceHolder'
            },
            {
              type: 'select', name: 'textinput-fieldSource', label: 'Field Source', 'default': 'em-button',
              styleClass: 'linkedProperty'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'fieldLock',
          label: 'Field Lock',
          properties: [
            {
              type: 'boolean', name: 'lockField-enabled', label: 'Lock Field', 'default': true,
              styleClass: 'linkedProperty', controlClass: 'control-id', dimmed: false
            },
            {
              type: 'select', name: 'textinput-lockIconPosition', label: 'Lock Icon Position',
              styleClass: 'linkedProperty'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'zipcodeLookup',
          label: 'Zipcode Lookup',
          properties: [
            {
              type: 'city', name: 'control-city', label: 'City', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(Unassigned)', rightPlaceHolder: 'rightPlaceHolder'
            },
            {
              type: 'state', name: 'control-state', label: 'State', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(Unassigned)', rightPlaceHolder: 'rightPlaceHolder'
            },
            {
              type: 'county', name: 'control-county', label: 'County', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(Unassigned)', rightPlaceHolder: 'rightPlaceHolder'
            }

          ]
        },
        {
          type: 'fieldset',
          name: 'addressBookLink',
          label: 'Address Book Link',
          properties: [
            {
              type: 'select',
              name: 'addressBookControlId',
              label: 'Address Book ControlID',
              styleClass: 'linkedProperty'
            },
            {
              type: 'select', name: 'addressBookField', label: 'Address Book Field', styleClass: 'linkedProperty'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'textInputHandlers',
          label: 'Text Input Handlers',
          properties: [
            {
              type: 'Change', name: 'textinput-change', label: 'Change', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(None)', rightPlaceHolder: 'rightPlaceHolder'
            },
            {
              type: 'DataBind',
              name: 'textinput-dataBind',
              label: 'DataBind',
              'default': '',
              styleClass: 'linkedProperty',
              controlClass: 'control-id',
              placeholder: '(Edit Code)',
              rightPlaceHolder: 'rightPlaceHolder'
            },
            {
              type: 'DataCommit',
              name: 'textinput-dataCommit',
              label: 'DataCommit',
              'default': '',
              styleClass: 'linkedProperty',
              controlClass: 'control-id',
              placeholder: '(Edit Code)',
              rightPlaceHolder: 'rightPlaceHolder'
            },
            {
              type: 'FocusIn', name: 'textinput-focusIn', label: 'FocusIn', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(None)', rightPlaceHolder: 'rightPlaceHolder'
            },
            {
              type: 'FocusOut',
              name: 'textinput-focusOut',
              label: 'FocusOut',
              'default': '',
              styleClass: 'linkedProperty',
              controlClass: 'control-id',
              placeholder: '(None)',
              rightPlaceHolder: 'rightPlaceHolder'
            },
            {
              type: 'Format', name: 'textinput-format', label: 'Format', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(None)', rightPlaceHolder: 'rightPlaceHolder'
            }

          ]
        }
      ]
    }
  };

  var fieldSource = [
    {text: 'Current Loan', value: '1'},
    {text: 'Linked Loan', value: '2'},
    {text: 'Other', value: '3'}
  ];
  var lockIconPosition = [
    {text: 'Left', value: '1'},
    {text: 'Right', value: '2'}
  ];
  var addressBookControlId = [
    {text: '', value: '1'}
  ];
  var addressBookField = [
    {text: 'None', value: '1'}
  ];
  var inputTextBoxData = [
    {text: 'EM-Text-area-input', value: '1'},
    {text: 'Standard text area', value: '2'},
    {text: 'Custom text area', value: '3'}
  ];
  var inputTextBoxStyle = [
    {text: 'Top', value: '1'},
    {text: 'Left', value: '2'}
  ];


  return {
    textInputFieldContent: textInputField,
    fieldSource: fieldSource,
    lockIconPosition: lockIconPosition,
    addressBookControlId: addressBookControlId,
    addressBookField: addressBookField,
    inputTextBoxData: inputTextBoxData,
    inputTextBoxStyle: inputTextBoxStyle
  };
}());
