elli.builder.properties = (function () {
  'use strict';
  var FORM_PROPERTIES_CONST = {
    formBuilderForm: $('#formBuilderForm')
  };
  /* Get the form properties and prepares the form properties object
   which will be saved in form json */
  return {
    getFormProperties: function () {
      var $formElementNode = FORM_PROPERTIES_CONST.formBuilderForm;
      var gridSpacing = $('#formWidth').val();
      var formProperties = {};
      formProperties.ui = {};
      formProperties.ui.width = $formElementNode.width();
      formProperties.ui.height = $formElementNode.height();
      formProperties.ui.spacing = gridSpacing;
      formProperties.ui.class = $formElementNode.attr('class') || '';
      formProperties.data = null;
      formProperties.events = null;
      return formProperties;
    },
    loadFormPropertyFromJSON: function (formSchemaJSON) {
      var formPropertiesData = formSchemaJSON.Properties;
      var $formNode = $('#formBuilderForm');
      $formNode.width(formPropertiesData.ui.width);
      $formNode.height(formPropertiesData.ui.height);
      $formNode.attr('class', formPropertiesData.ui.class);
      $formNode.attr('data', null);
      $('#builderWorkspace').css('position', 'absolute');
    }
  };
})();
