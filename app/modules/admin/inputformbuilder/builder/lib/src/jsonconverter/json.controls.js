elli.builder.json.controls = (function () {
  'use strict';
  var outerPanel = '';//it will set only one time.
  var index;
  var depth;
  var builder = elli.builder,
    utility = builder.utility,
    formSchemaConstant = builder.constant.formSchema,
    storage = window.IFB_NAMESPACE.Storage;

  function setParentControlId(controlToUpdate, context) {
    var domElemPath = '', lastIndex;
    if (!getElementPath(context, $(context).attr('id'))) {
      domElemPath = outerPanel;
      depth = 0;
      controlToUpdate.parentId = outerPanel;
    } else {
      domElemPath = outerPanel + '/' + getElementPath(context, $(context).attr('id'));
      depth++;
      lastIndex = domElemPath.lastIndexOf('/') + 1;
      controlToUpdate.parentId = domElemPath.substring(lastIndex, domElemPath.length);
    }
    controlToUpdate.domPath = '/' + domElemPath;
    controlToUpdate.depth = depth;
    controlToUpdate.index = index;
    controlToUpdate.name = utility.removePrefix('container_', $(context).attr('id'));
    controlToUpdate.element = undefined;
    controlToUpdate.id =  utility.removePrefix('container_', $(context).attr('id'));
    controlToUpdate.type = $(context).attr('controlType');

    //Add ui properties of controls in form schema when droppped or resized on workspace
    if (!controlToUpdate.Properties) {

      var property = {};
      var ui = {};
      ui.width = $(context).width();
      ui.height = $(context).height();
      ui.left = $(context).position().left;
      ui.top = $(context).position().top;

      property.ui = ui;
      property.events = null;
      property.data = null;

      controlToUpdate.Properties = property;

    }

    return controlToUpdate;
  }

  function recurseGridControls($workspaceNode, formControls, isPanel) {
    var formControl = {};
    $workspaceNode.children().each(function () {

      formControl = {};
      if (isPanel) {
        outerPanel = $(this).parent().attr('id');
      }

      if ($(this).attr('controlType')) {
        var workspaceSchema = storage.getItem(formSchemaConstant.workspaceSchema);
        var ctrlGuid = $(this).attr('data-cid');
        var index = utility.getIndexOf(workspaceSchema, ctrlGuid);

        var controlToUpdate = setParentControlId(workspaceSchema[index], this);
        formControls.push(controlToUpdate);
        index++;
      }
      recurseGridControls($(this), formControls, false);
    });
    return formControls;
  }

  //Getting dom path.
  function getElementPath(element, controlId) {
    return $(element).parents().andSelf().map(function () {
      var tagName;
      if (this.id !== controlId && $(this).attr('controlType')) {
        tagName = this.id;
      }
      return tagName;
    }).get().join('/');
  }

  return {
    getControls: function (controlId) {
      if (controlId) {
        var $workspaceNode = $(controlId);
        var formControls = [];
        index = 0;
        formControls = recurseGridControls($workspaceNode, formControls, true);
        return formControls;
      }
    }
  };
}());
