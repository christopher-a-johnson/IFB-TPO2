elli.builder.metaData = (function () {
  'use strict';

  var builder = elli.builder,
    utility = builder.utility,
    formSchemaConstant = builder.constant.formSchema,
    formschemaupdate = builder.update,
    METADATA_CONSTANTS = {
      formMetadataSelector: '#formProperties input,textarea'
    };
  /* Form MetaData Type & Version is constant i.e. 'Custom & 1. */
  var FORMMETADATA = {
      Type: 'Custom',
      Version: 1
    },
    formMetaData = {};

  function updateFormMetadata() {

    $(METADATA_CONSTANTS.formMetadataSelector).on('change', function () {
      formschemaupdate.updateFormSchema(formSchemaConstant.Metadata, builder.metaData.getFormMetaData());
    });
  }

  return {
    init: updateFormMetadata,
    /* below function iterates form metadata, prepares formMetaDataJson
     & stores it into browser session storage. */
    getFormMetaData: function () {

      /* filters div & selects only input elements which we want to store
       in JSON. */
      var $metaDataNode = $('#formProperties *').filter
      ('input,textarea');

      /* iterate the filtered elements to store its values in MetaData
       JSON. */
      $metaDataNode.each(function () {
        if (this.type === 'checkbox') {
          formMetaData[$(this).attr('data-key')] = $(this).prop
          ('checked');
        }
        else {
          formMetaData[$(this).attr('data-key')] = this.value || '';
        }
      });

      formMetaData.Type = FORMMETADATA.Type;
      formMetaData.Version = FORMMETADATA.Version;

      return formMetaData;
    },
    extractMetadataFromJSON: function (formMetadataSchema) {
      $('#formName').val(formMetadataSchema.Name);
      $('#formDescription').val(formMetadataSchema.Description);
      $('#lblModifiedBy').text(formMetadataSchema.ModifiedBy);
      var currentDate = utility.formatDate
      (formMetadataSchema.ModifiedDate);
      $('#lblModifiedDate').text(currentDate);
      if (formMetadataSchema.Enabled) {
        $('#formEnabled').prop('checked', true);
        $('.km-switch-container').addClass('switchBorderBlue');
        $('.km-switch-handle').addClass('setSwitchEnabled');
      }
      $('#formBuilderForm').inlineEdit({editMode: 'multiple'});
    }
  };
}());
elli.builder.metaData.init();
