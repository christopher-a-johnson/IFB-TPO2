(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder.formlist', ['elli.encompass.web.admin.formbuilder.formlist.constant']);

  angular.module('elli.encompass.web.admin.formbuilder.formlist').config(formListConfig);

  /* @ngInject */
  function formListConfig($stateProvider, FormListConst) {
    $stateProvider.state(FormListConst.FORM_LIST_STATE, {
      url: '/formlist',
      templateUrl: 'modules/admin/inputformbuilder/shared/views/formbuilder-main.html'
    });
  }

}());
