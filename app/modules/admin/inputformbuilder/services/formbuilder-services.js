(function () {
  'use strict';
  /* Service for communicating between form builder controllers */
  angular.module('elli.encompass.web.admin.formbuilder').factory('FormBuilderService', FormBuilderService);
  /* @ngInject */
  function FormBuilderService() {
    var service = {}, curPage = '', curPageTitle = '', curPageDescription = '';

    service.setCurPage = function (page) {
      curPage = page;
    };
    service.getCurPage = function () {
      return curPage;
    };
    service.setPageTitle = function (pageTitle) {
      curPageTitle = pageTitle;
    };
    service.getPageTitle = function () {
      return curPageTitle;
    };
    service.setPageDescription = function (pageDescription) {
      curPageDescription = pageDescription;
    };
    service.getPageDescription = function () {
      return curPageDescription;
    };
    service.setPageParams = function (page, pageTitle, pageDescription) {
      curPage = page;
      curPageTitle = pageTitle;
      curPageDescription = pageDescription;
    };
    return service;
  }

})();
