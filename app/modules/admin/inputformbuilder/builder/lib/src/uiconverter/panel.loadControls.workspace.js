elli.builder.panel.loadControls = (function () {
  'use strict';

  var workspace = elli.builder.workspace;

  return {

    getControlsJSON: function (controlsJson) {
      var val, controls, panelControl, parentElement, leftPosition, topPosition, controlClass, controlHeight,
        controlWidth, controlData;

      for (var key in controlsJson) {
        if (controlsJson.hasOwnProperty(key)) {
          val = controlsJson[key];
          controls = val.domPath.split('/');

          //Get parent element from DOM Path.
          parentElement = $('#' + controls[controls.length - 1]);

          //Condition check for ui properties
          if (val.Properties.ui) {
            leftPosition = val.Properties.ui.left || null;
            topPosition = val.Properties.ui.top || null;
            controlClass = val.Properties.ui['class'] || null;
            controlHeight = val.Properties.ui.height || null;
            controlWidth = val.Properties.ui.width || null;
            controlData = val.Properties.data || null;
          }
          // Draw existing control on workspace.
          panelControl = workspace.drawControl(null, parentElement, leftPosition, topPosition, val.type, val.id);

          // apply class from json to control.
          panelControl.addClass(controlClass);

          // apply height & width from json to control.
          panelControl.css('height', controlHeight).css('width', controlWidth);

          // apply data attribute from json to control.
          panelControl.attr('data', controlData);

          // attach events from json to control.
          /* we can use alterate option for attaching event like jquery bind() method but it doesn't update html hence,
           used attr(). */
          if (val.Properties.events) {
            for (var i = 0; i < val.Properties.events.length; i++) {
              for (var evtKey in val.Properties.events[i]) {
                if (val.Properties.events[i].hasOwnProperty(evtKey)) {
                  $(panelControl).attr(evtKey, val.Properties.events[i][evtKey]);
                }
              }
            }
          }

          // append control to parentElement.
          parentElement.append(panelControl);
        }
      }
    }
  };

}());
