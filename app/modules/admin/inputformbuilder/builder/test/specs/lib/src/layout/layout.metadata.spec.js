function setUpHTMLFixture() {
  'use strict';
  jasmine.getFixtures().fixturesPath = 'base/test/fixture';
  loadFixtures('indexfixture.html');
}

define(['lib/src/layout/layout.metadata'], function() {
  'use strict';
  var layoutMetadata = elli.builder.layoutmetadata;

  describe('Testing layout metadata', function() {
    beforeEach(function() {
      setUpHTMLFixture();
    });

    it('should init Inline Form Fields', function() {
      expect(layoutMetadata.init).toBeDefined();
    });
    it('Should spy initialize event and test it has been called', function() {
      spyOn(layoutMetadata, 'init');
      layoutMetadata.init();
      expect(layoutMetadata.init).toHaveBeenCalled();
    });

    it('should pass on visible element', function() {
      expect($('#formPropertiesHeader')).toExist();
    });

    it('should check focus event on control', function() {
      $('#formName').trigger('focus');
      expect($('#formPropertiesPanel')).toBeInDOM();
      expect($('#lblRequired')).toBeVisible();
      expect($('#propertyCollapse1').text()).toEqual('Hide');
      expect($('#ImgEditMode')).not.toBeVisible();
      expect($('#propertyCollapse').hasClass('k-i-arrowhead-n')).toBe(true);
    });

    it('should check focus event on form Description', function() {
      $('#formDescription').trigger('focus');
      expect($('#lblRequired')).toBeVisible();
      expect($('#ImgEditMode')).not.toBeVisible();
    });

    it('should check blur event on inline css class', function() {
      $('.inline').trigger('blur');
      setTimeout(function() {
        expect($('#lblRequired')).not.toBeVisible();
        expect($('#ImgEditMode')).toBeVisible();
        expect($('#formName').text()).toEqual('New Form');
        expect($('#formName-label').text()).toEqual('New Form');
      }, 100);
    });

    it('should enable inline edit mode on edit icon', function() {
      $('#ImgEditMode').trigger('click');
      setTimeout(function() {
        expect($('#formDescription')).toBeVisible();
        expect($('#formName-label')).not.toBeVisible();
        expect($('#formDescription-label')).not.toBeVisible();
        expect($('#ImgEditMode')).not.toBeVisible();
        expect($('#formName')).toBeFocused();
      }, 100);
    });

  });
});
