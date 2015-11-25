/**
 * Created by URandhe on 10/5/2015.
 */
elli.builder.button = (function () {
  'use strict';
  var button = {
    appearance: {
      items: [
        {
          type: 'section',
          name: 'button_type',
          label: '',
          properties: [
            {
              type: 'select', name: 'button-type', label: 'Button Type', 'default': 'em-button',
              styleClass: 'linkedProperty'
            },
            {
              type: 'section', name: 'standard-btn-container', textOnly: 'false',
              styleClass: ''
            }
          ]
        },

        {
          type: 'fieldset',
          name: 'button_appearance',
          label: 'Button Appearance',
          properties: [

            {
              type: 'select', name: 'button-style', label: 'Button Style', 'default': 'em-button', br: 'break',
              styleClass: 'linkedLabelProperty', controlClass: 'button-style'
            },

            {
              type: 'text', name: 'control-button-text', label: 'Button Text', 'default': '',
              placeholder: 'Enter Your Button Text Here', br: 'break', styleClass: 'linkedLabelProperty',
              controlClass: 'hover-textBox'
            },
            {
              type: 'select', name: 'image-position', label: 'Image Position', 'default': 'em-button', br: 'break',
              styleClass: 'linkedLabelProperty', controlClass: 'button-style', isVisible: 'display:none'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'button_help_appearance',
          label: 'Button Help',
          properties: [
            {
              type: 'text', name: 'control-hover-text', label: 'Hover Text', 'default': '', styleClass: 'linkedProperty'
            }
          ]
        }
      ]
    },
    behavior: {
      items: [
        {
          type: 'fieldset',
          name: 'button_behavior',
          label: 'Button Behavior',
          properties: [
            {
              type: 'boolean', name: 'control-enabled', label: 'Enabled', 'default': true,
              styleClass: 'linkedProperty', separator: 'separator', controlClass: 'control-id'
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
        }, {
          type: 'fieldset',
          name: 'button_data',
          label: 'Button Data',
          properties: [
            {
              type: 'action', name: 'control-action', label: 'Action', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'control-id'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'button_handler',
          label: 'Button Handler',
          properties: [
            {
              type: 'click', name: 'control-click', label: 'Click', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'click-handle-input', placeholder: '(None)'
            },
            {
              type: 'submit', name: 'control-submit', label: 'Submit', 'default': '', styleClass: 'linkedProperty',
              controlClass: 'submit-handle-input', placeholder: '(None)'
            }
          ]
        }

      ]
    }
  };

  var imageTextButton = {
    appearance: {
      items: [
        {
          type: 'section',
          name: 'section',
          label: '',
          properties: [
            {
              type: 'select', name: 'button-type', label: 'Button Type', 'default': 'em-button',
              styleClass: 'linkedProperty'
            },
            {
              type: 'select', name: 'button-customType', label: 'Custom Button Type', 'default': 'em-button',
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
          name: 'settings',
          label: 'Button  Behavior',
          properties: [
            {type: 'boolean', name: 'control-enabled', label: 'Enabled', 'default': true},
            {type: 'controlId', name: 'control-controlId', label: 'Control ID', 'default': ''},
            {type: 'tabIndex', name: 'control-tabIndex', label: 'Tab Index', 'default': ''}
          ]
        },
        {
          type: 'fieldset',
          name: 'settings',
          label: 'Button Data',
          properties: [
            {type: 'action', name: 'control-action', label: 'Action', 'default': ''}
          ]
        },
        {
          type: 'fieldset',
          name: 'settings',
          label: 'Button Handler',
          properties: [
            {type: 'click', name: 'control-click', label: 'Click', 'default': ''},
            {type: 'submit', name: 'control-submit', label: 'Submit', 'default': ''}
          ]
        }
      ]
    }
  };

  var standardButton = {
    appearance: {
      items: [
        {
          type: 'section',
          name: 'standard_button',
          properties: [
            {
              type: 'label', name: 'standard-button-text', label: 'Standard Buttons (Select One)',
              styleClass: 'standard-btn-label', labelOnly: 'true'
            },
            {
              type: 'standardButton', name: 'standard-buttons', styleClass: 'linkedProperty',
              inMultiple: [{text: 'Lookup', styleClass: 'standard-btn-holder btn-lookup', value: 1},
                {text: 'Clear', styleClass: 'standard-btn-holder btn-clear', value: 2},
                {text: 'Edit', styleClass: 'standard-btn-holder btn-edit ', value: 3},
                {text: 'Refresh', styleClass: 'standard-btn-holder btn-refresh', value: 4},
                {text: 'Help', styleClass: 'standard-btn-holder btn-help', value: 5},
                {text: 'Calendar', styleClass: 'standard-btn-holder btn-calendar', value: 6},
                {text: 'Alert', styleClass: 'standard-btn-holder btn-alert', value: 7},
                {text: 'Address Book', styleClass: 'standard-btn-holder btn-addressbook', value: 8},
                {text: 'Borrower Link', styleClass: ' standard-btn-holder btn-borrowerlink', value: 9}
              ],
              labelOnly: 'false', textOnly: 'false'

            },
            {
              type: 'label', name: 'selected-text', label: 'Selected : ', 'default': '',
              styleClass: 'selected-btn-text-label', labelOnly: 'true'
            },
            {
              type: 'label', name: 'selected-button-text', id: 'selected-button-text', label: 'none',
              styleClass: 'selected-btn-text', labelOnly: 'true'
            }
          ]
        }
      ]
    }
  };

  var buttonData = [
    {text: 'Button', value: '1'},
    {text: 'Standard Button', value: '2'},
    {text: 'Custom Button', value: '3'}
  ];
  var buttonStyle = [
    {text: 'EM-Button-primary-default', value: '1'},
    {text: 'EM-Standard-Button', value: '2'},
    {text: 'EM-Custom-Button', value: '3'}
  ];
  var customButtonData = [
    {text: 'Image', value: 'Image', parentId: '3'},
    {text: 'Image+Text', value: 'ImageText', parentId: '3'}
  ];


  return {
    standardButtonContent: standardButton,
    buttonContent: button,
    buttonData: buttonData,
    buttonStyle: buttonStyle,
    customButtonData: customButtonData,
    imageTextButtonContent: imageTextButton
  };
}());
