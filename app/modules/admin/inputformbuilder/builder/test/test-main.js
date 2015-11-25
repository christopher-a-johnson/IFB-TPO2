var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function (path) {
  'use strict';

  var pathVal = path.replace(/^\/base\//, '').replace(/\.js$/, '');
  return pathVal;
};

Object.keys(window.__karma__.files).forEach(function (file) {
  'use strict';
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

  // dynamically load all test files
  deps: allTestFiles,

  paths: {
    'jquery': '../lib/vendor/jquery',
    'jquery-ui': '../lib/vendor/jquery-ui-1.11.4'
  },
  shim: {
    'jquery': {
      exports: 'jQuery'
    },
    'lib/vendor/jquery-ui-1.11.4': {
      deps: ['jquery'],
      exports: 'jquery-ui'
    },
    'classes/History': {
      deps: ['../config/builder-config']
    },
    'lib/vendor/Storage': {
      deps: ['../../config/builder-config']
    },
    'classes/Utility': {
      deps: ['../config/builder-config']
    },
    'lib/vendor/SessionManagement': {
      deps: ['../../config/builder-config']
    },
    'config/builder-config': {
      deps: ['../lib/vendor/restful.min']
    },
    'lib/vendor/RestfulServices': {
      deps: ['lib/vendor/restful.min', '../../config/builder-config', 'lib/vendor/SessionManagement']
    },
    'classes/Workspace': {
      deps: ['../lib/vendor/jquery', '../lib/vendor/Storage', 'classes/Utility', 'classes/Control', 'lib/src/prototype', '../lib/vendor/RestfulServices']
    },
    'classes/Control': {
      deps: ['../lib/vendor/jquery', '../lib/vendor/kendo.all', 'classes/Utility']
    },
    'lib/src/layout/layout.collapse': {
      deps: ['../../vendor/jquery', '../../../config/builder-config']
    },
    'lib/src/layout/layout.drawer': {
      deps: ['../layout/layout.collapse'],
      exports: 'Drawer'
    },
    'lib/controls/control.editor': {
      deps: ['../vendor/jquery', '../vendor/kendo.all', '../../config/builder-config'],
      exports: 'ControlEditor'
    },
    'lib/controls/control.toolbar': {
      deps: ['../vendor/jquery', '../vendor/kendo.all', '../../config/builder-config'],
      exports: 'controlToolbar'
    },
    'classes/Clipboard': {
      deps: ['../config/builder-config']
    },
    'lib/src/layout/layout.toolbar': {
      deps: ['../../vendor/jquery', '../../../classes/Clipboard', '../../../classes/Workspace'],
      exports: 'LayoutToolbar'
    },
    'lib/src/responsive': {
      deps: ['../vendor/jquery', '../vendor/kendo.all', '../../config/builder-config'],
      exports: 'responsive'
    },
    'lib/src/layout/layout.metadata': {
      deps: ['../../vendor/jquery', '../../vendor/kendo.all', '../../plugins/jquery/jquery.inline',
        '../layout/layout.collapse', '../../vendor/KendoInteraction'],
      exports: 'layoutMetadata'
    },
    'lib/src/layout/layout.grid': {
      deps: ['../../vendor/jquery', '../../vendor/jquery-ui-1.11.4', '../../../config/builder-config'],
      exports: 'LayoutGrid'
    },
    'lib/src/layout/layout.ribbon': {
      deps: ['../../vendor/jquery', '../../vendor/jquery-ui-1.11.4', '../../vendor/kendo.all', '../../../config/builder-config', '../../../constants/builder-constant', '../layout/layout.grid','../layout/layout.collapse'],
      exports: 'LayoutRibbon'
    }
  },
  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
