elli.builder.controleditor = (function ($, kendo) {
  'use strict';

  var editorContainer = ('#editor');
  function initPropertyEditor() {

    $(editorContainer).kendoEditor({
      tools: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'justifyLeft',
        'justifyCenter',
        'justifyRight',
        'justifyFull',
        'indent',
        'outdent',
        'createLink',
        'unlink',
        'subscript',
        'superscript',
        'fontName',
        'fontSize',
        'foreColor',
        'backColor'
      ]
    });
  }
  return {
    init: initPropertyEditor,
    editorContainer:editorContainer
  };
}($, kendo));

elli.builder.controleditor.init();
