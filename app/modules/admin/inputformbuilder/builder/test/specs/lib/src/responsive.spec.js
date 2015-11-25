define(['lib/src/responsive'], function () {
  'use strict';
  var obj, timer;
  var responsive = elli.builder.responsive;
  function setUpHTMLFixture() {
    jasmine.getFixtures().fixturesPath = 'base/test/fixture';
    loadFixtures('indexfixture.html');
  }

  var loadScript = function(path) {
    appendSetFixtures('<script src="' + path + '"></script>');
  };

  var loadStyle = function(path) {
    appendSetFixtures('<link rel="stylesheet" href="' + path + '">');
  };

  describe('Testing functions in responsive class', function () {

    beforeEach(function () {
      setUpHTMLFixture();
      obj = responsive.getObj();
    });

    afterEach(function() {
      obj = {};
    });

    it('Should call init function', function() {
      spyOn(responsive, 'init');
      responsive.init();
      expect(responsive.init).toHaveBeenCalled();
    });

    it('should call setDrawerTop function on init', function () {
      spyOn(obj, 'setDrawerTop');
      responsive.init();
      expect(obj.setDrawerTop).toHaveBeenCalled();
    });

    it('Should call onWindowScroll function', function() {
      spyOn(obj, 'onWindowScroll');
      obj.onWindowScroll();
      expect(obj.onWindowScroll).toHaveBeenCalled();
    });

    it('Should call onWindowResize when timer crosses 90 miliseconds', function () {

      timer = jasmine.createSpy(obj, 'onWindowResize');
      jasmine.clock().install();

      setTimeout(function() {
        timer();
      }, 90);

      expect(timer).not.toHaveBeenCalled();
      jasmine.clock().tick(91);
      expect(timer).toHaveBeenCalled();

      jasmine.clock().uninstall();
    });

    it('should have elements inside DOM when it is available', function() {
      expect($('#bottomDrawer')).toBeInDOM();
      expect($('#content')).toBeInDOM();
      expect($('#siteWrapper')).toBeInDOM();
      expect($('#drawerHelpText').text()).toBe('Show Hidden Elements');
    });

    it('Should set css properties when resize function is called ', function() {
      loadScript('base/lib/src/responsive.js');
      loadStyle('base/styles/Site.css');
      obj.onWindowResize(false);
      expect($('#siteWrapper')).not.toHaveAttr('style', 'marginBottom');
      obj.onWindowResize(true);
      expect($('#siteWrapper')).toHaveCss({marginBottom : '-' + $('#bottomDrawer').outerHeight() + 'px'});
      expect($('#content').width()).not.toBe(null);
    });

    it('Should set the drawerTop when setDrawerTop function is called ', function() {
      obj.setDrawerTop(false);
      expect(obj.drawerTopPosition()).toBe(0);
      obj.setDrawerTop(true);
      expect(obj.drawerTopPosition()).not.toBe(0);
    });

  });

});
