/**
 * Created by AGarudi on 6/29/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.admin.formbuilder.assetlibrary').controller('FormBuilderEditPopupCtrl',
    FormBuilderEditPopupCtrl);

  function FormBuilderEditPopupCtrl(FormBuilderModalWindowService, LayoutConfiguration,
                                              ScriptsConst, ImagesConst, StylesConst, FormBuilderService, $state) {

    var vm = this;
    vm.Approve = LayoutConfiguration.lablApprove;
    vm.Disapprove = LayoutConfiguration.lblDisapprove;
    vm.message = LayoutConfiguration.popupMessage;

    vm.modalNoClick = function () {
      FormBuilderModalWindowService.closePopup(true);
      var currentPage = FormBuilderService.getCurPage();
      if (currentPage === ScriptsConst.EDIT_SCRIPTS_PAGE) {
        showScripts();
      } else if (currentPage === ImagesConst.EDIT_IMAGES_PAGE) {
        showImages();
      } else if (currentPage === StylesConst.EDIT_STYLES_PAGE) {
        showStyles();
      }
    };

    vm.modalYesClick = function () {
      // TO DO add code for saving changes here
      FormBuilderModalWindowService.closePopup(true);
      var currentPage = FormBuilderService.getCurPage();
      if (currentPage === ScriptsConst.EDIT_SCRIPTS_PAGE) {
        showScripts();
      } else if (currentPage === ImagesConst.EDIT_IMAGES_PAGE) {
        showImages();
      } else if (currentPage === StylesConst.EDIT_STYLES_PAGE) {
        showStyles();
      }
    };

    function showScripts() {
      FormBuilderService.setPageParams(ScriptsConst.SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE, ScriptsConst.SCRIPTS_DESCRIPTION);
      $state.go(ScriptsConst.SCRIPTS_STATE);
    }

    function showImages() {
      FormBuilderService.setPageParams(ImagesConst.IMAGES_PAGE, ImagesConst.IMAGES_TITLE, ImagesConst.IMAGES_DESCRIPTION);
      $state.go(ImagesConst.IMAGES_STATE);
    }

    function showStyles() {
      FormBuilderService.setPageParams(StylesConst.STYLES_PAGE, StylesConst.STYLES_TITLE, StylesConst.STYLES_DESCRIPTION);
      $state.go(StylesConst.STYLES_STATE);
    }

    function initialize() {
      if (!(FormBuilderService.getCurPage())) {
        if ($state.includes('*.*.scriptslibrary')) {
          FormBuilderService.setPageParams(ScriptsConst.SCRIPTS_PAGE, ScriptsConst.SCRIPTS_TITLE, ScriptsConst.SCRIPTS_DESCRIPTION);
        } else if ($state.includes('*.*.imageslibrary')) {
          FormBuilderService.setPageParams(ImagesConst.IMAGES_PAGE, ImagesConst.IMAGES_TITLE, ImagesConst.IMAGES_DESCRIPTION);
        } else if ($state.includes('*.*.styleslibrary')) {
          FormBuilderService.setPageParams(StylesConst.STYLES_PAGE, StylesConst.STYLES_TITLE, StylesConst.STYLES_DESCRIPTION);
        }
      }
    }

    initialize();
  }
}());
