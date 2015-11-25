(function () {
  'use strict';

  var contextMenus = ['contextMenuLoanBorrowerName', 'contextMenuLoanCoBorrowerName', 'contextMenuLoanLockAndRequestStatus',
    'contextMenuLoanLockStatus', 'contextMenuFields11', 'contextMenuCurrentLoanAssociateFullName', 'contextMenuFields317',
    'contextMenuFields362'];

  contextMenus.forEach(function (directive) {
    var template = directive.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    // lock status will use same template for lock and request status, we will remove the column template
    // and this condition while doing column template refactoring...
    if (directive === 'contextMenuLoanLockStatus') {
      template = 'contextMenuLoanLockAndRequestStatus'.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
    var templateUrl = 'modules/pipeline/pipeline-grid-templates/' + template + '.html';
    angular.module('elli.encompass.web.pipeline').directive(directive, function () {
      return ({
        restrict: 'E',
        templateUrl: templateUrl
      });
    });
  });
}());
