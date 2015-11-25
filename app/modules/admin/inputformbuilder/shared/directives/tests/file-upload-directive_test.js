/**
 * Created by VMore on 4/29/2015.
 */
(function () {
  'use strict';
  describe('Testing file upload directive', function () {
    var scope, elem, compile, rootScope, html, $document;

    beforeEach(module('elli.encompass.web'));
    beforeEach(function () {

      inject(function ($compile, $rootScope, _$document_) {
        rootScope = $rootScope;
        scope = rootScope.$new();

        //set our view html.
        html = '<div formbuilder-file-upload></div>';
        compile = $compile;
        $document = _$document_;
        elem = compileDirective(html);
      });
    });

    function compileDirective(html) {
      var elem = angular.element(html);
      var compiled = compile(elem);
      compiled(scope);
      angular.element(document).find('body').append(elem);
      scope.$digest();
      return elem;
    }
    // TODO Below test needs to be changed as per the new file upload control
    xit('Should create file upload control', function () {
      expect(elem.find('#fileUpload').length).toEqual(1);
      expect(elem.find('#importFiles').length).toEqual(1);
      expect(elem.find('#importFiles')[0].type).toEqual('file');
    });

  });

})();

