/**
 * Created by URandhe on 8/27/2015.
 */
elli.builder.layerPanel = (function () {
  'use strict';

  var builder = elli.builder;
  var control = builder.control,
    workSpace = builder.workspace,
    jsonControls = builder.json.controls,
    constant = builder.constant,
    controlConstant = constant.controlConstant,
    data;

  var LAYER_PANEL_CONSTANT = {
    panelMode: '.panelMode',
    closeLayerPanel: '.close-layer-panel',
    layerPanel: '.layers-panel',
    gridListContainer: '.gridListContainer',
    gridPanel: '.grid_panel',
    panelBarControlList: '#panel-bar-control-list',
    ctrlId: 'ul.gridListContainer li.ui-selected .fieldContainer',
    slideSpeed: 600,
    setTimeOutValue: 0
  };

  function initLayerPanel() {
    $(LAYER_PANEL_CONSTANT.panelMode).on('click', function () {
      toggleLayersPanel(true);
    });
    $(LAYER_PANEL_CONSTANT.closeLayerPanel).on('click', function () {
      toggleLayersPanel(false);
    });

    // AC:The control selected in the panel will be highlighted on the workspace
    $(document).on('click', '.li-tree', function () {
      var id = $(this).attr('name');
      control.deselectAllControl('.' + controlConstant.newControl);
      control.selectControl('#' + id);
    });

    function toggleLayersPanel(expand) {
      if (expand) {
        $(LAYER_PANEL_CONSTANT.layerPanel).show('slide', {direction: 'left'}, LAYER_PANEL_CONSTANT.slideSpeed);
      } else {
        $(LAYER_PANEL_CONSTANT.layerPanel).hide('slide', {direction: 'left'}, LAYER_PANEL_CONSTANT.slideSpeed);
      }
    }
  }

  function createControlMenu() {
    var layoutgrid = builder.layoutgrid;
    layoutgrid.inactiveGridPanel();
    control.deselectAllControl('.' + controlConstant.newControl);
    $(LAYER_PANEL_CONSTANT.panelBarControlList).empty();
    $(LAYER_PANEL_CONSTANT.panelMode).removeAttr('disabled');
    /* the layers panel is enabled on the selection of a grid panel*/
    if (workSpace.controls().length) {
      var ctrlId = $(LAYER_PANEL_CONSTANT.ctrlId).attr('id');
      data = jsonControls.getControls('#' + ctrlId);
      generateControlMenu();
    }
  }

  function clearLayerPanelList() {
    $(LAYER_PANEL_CONSTANT.panelBarControlList).empty();
    control.deselectAllControl('.' + controlConstant.newControl);
  }

  // Reading control data from active grid panel from json.controls.js file
  function getControlLayerTreeView(parentId) {
    if (data.length > 0) {
      return data.filter(function (node) {
        return (node.parentId === parentId);
      }).sort(function (a, b) {
        return a.index > b.index;
      }).map(function (node) {
        var exists = data.some(function (childNode) {
          return childNode.parentId === node.id;
        });
        var mainUl;
        var mainLI = document.createElement('LI');
        var anchorT = document.createElement('A');
        anchorT.setAttribute('href', '#');
        anchorT.setAttribute('class', 'li-tree');
        anchorT.setAttribute('name', node.id);
        var linkText = document.createTextNode(node.name);
        anchorT.appendChild(linkText);
        mainLI.appendChild(anchorT);
        if (exists) {
          mainUl = document.createElement('UL');
          var subMenu = getControlLayerTreeView(node.id);
          for (var k = 0; k < subMenu.length; k++) {
            mainUl.appendChild(subMenu[k]);
          }
          mainLI.appendChild(anchorT);
          mainLI.appendChild(mainUl);
        }
        return mainLI;
      });
    }
  }

  // create Layer Panel control menu for active grid panel
  function generateControlMenu() {
    var parentId;
    var endMenu;
    parentId = $(LAYER_PANEL_CONSTANT.ctrlId).attr('id');
    endMenu = getControlLayerTreeView(parentId);
    $(LAYER_PANEL_CONSTANT.panelBarControlList).append(endMenu);
    setTimeout(function () {
      $(LAYER_PANEL_CONSTANT.panelBarControlList).kendoPanelBar({
        expandMode: 'multiple'
      });
    }, LAYER_PANEL_CONSTANT.setTimeOutValue);
  }

  return {
    init: function () {
      initLayerPanel();
    },
    createControlMenu: createControlMenu,
    clearLayerPanelList: clearLayerPanelList
  };
}());
elli.builder.layerPanel.init();
