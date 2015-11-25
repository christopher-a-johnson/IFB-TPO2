/**
 * Created by Vivek More on 05/05/2015
 */
(function () {
  'use strict';
  describe('Testing grid & grid tooltip directive', function() {
      var scope, elem, compile, rootScope, html, $document, ctrl, env, httpBackend;

      beforeEach(module('elli.encompass.web'));
      beforeEach(function() {

        inject(function($compile, $controller, $rootScope, $httpBackend, ENV, _$document_) {

          env = ENV;
          rootScope = $rootScope;
          scope = rootScope.$new();

          //set Mocking Data
          var responseData = [{
            'Id': '1',
            'FormName': 'Justo Cetero Inimicus Vis Te',
            'Description': 'Justo Cetero Inimicus Vis Tejusto Cetero Inimicus Vis Tejusto Cetero Inimicus Vis ',
            'Enabled': 1,
            'LastModifiedBy': 'Joe Smith',
            'LastModifiedDateTime': '10/01/2014 12:30:12 PM'
          }];
          var responseColumn = [{'columns':[{'field': 'FormName', 'width': 200, 'title': 'Form Name'}]}];
          httpBackend = $httpBackend;
          httpBackend.when('GET', env.restURL + '/api/fb/listGridData.json').respond(responseData);
          httpBackend.when('GET', env.restURL + '/api/fb/listGridColumns.json').respond(responseColumn);

          ctrl = $controller('FormBuilderGridCtrl', {
            $scope: scope
          });
          //set our view html.
          html = '<div formbuilder-grid></div>';
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

      it('Should create grid', function() {
        var gridControl = elem.find('#ngen-formbuilder-grid');
        expect(gridControl.length).toEqual(1);
      });

      it('Should create grid tooltip', function() {
        var dataRole = elem.find('#ngen-formbuilder-grid').data('role');
        expect(dataRole).toBe('tooltip');
      });
    });

})();
