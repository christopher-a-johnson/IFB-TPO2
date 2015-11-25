//TODO: NGEN-3413 Security Strategy
IFB_NAMESPACE.SessionManagement = (function () {

  'use strict';

  var sessionManagement = {};
  var sessionKey = 'IFB_Session_Object';
  var ifbStorage = IFB_NAMESPACE.Storage;
  var storageType = 'localStorage';
  var sessionIdKey = 'DrysdaleWebApp.SessionId';

  sessionManagement.getSessionId = function () {
    var sessionId;
    if (ifbStorage.setStorageType(storageType)) {
      var ifbSessionObj = ifbStorage.getItem(sessionKey);
      sessionId = ifbSessionObj.userSession.sessionId;
    }
    return sessionId;
  };

  sessionManagement.setIFBSessionObject = function () {
    //IFB Session Management
    var sessionObj = {'userSession': {}};
    try {
      if (ifbStorage.setStorageType(storageType)) {
        var sessionId = window.sessionStorage.getItem(sessionIdKey);
        sessionObj.userSession.sessionId = sessionId;
        ifbStorage.setItem(sessionKey, sessionObj);
      } else {
        //TODO: Need to change when general error handling is in place.
        window.alert('Web browser local storage is not supported!');
      }
    } catch (e) {
      //TODO: Need to change when general error handling is in place.
      window.alert('Input Form Builder Set Session Failed!');
    }
  };

  sessionManagement.clearIFBSessionObject = function () {
    try {
      if (ifbStorage.setStorageType(storageType)) {
        ifbStorage.clearStorage();
      }
    } catch (e) {
      //TODO: Need to change when general error handling is in place.
      window.alert('Input Form Builder Set Session Failed!');
    }
  };

  return sessionManagement;

}());
