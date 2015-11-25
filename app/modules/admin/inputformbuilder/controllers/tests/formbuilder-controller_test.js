(function () {
  'use strict';
  describe('Test Controller: FormBuilderCtrl', function () {
    var scope, ctrl, rootScope, formBuilderService;
    var formListConst, imagesConst, scriptsConst, stylesConst, state, newCtrl, sessionMngmt;

    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function ($rootScope, $controller, FormBuilderService, FormListConst,
                                ImagesConst, ScriptsConst, StylesConst, $state, sessionManagement) {
      scope = $rootScope.$new();
      formBuilderService = FormBuilderService;
      imagesConst = ImagesConst;
      scriptsConst = ScriptsConst;
      stylesConst = StylesConst;
      formListConst = FormListConst;
      ctrl = $controller;
      rootScope = $rootScope;
      state = $state;
      sessionMngmt = sessionManagement;
      newCtrl = initializeCtrl();

    }));

    function initializeCtrl() {
      return ctrl('FormBuilderCtrl', {
        $scope: scope,
        FormBuilderService: formBuilderService,
        sessionManagement: sessionMngmt,
        $state: state
      });
    }

    it('Should properly set curPage , title and Description in showImages function ', function () {
      newCtrl.showImages();
      var curPage = formBuilderService.getCurPage();
      var title = formBuilderService.getPageTitle();
      var description = formBuilderService.getPageDescription();

      expect(curPage).toBe(imagesConst.IMAGES_PAGE);
      expect(title).toBe(imagesConst.IMAGES_TITLE);
      expect(description).toBe(imagesConst.IMAGES_DESCRIPTION);
    });

    it('Should route to correct state in showImages function', inject(function ($controller) {
      var formListState = '/admin/formbuilder/formlist';
      spyOn(newCtrl, 'showImages').and.callFake(function () {
        state.go(formListConst.FORM_LIST_STATE);
      });
      spyOn(state, 'go');
      newCtrl.showImages();
      expect(state.go).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith(formListConst.FORM_LIST_STATE);
      expect(state.href(formListConst.FORM_LIST_STATE)).toEqual(formListState);
    }));

    it('Should properly set curPage , title and Description in showScripts function', function () {
      newCtrl.showScripts();
      var curPage = formBuilderService.getCurPage();
      var title = formBuilderService.getPageTitle();
      var description = formBuilderService.getPageDescription();

      expect(curPage).toBe(scriptsConst.SCRIPTS_PAGE);
      expect(title).toBe(scriptsConst.SCRIPTS_TITLE);
      expect(description).toBe(scriptsConst.SCRIPTS_DESCRIPTION);
    });

    it('Should route to correct state in showScripts function', inject(function ($controller) {
      var formListState = '/admin/formbuilder/formlist';
      spyOn(newCtrl, 'showScripts').and.callFake(function () {
        state.go(scriptsConst.SCRIPTS_STATE);
      });
      spyOn(state, 'go');
      newCtrl.showScripts();
      expect(state.go).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith(scriptsConst.SCRIPTS_STATE);
      expect(state.href(formListConst.FORM_LIST_STATE)).toEqual(formListState);
    }));
    it('Should properly set curPage , title and Description in showStyles function', function () {
      newCtrl.showStyles();
      var curPage = formBuilderService.getCurPage();
      var title = formBuilderService.getPageTitle();
      var description = formBuilderService.getPageDescription();

      expect(curPage).toBe(stylesConst.STYLES_PAGE);
      expect(title).toBe(stylesConst.STYLES_TITLE);
      expect(description).toBe(stylesConst.STYLES_DESCRIPTION);
    });

    it('Should route to correct state in showStyles function', inject(function ($controller) {
      var formListState = '/admin/formbuilder/formlist';
      spyOn(newCtrl, 'showStyles').and.callFake(function () {
        state.go(stylesConst.STYLES_STATE);
      });
      spyOn(state, 'go');
      newCtrl.showStyles();
      expect(state.go).toHaveBeenCalled();
      expect(state.go).toHaveBeenCalledWith(stylesConst.STYLES_STATE);
      expect(state.href(formListConst.FORM_LIST_STATE)).toEqual(formListState);
    }));

  });
})();
