(function () {
  'use strict';

  /**
   * This function does the following based on the input params: Displays the error message and
   * 1. log it to the console
   * 2. log it using the encompass.log function, and
   * 3. log it through the WPS endpoint once it becomes available
   * @param {object} errorMessage - details about the error
   * {boolean} displayError - Displays the error in the page
   * {boolean} consoleOnly - if the error should be logged only to the window.console
   */
  var logError = function (errorMessage, displayError, consoleOnly) {
    var detailedMessage = (JSON.stringify(errorMessage)).replace(/\\n/g, '');

    var loggingDetails = ' ';
    if (errorMessage.type !== 'debug') {
      loggingDetails = '; EncompassLogging: ';
      loggingDetails += (window.ERROR_HANDLING_CONSTANTS.LOG_ERRORS_TO_ENCOMPASS ? 'enabled' : 'disabled') + '; ';
      loggingDetails += (window.ERROR_HANDLING_CONSTANTS.LOG_ERRORS_TO_SERVER ? 'enabled' : 'disabled') + '; ';
    }
    loggingDetails += 'Environment: ' + window.ERROR_HANDLING_CONSTANTS.ENV + '.';

    //Always log the error to the window.console
    logErrorToConsole(detailedMessage + loggingDetails);

    //Don't handle the error if the error handling is not enabled in the config file
    if (consoleOnly || !window.ERROR_HANDLING_CONSTANTS.ERROR_HANDLING_ENABLED) {
      return;
    }
    if (displayError) {
      if (window.ERROR_HANDLING_CONSTANTS.DISPLAY_ERRORS_IN_UI &&
        (window.ERROR_HANDLING_CONSTANTS.ENV === 'DEV' || window.ERROR_HANDLING_CONSTANTS.ENV === 'QA')) {
        showMessage(detailedMessage + loggingDetails, errorMessage.type);
      }
      //Show the default error message in Production
      else {
        /* jshint -W035 */
        if (errorMessage.type !== 'debug') {
          //showMessage(window.ERROR_HANDLING_CONSTANTS.DEFAULT_ERROR_MSG); //In PROD, Displaying default error message in UI is disabled
        }
      }
    }
    logErrorToEncompass(detailedMessage);
    logErrorToServer(detailedMessage);
  };

  /**
   * Logs the errors to the console
   * @param {string} detailedMessage
   */
  function logErrorToConsole(detailedMessage) {
    if (window.console && window.console.log) {
      window.console.log(detailedMessage);
    }
  }

  /**
   * Logs the errors to the Encompass Log file using the thick-client's javascript api
   * @param {string} detailedMessage
   */
  function logErrorToEncompass(detailedMessage) {
    if (window.ERROR_HANDLING_CONSTANTS.LOG_ERRORS_TO_ENCOMPASS) {
      var sessionId = '';
      if (window.sessionStorage) {
        sessionId = window.sessionStorage.getItem('DrysdaleWebApp.SessionId');
      }
      var jsonParams = {Message: detailedMessage + ';SessionId=' + sessionId, TraceLevel: 'Error'};
      try {
        window.encompass.interaction.writeLog(JSON.stringify(jsonParams), function (resp) {
          var param = JSON.parse(resp);
          if (param.ErrorCode !== 0) {
            logErrorToConsole('Encompass Logging: Failed - ' + param.ErrorCode);
          }
        });
      }
      catch (e) {
        if (!(e instanceof TypeError)) {
          logErrorToConsole('Encompass Logging: Failed -' + e);
        }
      }
    }
  }

  /**
   * Logs the errors to the Server using the Auditing Service end point
   * @param {string} detailedMessage
   */
  function logErrorToServer(detailedMessage) {
    try {
      if (window.ERROR_HANDLING_CONSTANTS.LOG_ERRORS_TO_SERVER) {
        var sessionId = null;
        if (window.sessionStorage) {
          sessionId = window.sessionStorage.getItem('DrysdaleWebApp.SessionId');
        }
        // no point in trying if we don't have sessionId
        if (!sessionId) {
          return void 0;
        }

        if (window.XMLHttpRequest) {
          var xhr = new window.XMLHttpRequest();
          xhr.open('POST', window.ERROR_HANDLING_CONSTANTS.LOG_ERROR_URL, true);
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader('Elli-Nextgen-Session', sessionId);
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                logErrorToConsole('Error message saved successfully');
              } else {
                logErrorToConsole('Logging failed - ' + xhr.status + ' - ' + xhr.responseText, xhr);
              }
            }
          };
          xhr.onerror = function () {
            logErrorToConsole('Logging Error - ' + xhr.status + ' - ' + xhr.responseText, xhr);
          };
          var messageData = 'Message=' + detailedMessage.replace(/ /g, '+').replace(/\t/g, '+').replace(/\n/g, '+');
          messageData += '&ClientId=DrysdaleWeb&SessionId=' + sessionId;
          xhr.send(messageData);
        }
        else {
          logErrorToConsole('AJAX (XMLHTTP) is not supported');
        }
      }
    }
    catch (e) {
      logErrorToConsole('Error in XMLHttpRequest', e);
    }
  }

  /**
   * Append the error message to the DOM
   * @param {string} detailedMessage
   */
  function showMessage(detailedMessage, type) {
    if (!detailedMessage) {
      return;
    }
    var elem = document.getElementById('page-error');
    if (elem) {
      if (!document.getElementById('clearAll')) {
        var clearAll = document.createElement('button');
        clearAll.setAttribute('id', 'clearAll');
        clearAll.textContent = clearAll.innerText = 'Clear All Messages';
        clearAll.className = 'info';
        clearAll.onclick = function () {
          while (elem.lastChild) {
            elem.removeChild(elem.lastChild);
          }
        };
        elem.appendChild(clearAll);
      }
      var message = document.createElement('div');
      message.textContent = message.innerText = '*** ' + detailedMessage;
      message.className = 'error-message-padding ' + (type === 'debug' ? 'info' : '');
      elem.appendChild(message);
    }
  }

  /**
   * Handles all Javascript errors that happens outside of the Angular app
   */
  window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    logError('DrysdaleWeb - ' + (errorObj.stack || errorMsg || ''), true, false);
    return true;
  };

  window.logError = logError;
}());
