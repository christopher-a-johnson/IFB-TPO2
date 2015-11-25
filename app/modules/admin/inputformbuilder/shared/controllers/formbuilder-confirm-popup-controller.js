(function () {
  'use strict';
  angular.module('elli.encompass.web.admin.formbuilder').controller('FormBuilderConfirmPopupController',
    FormBuilderConfirmPopupController);
  function FormBuilderConfirmPopupController(FormBuilderModalWindowService, LayoutConfiguration, FormListConst, ENV,
                                             FormBuilderService, kendoGridHelper, sessionManagement,
                                             ngenRestfulServices, $state) {
    var vm = this;
    vm.Approve = LayoutConfiguration.lablApprove;
    vm.Disapprove = LayoutConfiguration.lblDisapprove;
    vm.message = LayoutConfiguration.popupMessage;
    vm.modalNoClick = function () {
      FormBuilderModalWindowService.closePopup(true);
    };

    vm.modalYesClick = function () {
      FormBuilderModalWindowService.closePopup(false);
      var pageName = FormBuilderService.getCurPage();
      var formId =  kendoGridHelper.getSelectedRowData().Id;
      if (pageName === FormListConst.FORM_LIST_PAGE) {
        var restfulServices = ngenRestfulServices.setBaseURL(ENV.osbRestURL, sessionManagement.getSessionId());
        /*jshint -W024*/
        restfulServices.delete(FormListConst.FORM_LIST_API, formId).then(
          function (success) {
            if (success) {
              $state.transitionTo($state.current, {}, {reload: true, inherit: false, notify: true});
            }else {
              //TODO: TO handle error
            }
            /*jshint -W035*/
          });
      }
    };
  }
}());
