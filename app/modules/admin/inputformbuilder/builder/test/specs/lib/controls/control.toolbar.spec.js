define(['lib/controls/control.toolbar'], function () {
  'use strict';
  var controlToolbar = elli.builder.controltoolbar;
  describe('Testing controls toolbar', function () {
    beforeEach(function () {
      //Set fixture
      jasmine.getFixtures().set('<div id="propertyToolbar" class="property"></div>');
      appendSetFixtures('<script src="base/lib/controls/control.toolbar.js"></script>');
    });

    it('Should have init function defined', function () {
      expect(controlToolbar.init).toBeDefined();
    });

    it('should call init function when toolbar is loaded', function () {
      spyOn(controlToolbar, 'init');
      controlToolbar.init();
      expect(controlToolbar.init).toHaveBeenCalled();
    });

    it('should render two divs with button group class when toolbar is loaded', function() {
      spyOn(controlToolbar, 'init');
      controlToolbar.init();
      expect(($(controlToolbar.ToolbarContainer).find('.k-button-group')).length).toEqual(2);
    });

    it('should render six hyperlinks when toolbar is loaded', function () {
      spyOn(controlToolbar, 'init');
      controlToolbar.init();
      expect(($(controlToolbar.ToolbarContainer).find('a')).length).toEqual(6);
    });

    it('should render three hyperlinks with data-group as text align when toolbar is loaded', function () {
      spyOn(controlToolbar, 'init');
      controlToolbar.init();
      expect((($(controlToolbar.ToolbarContainer).find('a[data-group=text-align]'))).length).toEqual(3);
    });
  });
});
