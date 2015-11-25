
elli.builder.image = (function () {
  'use strict';
  var content = {
    appearance: {
      items: []
    },
    behavior: {
      items: [
        {
          type: 'fieldset',
          name: 'image_behavior',
          label: 'Image Behavior',
          properties: [
            {
              type: 'boolean', name: 'control-enabled', label: 'Enabled', 'default': true,
              styleClass: 'linkedProperty', separator: 'separator', controlClass: 'control-id'
            },
            {
              type: 'controlId', name: 'control-controlId', label: 'Control ID', 'default': '',
              styleClass: 'linkedProperty', controlClass: 'control-id'
            }
          ]
        }]
    }
  };

  return {
    imageContent: content
  };
}());
