(function () {
  'use strict';

  angular.module('elli.encompass.web.fieldsearch', ['ngSanitize']);

  angular.module('elli.encompass.web.fieldsearch').config(fieldSearchConfig);

  angular.module('elli.encompass.web.fieldsearch').run(fieldSearchRun);

  /* @ngInject */
  function fieldSearchConfig($stateProvider, localStorageServiceProvider, FSCONSTANTS) {
    // State Configuration
    $stateProvider.state('fieldsearch', {
      url: '/FieldSearch?thick',
      templateUrl: 'modules/fieldsearch/views/fieldsearch.html'
    });
    // configure local storage
    localStorageServiceProvider.setPrefix(FSCONSTANTS.LSPREFIX);
    localStorageServiceProvider.setStorageType(FSCONSTANTS.LSSTORAGETYPE);

  }

  /* @ngInject */
  function fieldSearchRun($rootScope, $state) {
    $rootScope.sessionInfo = {
      'userProfile': {},
      'sessionId': '',
      'isLoggedIn': 'false'
    };
  }

  // TODO: This should go in separate files
  angular.module('elli.encompass.web.fieldsearch').constant('FSCONSTANTS', {
    CLICKEVENT: 'click',
    ENTERKEYEVENT: 'keydown keypress',
    FOCUSOUTEVENT: 'focusout',
    FOCUSEVENT: 'focus',
    INPUTEVENT: 'input',
    LSPREFIX: 'DrysdaleWebApp',
    LSSTORAGETYPE: 'sessionStorage',
    LSSEARCHITEMSKEY: 'SearchItemsBulk',
    LSSEARCHRESULTKEY: 'SearchResultBulk',
    LSSEARCHHISTORYKEY: 'SearchHistory',
    LSSEARCHFIELDIDSKEY: 'SearchFieldIds',
    LSTEXTAREAKEY: 'SearchTextArea',
    LSTEXTAREAOTHERSKEY: 'SearchTextAreaOthers',
    MOUSEMOVEEVENT: 'mousemove',
    MOUSEOVEREVENT: 'mouseover',
    MOUSEOUTEVENT: 'mouseout',
    SPLITTEREVENT: 'handleKendoSplitterResize',
    SEARCHRESULTAPI: 'fieldsearch/fieldsearchresults',
    SEARCHDETAILSAPI: 'fieldsearch/fieldsearchresultdetails',
    FIELDTRIGGERS: 'Field Triggers',
    PERSONAFIELDS: 'Persona Access to Fields',
    PERSONALOANS: 'Persona Access to Loans',
    TPOCUSTOMFIELDS:'TPO Custom Fields',
    ALERTS: 'Alerts',
    MILESTONECOMPLETION: 'Milestone Completion',
    INPUTFORMLIST: 'Input Form List',
    BUSINESSCUSTOMFIELDS: 'Business Custom Fields',
    LOANFORMPRINTING: 'Loan Form Printing',
    HTMLEMAILTMPLS: 'HTML Email Templates',
    BORROWERCUSTOMFIELDS: 'Borrower Custom Fields',
    COMPANYSTATUSONLINE: 'Company Status Online',
    PIGGYBACKLOAN: 'Piggyback Loan Synchronization',
    LOCKFIELDS: 'Lock Request Additional Fields',
    FIELDDATAENTRY: 'Field Data Entry',
    PRINTAUTOSELECTION: 'Print Auto Selection',
    LOANCUSTOMFIELDS: 'Loan Custom Fields',
    AUTOCONDITIONS: 'Automated Conditions',
    _OneInvalidFldMessage: 'Encompass was unable to find field ‘1%’ on any input form. Confirm that you entered ' +
    'a valid field ID and try again.',
    _TwoInvalidFldsMessage: 'Encompass was unable to find fields ‘1%’ or ‘2%’ on any input form. Confirm that you ' +
    'entered valid field IDs and try again.',
    _ThreeInvalidFldsMessage: 'Encompass was unable to find fields ‘1%’, ‘2%’ or ‘3%’ on any input form. ' +
    'Confirm that you entered valid field IDs and try again.',
    _DuplicateIdMessage: 'You have entered duplicate field ID' + 's. Search values must be unique. ',
    _OneInvalidBusRuleMessage: 'Encompass was unable to find a business rule, calculated field, ' +
    'template, or alert that applies to field ‘1%’.',
    _TwoInvalidBusRuleMessage: 'Encompass was unable to find a business rule, calculated field, ' +
    'template, or alert that applies to fields ‘1%’ and ‘2%' + '.<br>' +
    '(To find a business rule or other items that apply to one specific field, search for one field ID at a time.)',
    _ThreeInvalidBusRuleMessage: 'Encompass was unable to find a business rule, calculated field, template, ' +
    'or alert that applies to fields ‘1%’, ‘2%’, and ‘3%’' + '.<br>' +
    '(To find a business rule or other items that apply to one specific field, search for one field ID at a time.)',
    _NoFldIdMessage: 'Please enter at least one field ID to search for.',
    _FldSearchMessageType: 'warning',
    LOGGINGNAMESPECAEVALUE:'Drysdale: Field Search: '
  });
}());
