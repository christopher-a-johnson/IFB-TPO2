(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder.constant', []);

  var KndoGrid = window.IFB_NAMESPACE.KendoInteraction.Grid;
  var NGENFileUploadControl = window.IFB_NAMESPACE.FileUpload;
  var JsInteraction = window.IFB_NAMESPACE.JsInteraction.PropertyCollapseTextChange;
  var NgenRestfulServices = window.IFB_NAMESPACE.restfulservices;
  var Utility = window.IFB_NAMESPACE.Utility;
  var SessionManagement = window.IFB_NAMESPACE.SessionManagement;
  var ifbStorage = window.IFB_NAMESPACE.Storage;
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('_', window._);
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('kendo', window.kendo);
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('kendoGridHelper', KndoGrid);
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('jsInteraction', JsInteraction);
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('ngenFileUploadControl', NGENFileUploadControl);
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('ngenRestfulServices', NgenRestfulServices);
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('utility', Utility);
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('sessionManagement', SessionManagement);
  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('ifbStorage', ifbStorage);

  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('FormBuilderConst', {
    CONFIRMATION_POPUP_MESSAGE: 'Are you sure you want to delete ',
    FILE_DELETION_WARNING_MESSAGE: 'Do you still want to delete the file?',
    PATH_SHARED_VIEW: 'modules/admin/inputformbuilder/shared/views/',
    QUESTION_MARK: ' ?',
    ALERT_MESSAGE_FOR_BACK: 'You have made changes to this page that have not been saved. ' +
    'Click Continue to discard these changes or click Save and Continue to save these changes.',

    SELECTED_PAGE: 'SelectedPage',
    SELECTED_ROW_DATA: 'SelectedRowData',
    DEFAULT_SEARCH_TEXT: 'Search Name, Description and Last Modified by...',
    NO_OF_PAGE: 1,
    CUSTOM_SEARCH_EVENT: 'customSearchEvent'
  });

  angular.module('elli.encompass.web.admin.formbuilder.constant').constant('FormBuilderEventConst', {
    CLICK_EVENT: 'click',
    FOCUS_OUT_EVENT: 'focusout',
    INPUT_EVENT: 'input',
    MOUSE_MOVE_EVENT: 'mousemove',
    MOUSE_OVER_EVENT: 'mouseover',
    MOUSE_OUT_EVENT: 'mouseout'
  });
}());
