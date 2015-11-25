(function () {
  'use strict';
  describe('Test Controller: FormBuilderEditJsCssCtrl', function () {
    var scope, ctrl, rootScope, formBuilderService;
    var scriptsConst, stylesConst, state, newCtrl, formBuilderDataStore;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($rootScope, $controller, FormBuilderService,
                                ScriptsConst, StylesConst, $state, FormBuilderDataStore) {
      scope = $rootScope.$new();
      formBuilderService = FormBuilderService;
      scriptsConst = ScriptsConst;
      stylesConst = StylesConst;
      ctrl = $controller;
      rootScope = $rootScope;
      state = $state;
      formBuilderDataStore = FormBuilderDataStore;
      newCtrl = initializeCtrl();
    }));

    function initializeCtrl() {
      return ctrl('FormBuilderEditJsCssCtrl', {
        $scope: scope,
        FormBuilderService: formBuilderService,
        FormBuilderDataStore: formBuilderDataStore,
        $state: state
      });
    }

    it('Should not null data from FormBuilderDataStore',
      inject(function () {
        var formBuilderGridData = formBuilderDataStore.FormBuilderGridData.data;
        expect(formBuilderGridData).not.toBe(null);
      }));

    it('Should call script list page',
      inject(function () {
        var formScriptsState = '/admin/formbuilder/scripts';
        spyOn(newCtrl, 'showList').and.callFake(function () {
          state.go(scriptsConst.SCRIPTS_STATE);
        });
        spyOn(state, 'go');
        newCtrl.showList(1);
        expect(state.go).toHaveBeenCalled();
        expect(state.go).toHaveBeenCalledWith(scriptsConst.SCRIPTS_STATE);
        expect(state.href(scriptsConst.SCRIPTS_STATE)).toEqual(formScriptsState);
      }));

    it('Should call styles list page',
      inject(function () {
        var formStylesState = '/admin/formbuilder/styles';
        spyOn(newCtrl, 'showList').and.callFake(function () {
          state.go(stylesConst.STYLES_STATE);
        });
        spyOn(state, 'go');
        newCtrl.showList(1);
        expect(state.go).toHaveBeenCalled();
        expect(state.go).toHaveBeenCalledWith(stylesConst.STYLES_STATE);
        expect(state.href(stylesConst.STYLES_STATE)).toEqual(formStylesState);
      }));
  });
})();
