elli.builder.panel.load = (function () {
  'use strict';
  var layoutGrid = elli.builder.layoutgrid,
    workspace = elli.builder.workspace,
    utility = elli.builder.utility;

  return {
    init: function () {
      if (utility.getQueryString('FormId')) {
        workspace.disableFormSaveButton(true);
        workspace.loadFormSchema();
      }
    },
    createPanelFromJSON: function (panelData) {
      var radix = 10;
      var panelJson = panelData.Panels.sort(utility.sortByRow);
      var gridSpacing = panelData.Grid ? panelData.Grid.spacing : 2;
      var width = panelData.Grid ? panelData.Grid.width : null;
      window.wizardLayoutParams.cols = parseInt(utility.findTotalCols
      (panelJson), radix);
      window.wizardLayoutParams.rows = parseInt(utility.findTotalRows
      (panelJson), radix);
      // Passing 2nd parameter true means we are loading existing form
      layoutGrid.createGridPanels(gridSpacing, true, width, panelJson);
    }
  };
}());

elli.builder.panel.load.init();
