
elli.builder.clipboard = (function ($) {
  'use strict';

  var storageItem = 'Clipboard';
  var storage = window.IFB_NAMESPACE.Storage;
  var history = elli.builder.history;
  var workspace = elli.builder.workspace;

  function initialize() {
    storage.setStorageType('localStorage');
  }

  function processSelectedElements(elements, action) {
    var content = {};

    content.action = action;
    content.elements = [];
    content.controls = [];

    $.each(elements, function () {
      var elem = $(this);
      var elemId = elem.attr('id');

      elem.removeClass('ui-selectee').removeClass('ui-selected');
      var str = elem.prop('outerHTML');

      content.elements.push(str);
      content.controls.push(workspace.getControlById(elemId));

      elem.find('[controlType]').each(function () {
        var ctrlId = $(this).attr('id');
        content.controls.push(workspace.getControlById(ctrlId));
      });
    });

    return content;
  }

  function attachElements(elems, destination) {
    $.each(elems, function () {
      var ctrlType = $(this).attr('controlType');

      if (ctrlType) { //ctrlType != null && ctrlType != '' && ctrlType != 'undefined'
        var ctrlId = workspace.addControl(ctrlType);
        $(this).attr('id', ctrlId);
      }

      $(destination).append(this);
    });
  }

  function addHistory(elem, action) {
    var params = {
      elems: elem,
      action: action
    };
    history.addHistory(params);
  }

  return {
    init: initialize,

    get: function () {
      return storage.getItem(storageItem);
    },

    clear: function () {
      storage.removeItem(storageItem);
    },

    copy: function (elem) {
      var obj = processSelectedElements(elem, 'copy');

      this.clear();
      storage.setItem(storageItem, obj);

      addHistory(elem, 'copy');               //////  TODO: Test history tracking
      return true;
    },

    cut: function (elem) {
      var obj = processSelectedElements(elem, 'cut');

      this.clear();
      storage.setItem(storageItem, obj);

      $(elem).remove();               //Remove element from dom
      addHistory(elem, 'cut');                //////  TODO: Test history tracking
      return true;
    },

    paste: function (destination) {
      var clippedObj = storage.getItem(storageItem);
      var elems = clippedObj.elements;

      attachElements(elems, destination);     //////  TODO: add elems to the workspace object (addControl)
      addHistory(elems, 'paste');             //////  TODO: Test history tracking
      return true;
    }
  };

}(jQuery));

elli.builder.clipboard.init();
