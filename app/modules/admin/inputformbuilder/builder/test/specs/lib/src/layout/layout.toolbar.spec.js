function setUpHTMLFixture() {
  'use strict';
  jasmine.getFixtures().fixturesPath = 'base/test/fixture';
  loadFixtures('indexfixture.html');
}
setUpHTMLFixture();
define(['lib/src/layout/layout.toolbar'], function () {
  'use strict';
  var layoutToolbar = elli.builder.layoutToolbar,
    Workspace = elli.builder.workspace;
  describe('Testing layout.toolbar', function () {
    beforeEach(function () {
      setUpHTMLFixture();
    });
    it('Should have defined layout copy, cut and paste functions', function () {
      expect(layoutToolbar.copy).toBeDefined();
      expect(layoutToolbar.cut).toBeDefined();
      expect(layoutToolbar.paste).toBeDefined();
    });
    it('Should call copy from layoutToolbar', function () {
      expect(layoutToolbar.copy()).toEqual(true);
      expect(Workspace.getSelectedObjects()).toEqual($('.ui-selected'));
    });

    it('Should call spy paste from layoutToolbar', function () {
      spyOn(layoutToolbar, 'paste');
      layoutToolbar.paste();
      expect(layoutToolbar.paste).toHaveBeenCalled();
    });

    it('Should call cut from layoutToolbar', function () {
      expect(layoutToolbar.cut()).toEqual(true);
    });
    it('Should handle close button click event and get value of form name', function () {
      expect($('#closeButton')).toBeInDOM();

      $('#closeButton').trigger('click');
      expect($('#formName').val()).toEqual('New Form');
    });
  });
});
