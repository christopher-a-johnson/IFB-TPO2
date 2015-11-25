(function () {
  'use strict';
  angular.module('elli.encompass.web.admin.formbuilder').controller('FormBuilderCtrl', FormBuilderCtrl);

  /* @ngInject */
  function FormBuilderCtrl($state, FormBuilderService, FormListConst, ImagesConst, ScriptsConst, StylesConst, sessionManagement) {
    var vm = this;

    vm.showFormList = showFormList;
    vm.showImages = showImages;
    vm.showScripts = showScripts;
    vm.showStyles = showStyles;

    initialize();

    vm.title = FormBuilderService.getPageTitle();
    vm.description = FormBuilderService.getPageDescription();

    function showFormList() {
      FormBuilderService.setPageParams(FormListConst.FORM_LIST_PAGE, FormListConst.FORM_LIST_TITLE,
        FormListConst.FORM_LIST_DESCRIPTION);
      $state.go(FormListConst.FORM_LIST_STATE);
    }

    function showImages() {
      FormBuilderService.setPageParams(ImagesConst.IMAGES_PAGE, ImagesConst.IMAGES_TITLE, ImagesConst.IMAGES_DESCRIPTION);
      $state.go(ImagesConst.IMAGES_STATE);
    }

    function showScripts() {
      FormBuilderService.setPageParams(ScriptsConst.SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE, ScriptsConst.SCRIPTS_DESCRIPTION);
      $state.go(ScriptsConst.SCRIPTS_STATE);
    }

    function showStyles() {
      FormBuilderService.setPageParams(StylesConst.STYLES_PAGE, StylesConst.STYLES_TITLE, StylesConst.STYLES_DESCRIPTION);
      $state.go(StylesConst.STYLES_STATE);
    }

    //TODO: Xiaomin: NGENY-966: remove the following after this story is fixed. The fix should be in the gulp, not here.
    function initialize() {
      //IFB Session Management
      sessionManagement.setIFBSessionObject();

      if (!(FormBuilderService.getCurPage())) {
        if ($state.includes('*.*.formlist')) {
          FormBuilderService.setPageParams(FormListConst.FORM_LIST_PAGE, FormListConst.FORM_LIST_TITLE,
            FormListConst.FORM_LIST_DESCRIPTION);
        } else if ($state.includes('*.*.imageslibrary')) {
          FormBuilderService.setPageParams(ImagesConst.IMAGES_PAGE, ImagesConst.IMAGES_TITLE,
            ImagesConst.IMAGES_DESCRIPTION);
        } else if ($state.includes('*.*.scriptslibrary')) {
          FormBuilderService.setPageParams(ScriptsConst.SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE,
            ScriptsConst.SCRIPTS_DESCRIPTION);
        } else if ($state.includes('*.*.styleslibrary')) {
          FormBuilderService.setPageParams(StylesConst.STYLES_PAGE, StylesConst.STYLES_TITLE,
            StylesConst.STYLES_DESCRIPTION);
        }
      }
    }
  }
}());
