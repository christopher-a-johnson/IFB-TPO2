elli.builder.layoutToolbar = (function () {
  'use strict';

  var builder = elli.builder,
    clipboard = builder.clipboard,
    workspace = builder.workspace,
    constants = builder.constant.workSpaceConstant;

  function closeInputForm() {
    $('#closeButton').on('click', function () {
      var fileName = $('#formName').val();
      var message = 'There are unsaved changes to the form \'' + fileName + '\'. Would you like to save these changes?';
      var returnValue = window.confirm(message);

      //Close the existing form
      window.close();
      if (returnValue) {
        //TODO Save unsaved changes
        return true;
      } else {
        //TODO Discard changes
        return false;
      }
      //TODO open new form
    });
  }

  var onCloseTab = function () {
    return constants.formCloseMessage;
  };

  window.onbeforeunload = onCloseTab;

  return {
    init: closeInputForm,

    copy: function () {
      return clipboard.copy(workspace.getSelectedObjects());
    },

    cut: function () {
      return clipboard.cut(workspace.getSelectedObjects());
    },

    paste: function () {
      clipboard.paste('#paste');
    }
  };

}());

elli.builder.layoutToolbar.init();
