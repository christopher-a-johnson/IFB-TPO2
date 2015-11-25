define(['lib/controls/control.editor'], function (controlEditor) {
  'use strict';
  describe('Testing kendo editor functionality in controls', function () {
    var controlEditor = elli.builder.controleditor;
    beforeEach(function () {
      jasmine.getFixtures().set(
        '<div id="propertiesPanel">' +
        '<div id="propertyToolbar" class="property"></div>' +
        '<div id="propertyAlignment" class="property"></div>' +
        '<div id="propertyText" class="property"></div>' +
        '<div id="propertySizing" class="property"></div>' +
        '<div id="propertyEditor" class="property"><textarea id="editor"></textarea></div>' +
        '</div>');
      appendSetFixtures('<script src="base/lib/controls/control.editor.js"></script>');
    });

    it('Should have kendo editor init method to be defined', function () {
      expect(controlEditor.init).toBeDefined();
    });

    it('Should have kendo editor container to be defined', function () {
      expect(controlEditor.editorContainer).toBeDefined();
    });

    it('Should have init method of kendo editor to be called', function () {
      spyOn(controlEditor, 'init');
      controlEditor.init();
      expect(controlEditor.init).toHaveBeenCalled();
    });

    it('Should have editor container in html page', function () {
      expect(controlEditor.editorContainer).toBeInDOM();
    });
  });
});
