define(['classes/History'], function () {
  'use strict';
  var history = elli.builder.history;
  describe('Testing add/getHistory function in History class', function () {
    it('should have one history', function () {
      var historyItems = {
        action: 'act',
        elements: 'elem',
        timestamp: Date()
      };
      history.addHistory(historyItems);
      expect(history.getHistory().length).toEqual(1);
    });
  });
});
