elli.builder.controltoolbar = (function() {
  'use strict';
  var ToolbarContainer = '#propertyToolbar';

  return {
    init: function() {
      $(ToolbarContainer).kendoToolBar({
        items: [
          {
            type: 'buttonGroup',
            buttons: [
              {spriteCssClass: 'k-tool-icon k-justifyLeft', text: 'Left', togglable: true, group: 'text-align'},
              {spriteCssClass: 'k-tool-icon k-justifyCenter', text: 'Center', togglable: true, group: 'text-align'},
              {spriteCssClass: 'k-tool-icon k-justifyRight', text: 'Right', togglable: true, group: 'text-align'}
            ]
          },
          {
            type: 'buttonGroup',
            buttons: [
              {spriteCssClass: 'k-tool-icon k-bold', text: 'Bold', togglable: true, showText: 'overflow'},
              {spriteCssClass: 'k-tool-icon k-italic', text: 'Italic', togglable: true, showText: 'overflow'},
              {spriteCssClass: 'k-tool-icon k-underline', text: 'Underline', togglable: true, showText: 'overflow'}
            ]
          }
        ]
      });
    },
    ToolbarContainer: ToolbarContainer
  };
})();

elli.builder.controltoolbar.init();
