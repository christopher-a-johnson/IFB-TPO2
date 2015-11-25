elli.builder.layoutmetadata = (function () {
  'use strict';
  var builder = elli.builder,
    layoutCollapse = elli.builder.layoutCollapse,
    utility = builder.utility,
    formSchemaConstant = builder.constant.formSchema,
    formschemaupdate = builder.update,
    interaction = window.IFB_NAMESPACE.KendoInteraction;

  function initInlineFormFields() {
    $('#formEnabled').kendoMobileSwitch({
      onLabel: '<div class="on-label-with-tick"></div>',
      offLabel: 'X',
      change: switchMode
    });
    initFormProperitesPanel();
    if (!utility.getQueryString('FormId')) {
      $('#formBuilderForm').inlineEdit({editMode: 'multiple'});
    }
  }

  function switchMode(e) {
    $('#formEnabled').attr('value', e.checked);
    formschemaupdate.updateFormSchema(formSchemaConstant.Metadata, builder.metaData.getFormMetaData());
  }

  function initFormProperitesPanel() {

    var contentElement = $('#formPropertiesPanel');

    //expand
    $('#formPropertiesHeader').on('click', 'span.k-i-arrowhead-s', function (e) {
      $('#propertyCollapse1').text('Hide');
      layoutCollapse.expandPanel({
        elem: contentElement,
        selector: this,
        hasEasingEffect: true,
        expandClass: 'k-i-arrowhead-s',
        collapseClass: 'k-i-arrowhead-n'
      });
    });

    //collapse
    $('#formPropertiesHeader').on('click', 'span.k-i-arrowhead-n', function (e) {
      $('#propertyCollapse1').text('Show');
      layoutCollapse.collapsePanel({
        elem: contentElement,
        selector: this,
        hasEasingEffect: true,
        expandClass: 'k-i-arrowhead-s',
        collapseClass: 'k-i-arrowhead-n'
      });
    });
  }

  $(document).on('click', '#propertyCollapse1', function () {
    var contentElement = $('#formPropertiesPanel');
    if ($('#propertyCollapse').hasClass('k-i-arrowhead-n')) {
      $('#propertyCollapse1').text('Show');

      layoutCollapse.collapsePanel({
        elem: contentElement,
        selector: '#propertyCollapse',
        hasEasingEffect: true,
        expandClass: 'k-i-arrowhead-s',
        collapseClass: 'k-i-arrowhead-n'
      });

    } else {
      $('#propertyCollapse1').text('Hide');

      layoutCollapse.expandPanel({
        elem: contentElement,
        selector: '#propertyCollapse',
        hasEasingEffect: true,
        expandClass: 'k-i-arrowhead-s',
        collapseClass: 'k-i-arrowhead-n'
      });

    }
  });

  $(document).on('click', '#ImgEditMode', function () {
    $('#formName').show();
    $('#formName-label').hide();
    $('#formDescription').show();
    $('#formDescription-label').hide();
    $('#ImgEditMode').hide().removeClass('show-item-inline-block');
    $('#formName').focus();
  });

  $(document).on('click', '#formEnabledField', function () {
    interaction.applyBorderKendoSwitch('#formEnabledField');
  });

  $(document).on('focus', '#formName', function () {
    $('#formPropertiesPanel').show();
    $('#propertyCollapse1').text('Hide');
    $('#propertyCollapse').removeClass('k-i-arrowhead-s').addClass('k-i-arrowhead-n');
    $('#ImgEditMode').hide().removeClass('show-item-inline-block');
    $('#lblRequired').show();
  });

  $(document).on('focus', '#formDescription', function () {
    $('#ImgEditMode').hide().removeClass('show-item-inline-block');
    $('#lblRequired').show();
  });

  $(document).on('blur', '.inline', function () {
    if ($('#formName').val().toString().trim() === '') {
      $('#formName').val('New Form');
      $('#formName-label').text('New Form');
    }
    $('#ImgEditMode').show().addClass('show-item-inline-block');
    $('#lblRequired').hide();
  });

  return {
    init: initInlineFormFields
  };
}());

elli.builder.layoutmetadata.init();
