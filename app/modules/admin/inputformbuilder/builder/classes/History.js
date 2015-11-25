
elli.builder.history = (function () {
  'use strict';

  var maxHistory = 20;
  var history = [];
  //var url = '';

  function removeHistory() {
    if (history.length > maxHistory) {
      var diff = history.length - maxHistory;
      history.splice(diff, Number.MAX_VALUE);
    }
  }

  //Services
  //Enable when there is an usage. Otherwise, JSHint complains
  //function sendData(item) {
  //  $.post(url, item, complete);
  //}

  //function complete() {
  //  history.length = 0;
  //  return true;
  //}

  return {
    getHistory: function () {
      return history;
    },

    addHistory: function (obj) {
      var historyItems = {
        action: obj.action,
        elements: obj.elems,
        timestamp: Date()
      };

      history.push(historyItems);
      removeHistory();
    },

    undo: function () {
      //get the last item in history
    },

    redo: function () {

    },

    save: function () {
    }
  };

})();
