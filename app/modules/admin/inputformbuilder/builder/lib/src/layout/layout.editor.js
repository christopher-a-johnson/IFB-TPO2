elli.builder.editor = (function () {
  'use strict';
  var EDITOR_CONSTANTS = {
    subTab: '#sub-tab',
    cssEditorBtn: '#cssEditorButton',
    cssJSEditorModalWindow: '#css-js-editor-modal',
    editorCloseBtn: '#close-button-at-editor',
    closeModalMark: '.close-modal-mark'
  };

  function initEditor() {
    $(EDITOR_CONSTANTS.subTab).kendoTabStrip({animation: {open: {effects: 'none'}}});
    $(EDITOR_CONSTANTS.cssEditorBtn).on('click', function () {
      $(EDITOR_CONSTANTS.cssJSEditorModalWindow).show();
    });
    $(EDITOR_CONSTANTS.closeModalMark).on('click', function () {
      $(EDITOR_CONSTANTS.cssJSEditorModalWindow).hide();
    });
  }

  return {
    init: initEditor
  };

})();
elli.builder.editor.init();
