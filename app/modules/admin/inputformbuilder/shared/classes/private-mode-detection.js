window.onload = function () {
  'use strict';
  if (document.readyState === 'complete') {
    //Detecting the private mode
    var privateMode = window.IFB_NAMESPACE.DetectPrivateBrowsing;
    privateMode.detectPrivateMode(function (isPrivate) {
      if (isPrivate) {
        document.body.innerHTML = 'The Encompass Input Form Builder is not accessible when Private Browsing Mode is enabled.' +
          ' Disable Private Browsing Mode before logging in.';
      }
    });
  }
};
