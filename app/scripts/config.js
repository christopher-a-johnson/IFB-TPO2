(function () {
  'use strict';

  var NGEN_CONSTANTS = {
    ENV: 'DEV',
    RESTURL: 'http://eq1vweui0001.dco.elmae:85/v1',
    OSBRESTURL: 'http://encompass-ea.dev.dco.elmae/v2'
  };

  var ERROR_HANDLING_CONSTANTS = {
    ERROR_HANDLING_ENABLED: true,
    ENV: NGEN_CONSTANTS.ENV,
    LOG_ERRORS_TO_ENCOMPASS: true,
    LOG_ERRORS_TO_SERVER: true,
    LOG_ERROR_URL: NGEN_CONSTANTS.RESTURL + '/logging/savelogmessages',
    DEFAULT_ERROR_MSG: 'An error has occurred. Please contact the customer support for assistance.',
    DISPLAY_ERRORS_IN_UI: true,
    LOG_API_RESPONSE_TIME: false,
    LOG_UI_RENDER_TIME: false
  };

  window.NGEN_CONSTANTS = NGEN_CONSTANTS;
  window.ERROR_HANDLING_CONSTANTS = ERROR_HANDLING_CONSTANTS;

  //Top level name space for IFB
  var elli = elli || {};
  elli.encompass = elli.encompass || {};
  elli.encompass.web = elli.encompass.web || {};
  window.IFB_NAMESPACE = elli.encompass.web;
}());
