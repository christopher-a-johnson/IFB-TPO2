IFB_NAMESPACE.Storage = (function () {
  'use strict';

  var _storageType;
  var storageObj = {};
  var _prefix = 'DrysdaleWebApp.IFB.';

  //Safari's Private Browsing mode gives us an empty localStorage object with a quota of zero;
  function storageAvailable(type) {
    try {
      var storage = window[type],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch (e) {
      return false;
    }
  }

  function toItemType(obj) {
    return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
  }

  function deriveQualifiedKey(key) {
    return _prefix + key;
  }

  storageObj.setStorageType = function (type) {
    try {
      if (storageAvailable(type)) {
        _storageType = window[type];
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };

  storageObj.getItem = function (key) {
    var prefixedKey = deriveQualifiedKey(key);
    var item = _storageType.getItem(prefixedKey);

    try {
      item = JSON.parse(item);
    } catch (e) {
      return e;
    }

    return item;
  };

  storageObj.setItem = function (key, value) {
    var type = toItemType(value);

    if (/object|array/.test(type)) {
      value = JSON.stringify(value);
    }
    var prefixedKey = deriveQualifiedKey(key);
    _storageType.setItem(prefixedKey, value);
  };

  storageObj.removeItem = function (key) {
    var prefixedKey = deriveQualifiedKey(key);
    _storageType.removeItem(prefixedKey);
  };

  storageObj.clearStorage = function () {
    _storageType.clear();
  };

  return storageObj;

})();
