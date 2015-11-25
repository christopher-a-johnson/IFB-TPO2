elli.builder.container = (function () {
    'use strict';

    var panel = {
        appearance: {
            items: [
              {
                  type: 'section',
                  name: 'container_type',
                  label: '',
                  properties: [
                    {
                        type: 'select',
                        name: 'container-type',
                        label: 'Container Type',
                        'default': 'Container',
                        styleClass: 'linkedProperty',
                        controlClass: 'container-style'
                    }]
              },
              {
                  type: 'fieldset',
                  name: 'appearance',
                  label: 'Panel Appearance',
                  properties: [
                    {
                        type: 'select', name: 'panel-style', 'default': 'em-button', label: 'Panel Style',
                        styleClass: 'linkedLabelProperty', separator: 'separator'
                    },
                    {
                        type: 'label', name: 'control-height', label: 'Height', labelOnly: 'true', styleClass: 'linkedProperty tab-index'
                    },
                    {
                        type: 'label', name: 'control-width', label: 'Width', labelOnly: 'true', styleClass: 'linkedProperty'
                    },
                    {
                        type: 'numeric', name: 'paragraph-height', 'default': '', textOnly: 'true', controlClass: 'tab-index paragraph-width'
                    },
                    {
                        type: 'numeric', name: 'paragraph-width', 'default': '', textOnly: 'true', controlClass: 'paragraph-width'
                    }
                  ]
              }
            ]
        },
        behavior: {
            items: [
              {
                  type: 'fieldset',
                  name: 'panel_behavior',
                  label: 'Panel Behavior',
                  properties: [
                    {
                        type: 'boolean', name: 'control-enabled', label: 'Enabled', 'default': true,
                        styleClass: 'linkedProperty', separator: 'separator', controlClass: 'control-id'
                    },
                    {
                        type: 'controlId', name: 'panel-controlId', label: 'Control ID', 'default': '',
                        styleClass: 'linkedProperty', controlClass: 'control-id'
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
    var categoryBox = {
        appearance: {
            items: [
              {
                  type: 'section',
                  name: 'container_type',
                  label: '',
                  properties: [
                    {
                        type: 'select', name: 'container-type', label: 'Container Type', 'default': 'Container',
                        styleClass: 'linkedProperty'
                    }
                  ]
              },
              {
                  type: 'fieldset',
                  name: 'appearance',
                  label: 'Category Box Header',
                  properties: [
                    {
                        type: 'text',
                        name: 'category-header',
                        controlClass: 'dropdown-label',
                        placeholder: 'Your Category Box Header Goes Here',
                        styleClass: 'linkedLabelProperty'
                    },
                    {
                        type: 'select', name: 'container-header-style', 'default': 'em-button', br: 'break', label: 'Category Box Header Style',
                        styleClass: 'linkedLabelProperty'
                    }
                  ]
              },
              {
                  type: 'fieldset',
                  name: 'appearance',
                  label: 'Category Box Appearance',
                  properties: [
                    {
                        type: 'select', name: 'containerCategory-style', 'default': 'em-button', br: 'break', label: 'Category Box Style',
                        styleClass: 'linkedLabelProperty', separator: 'separator'
                    },
                    {
                        type: 'label', name: 'control-height', label: 'Height', labelOnly: 'true', styleClass: 'linkedProperty tab-index'
                    },
                    {
                        type: 'label', name: 'control-width', label: 'Width', labelOnly: 'true', styleClass: 'linkedProperty'
                    },
                    {
                        type: 'text', name: 'paragraph-height', 'default': '', textOnly: 'true', controlClass: 'tab-index paragraph-width'
                    },
                    {
                        type: 'text', name: 'paragraph-width', 'default': '', textOnly: 'true', controlClass: 'paragraph-width'
                    }
                  ]
              }
            ]
        },
        behavior: {
            items: [
              {
                  type: 'fieldset',
                  name: 'category_box_behavior',
                  label: 'Category Box Behavior',
                  properties: [
                    {
                        type: 'boolean', name: 'control-enabled', label: 'Enabled', 'default': true,
                        styleClass: 'linkedProperty', separator: 'separator', controlClass: 'control-id'
                    },
                    {
                        type: 'controlId', name: 'panel-controlId', label: 'Control ID', 'default': '',
                        styleClass: 'linkedProperty', controlClass: 'control-id'
                    }
                  ]
              }
            ]
        }

    };

    var container = {
        appearance: {
            items: [
              {
                  type: 'section',
                  name: 'container_type',
                  label: '',
                  properties: [
                    {
                        type: 'select',
                        name: 'container-type',
                        label: 'Container Type',
                        'default': 'Container',
                        styleClass: 'linkedProperty',
                        controlClass: 'container-style'
                    }]
              },
              {
                  type: 'fieldset',
                  name: 'appearance',
                  label: 'Group Box Header',
                  properties: [
                    {
                        type: 'text',
                        name: 'group-header',
                        controlClass: 'dropdown-label',
                        placeholder: 'Your Group Header Goes Here',
                        br: 'break',

                        styleClass: 'linkedLabelProperty'
                    },
                    {
                        type: 'select', name: 'container-header-style', 'default': 'em-button', br: 'break', label: 'Group Box Header Style',
                        styleClass: 'linkedLabelProperty'
                    }
                  ]
              },
              {
                  type: 'fieldset',
                  name: 'appearance',
                  label: 'Group Box Appearance',
                  properties: [
                    {
                        type: 'select', name: 'container-style', 'default': 'em-button', br: 'break', label: 'Group Box Style',
                        styleClass: 'linkedLabelProperty'
                    },
                    {
                        type: 'label', name: 'control-height', label: 'Height', labelOnly: 'true', styleClass: 'linkedProperty tab-index'
                    },
                    {
                        type: 'label', name: 'control-width', label: 'Width', labelOnly: 'true', styleClass: 'linkedProperty'
                    },
                    {
                        type: 'numeric', name: 'paragraph-height', 'default': '', textOnly: 'true', controlClass: 'tab-index paragraph-width'
                    },
                    {
                        type: 'numeric', name: 'paragraph-width', 'default': '', textOnly: 'true', controlClass: 'paragraph-width'
                    }
                  ]
              }
            ]
        },
        behavior: {
            items: [
              {
                  type: 'fieldset',
                  name: 'group_box_behavior',
                  label: 'Group Box Behavior',
                  properties: [
                    {
                        type: 'boolean', name: 'control-enabled', label: 'Enabled', 'default': true,
                        styleClass: 'linkedProperty', separator: 'separator', controlClass: 'control-id'
                    },
                    {
                        type: 'controlId', name: 'panel-controlId', label: 'Control ID', 'default': '',
                        styleClass: 'linkedProperty', controlClass: 'control-id'
                    }
                  ]
              }
            ]
        }

    };



    var containerStyle = [
      { text: 'EM-group-box', value: '1' },
      { text: 'new-group-box', value: '2' },
      { text: 'group-box-jim', value: '3' }
    ];

    var containerCategoryStyle = [
        { text: 'EM-category-box', value: '1' },
        { text: 'new-category-box', value: '2' },
        { text: 'cat-box-jim', value: '3' }
    ];
    var panelStyle = [
      { text: 'EM-panel', value: '1' },
      { text: 'panel-alt', value: '2' },
      { text: 'my-panel', value: '3' }
    ];
    var containerHeaderStyle = [
      { text: 'EM-h5', value: '1' },
      { text: 'EM-h4', value: '2' },
      { text: 'EM-h3', value: '3' }
    ];
    var containerType = [
      { text: 'Panel', value: '1' },
      { text: 'Group Box', value: '2' },
      { text: 'Category Box', value: '3' }
    ];
    return {
        panel: panel,
        groupBox: container,
        categoryBox: categoryBox,
        containerStyle: containerStyle,
        containerCategoryStyle: containerCategoryStyle,
        containerType: containerType,
        containerHeaderStyle: containerHeaderStyle,
        panelStyle: panelStyle
    };
}());
