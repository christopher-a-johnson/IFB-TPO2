// TODO  #NGENY-1488 and #NGENY-1721, Once these two story completed Please uncomment following function
/*function setUpHTMLFixture() {
 'use strict';
 jasmine.getFixtures().fixturesPath = 'base/test/fixture';
 loadFixtures('indexfixture.html');
 }
 setUpHTMLFixture();*/

define(['classes/Workspace'], function () {
  'use strict';
  var workspace = elli.builder.workspace;
  var ctrlType = 'TextBox';
  var ctrlId = '';

  describe('Testing controls function in Workspace class', function () {
    // TODO  #NGENY-1488 and #NGENY-1721, Once these two story completed Please uncomment following beforeEach function
    /*beforeEach(function () {
     setUpHTMLFixture();
     });*/

    it('should have no controls at the beginning!', function () {
      expect(workspace.controls().length).toEqual(0);
    });

    xit('should create unique Control Id', function () {
      ctrlId = workspace.addControl(ctrlType);
      expect(ctrlId).toEqual('TextBox1');

      ctrlId = workspace.addControl(ctrlType);
      expect(ctrlId).toEqual('TextBox2');
    });

    xit('should have control type in control id', function () {
      ctrlId = workspace.addControl(ctrlType);
      expect(ctrlId).toContain('TextBox');
    });


  });

});
