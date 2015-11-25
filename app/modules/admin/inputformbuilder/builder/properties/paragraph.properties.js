/**
 * Created by URandhe on 10/5/2015.
 */
elli.builder.paragraph = (function(){
  'use strict';
  var paragraph = {
    appearance : {
      items: [
        {
          type: 'fieldset',
          name: 'appearance',
          label: 'Paragraph Appearance',
          properties: [
           /* {
              type: 'label', name: 'control-paragraphLabel', label: 'Paragraph Style',
              styleClass: 'linkedProperty', br: 'break', labelOnly:'true'
            },*/
            {
              type: 'select', name: 'paragraph-style', 'default': 'em-button', br: 'break', label: 'Paragraph Style',
              styleClass: 'linkedLabelProperty', separator:'separator'
            },
            {
              type: 'label', name: 'control-width',  label: 'Height', labelOnly:'true',
              styleClass: 'linkedProperty tab-index'
            },
            {
              type: 'label', name: 'control-height', label: 'Width', labelOnly:'true', styleClass: 'linkedProperty'
            },
            {
              type: 'numeric', name: 'paragraph-height', 'default': '', textOnly:'true', controlClass: 'tab-index paragraph-width'
            },
            {
              type: 'numeric', name: 'paragraph-width', 'default': '', textOnly:'true', controlClass: 'paragraph-width'
            }
          ]
        },
        {
          type: 'fieldset',
          name: 'appearance',
          label: 'Paragraph Help',
          properties: [
            {
              type: 'controlId',
              name: 'control-hover-text',
              label: 'Hover Text',
              styleClass: 'linkedLabelProperty',
              controlClass:'paragraph-HoverText',
              'default': ''
            }
          ]
        }
      ]
    },
    behavior: {
    items: [
      {
        type: 'fieldset',
        name: 'textarea_behavior',
        label: 'Paragraph Behavior',
        properties: [
          {
            type: 'boolean', name: 'control-enabled', label: 'Enabled', 'default': true,
            styleClass: 'switch_container linkedProperty', separator: 'separator', controlClass: 'control-id'
          },
          {
            type: 'controlId', name: 'control-controlId', label: 'Control ID', 'default': '',
            styleClass: 'linkedProperty', controlClass: 'control-id'
          }
        ]
      }
    ]
  }
  };
  var paragraphData=[
    {text: 'EM-paragraph', value: '1'},
    {text: 'EM-paragraph-1', value: '2'},
    {text: 'EM-paragraph-2', value: '3'}
  ];

  return {
    paragraphContent:paragraph,
    paragraphData: paragraphData
  };
}());
