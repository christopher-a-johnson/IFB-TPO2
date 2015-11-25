elli.builder.dropdown = (function () {
  'use strict';
  var content = {
    appearance: {
      items: [
        {
          type: 'section',
          name: 'dropdown_type',
          label: '',
          properties: [
            {
              type: 'select',
              name: 'dropdown-type',
              label: 'Dropdown Type',
              'default': 'Dropdown',
              styleClass: 'linkedProperty',
              controlClass: 'dropdown-style'
            }]
        },
        {
          type: 'fieldset',
          name: 'dropdown_appearance',
          label: 'Dropdown Appearance',
          properties: [
            {
              type: 'select',
              name: 'dropdown-style',
              label: 'Dropdown Style',
              br: 'break',
              styleClass: 'linkedLabelProperty',
              controlClass: 'dropdown-style'
            },
            {
              type: 'text',
              name: 'dropdown-label',
              label: 'Label',
              controlClass: 'dropdown-label',
              placeholder: 'Enter Your Label Here',
              br: 'break',
              styleClass: 'linkedLabelProperty'
            },
            {
              type: 'select',
              name: 'dropdown-labelPosition',
              label: 'Label Position',
              br: 'break',
              styleClass: 'linkedLabelProperty',
              controlClass: 'dropdown-style'
            },
            {
              type: 'text',
              name: 'dropdown-width',
              label: 'Width',
              styleClass: 'linkedLabelProperty',
              controlClass: 'dropdown-width'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'dropdown_help',
          label: 'Dropdown Help',
          properties: [
            {
              type: 'text',
              name: 'dropdown-help-key',
              label: 'Help Key',
              styleClass: 'linkedLabelProperty',
              controlClass: 'dropdown-common'
            }
          ]
        }
      ]
    },
    behavior: {
      items: [
        {
          type: 'fieldset',
          name: 'dropDown_behavior',
          label: 'Dropdown Behavior',
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
          label: 'Dropdown Data',
          properties: [
            {
              type: 'action', name: 'control-field', label: 'Field', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', rightPlaceHolder:'rightPlaceHolder',placeholder: '(Unassigned)'
            },
            {
              type: 'select', name: 'dropdown-fieldSource', label: 'Field Source', 'default': 'em-button',
              styleClass: 'linkedProperty'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'button_data',
          label: 'Dropdown Options',
          properties: []

        },
        {
          type: 'fieldset',
          name: 'dropDownHandlers',
          label: 'Dropdown Handlers',
          properties: [
            {
              type: 'Change', name: 'dropdown-change', label: 'Click', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(None)', rightPlaceHolder:'rightPlaceHolder'
            },
            {
              type: 'DataBind', name: 'dropdown-dataBind', label: 'DataBind', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(Edit Code)', rightPlaceHolder:'rightPlaceHolder'
            },
            {
              type: 'DataCommit', name: 'dropdown-dataCommit', label: 'DataCommit', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(Edit Code)', rightPlaceHolder:'rightPlaceHolder'
            },
            {
              type: 'FocusIn', name: 'dropdown-focusIn', label: 'FocusIn', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(None)', rightPlaceHolder:'rightPlaceHolder'
            },
            {
              type: 'FocusOut', name: 'dropdown-focusOut', label: 'FocusOut', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id', placeholder: '(None)', rightPlaceHolder:'rightPlaceHolder'
            }
          ]
        }
      ]
    },
    css: {
      items: [
        {
          type: 'fieldset',
          name: 'css-editor',
          label: 'CSS',
          properties: [
            {
              type: 'cssEditor',
              label: '',
              editor: 'readOnly'
            }
          ]
        }
      ]
    }
  };

  var dropdownType = [
    {text: 'Dropdown', value: '1'},
    {text: 'Dropdown Edit', value: '2'}
  ];

  var dropdownStyle = [
    {text: 'EM-Dropdown-primary-default', value: '1'},
    {text: 'EM-Standard-Dropdown', value: '2'},
    {text: 'EM-Custom-Dropdown', value: '3'}
  ];

  var dropdownLabelPosition = [
    {text: 'Top', value: '1'},
    {text: 'Left', value: '2'}
  ];
  var fieldSource = [
    {text: 'Current Loan', value: '1'},
    {text: 'Linked Loan', value: '2'},
    {text: 'Other', value: '3'}
  ];

  return {
    dropdownContent: content,
    dropdownType: dropdownType,
    dropdownStyle: dropdownStyle,
    dropdownLabelPosition: dropdownLabelPosition,
    fieldSource: fieldSource
  };
}());
