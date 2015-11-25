(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').controller('FormBuilderGridTooltipCtrl', FormBuilderGridTooltipCtrl);

  /* @ngInject */
  function FormBuilderGridTooltipCtrl(FormBuilderService, ImagesConst, ScriptsConst, StylesConst, FormListConst, $templateCache) {
    var vm = this;

    vm.curPage = FormBuilderService.getCurPage();
    vm.tmplUsed = getTooltipImgTmpl(vm.curPage);
    vm.tooltipTmpl = getTooltipTmplId(vm.curPage);

    function getTooltipImgTmpl(pageName) {
      var tmpl;

      if (pageName === ImagesConst.IMAGES_PAGE || pageName === ImagesConst.EDIT_IMAGES_PAGE) {
        tmpl = $templateCache.get('modules/admin/inputformbuilder/shared/views/formbuilder-tooltip-images-template.html');
        vm.width = '150';
      } else {
        tmpl = $templateCache.get('modules/admin/inputformbuilder/shared/views/formbuilder-tooltip-list-template.html');
        vm.width = '50';
      }
      return tmpl;
    }

    function getTooltipTmplId(pageName) {
      var tmpId = '#formListTooltip';
      if (pageName === FormListConst.FORM_LIST_PAGE) {
        tmpId = '#formListTooltip';
      }
      else if (pageName === ScriptsConst.SCRIPTS_PAGE || pageName === ScriptsConst.EDIT_SCRIPTS_PAGE) {
        tmpId = '#assetLibTooltip';
      }
      else if (pageName === ImagesConst.IMAGES_PAGE || pageName === ImagesConst.EDIT_IMAGES_PAGE) {
        tmpId = '#assetLibImageTooltip';
      }
      else if (pageName === StylesConst.STYLES_PAGE || pageName === StylesConst.EDIT_STYLES_PAGE) {
        tmpId = '#assetLibStylesTooltip';
      }
      return tmpId;
    }

  }
}());
