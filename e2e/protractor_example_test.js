(function () {
  'use strict';

  describe('nextgen application', function () {
    it('should navigate to login page by default', function () {
      browser.get('/');
      var loginButton = element(by.id('loginButton'));
      expect(loginButton.isPresent()).toBeTruthy();
    });
  });

})();
