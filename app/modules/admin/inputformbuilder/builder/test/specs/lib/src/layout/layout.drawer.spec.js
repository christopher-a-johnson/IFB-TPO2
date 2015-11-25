/**
 * Created by RRajput on 7/9/2015.
 */
define(['lib/src/layout/layout.drawer'], function (draw) {
  'use strict';

  describe('Testing drawer function in layout drawer', function () {
    var drawer = elli.builder.drawer;
    beforeEach(function () {
      jasmine.getFixtures().fixturesPath = 'base/test/fixture';
      loadFixtures('indexfixture.html');
      appendSetFixtures('<script src="base/lib/src/layout/layout.drawer.js"></script>');
    });

    it('Should have drawer init and all selector in drawer defined', function () {
      expect(drawer.init).toBeDefined();
      expect(drawer.drawer.container).toBeDefined();
      expect(drawer.drawer.handle).toBeDefined();
      expect(drawer.drawer.helpText).toBeDefined();
      expect(drawer.drawer.workspace).toBeDefined();

    });
    it('Should spy initialize event and test it has been called', function () {
      spyOn(drawer, 'init');
      drawer.init();
      expect(drawer.init).toHaveBeenCalled();
    });

    it('Should handle drawer click event When click expand and hidden', function () {
      expect($(drawer.drawer.handle)).toBeInDOM();

      $(drawer.drawer.handle + ' span.drawerExpand').trigger('click');
      expect($(drawer.drawer.helpText).text()).toEqual('Hide Hidden Elements');

      $(drawer.drawer.handle + ' span.drawerCollapse').trigger('click');
      expect($(drawer.drawer.helpText).text()).toEqual('Show Hidden Elements');

    });

    it('Should handle drawer click event test case When class name is drawerExpand and drawerCollapse', function () {
      expect($(drawer.drawer.handle)).toBeInDOM();

      $(drawer.drawer.handle + ' span.drawerExpand').trigger('click');
      expect($(drawer.drawer.handle + ' span').hasClass('drawerExpand')).toBe(false);
      $(drawer.drawer.handle + ' span.drawerCollapse').trigger('click');
      expect($(drawer.drawer.handle + ' span').hasClass('drawerCollapse')).toBe(false);

    });

    it('Should check helper text for drawer', function () {
      expect($(drawer.drawer.helpText).text()).toEqual('Show Hidden Elements');
    });

  });
});
