elli.builder.drawer = (function () {
  'use strict';
  var drawer = {
    container: '#bottomDrawer',
    handle: '#drawerHandle',
    workspace: '#hiddenWorkspace',
    helpText: '#drawerHelpText'
  };
  var layoutCollapse = elli.builder.layoutCollapse;

  function initHiddenWorkspacePanel() {
    var contentElement = $(drawer.workspace);
    var helpText = $(drawer.helpText);
    var isDrawerExpanded;
    //expand
    $(drawer.handle).on('click', 'span.drawerExpand', function (e) {
      helpText.text('Hide Hidden Elements');
      layoutCollapse.expandPanel({
        elem: contentElement,
        selector: this,
        hasEasingEffect: false,
        collapseClass: 'drawerCollapse',
        expandClass: 'drawerExpand'
      });
      isDrawerExpanded = true;
    });

    //collapse
    $(drawer.handle).on('click', 'span.drawerCollapse', function (e) {
      helpText.text('Show Hidden Elements');
      layoutCollapse.collapsePanel({
        elem: contentElement,
        selector: this,
        hasEasingEffect: false,
        collapseClass: 'drawerCollapse',
        expandClass: 'drawerExpand'
      });
      isDrawerExpanded = false;
    });

    layoutCollapse.collapsePanel({
      elem: contentElement,
      hasEasingEffect: false,
      collapseClass: 'drawerCollapse',
      expandClass: 'drawerExpand'
    });

    $(document).on('click', drawer.container, function () {
    });
  }

  return {
    init: initHiddenWorkspacePanel,
    drawer: drawer
  };
}());

elli.builder.drawer.init();
