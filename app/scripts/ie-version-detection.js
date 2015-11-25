document.onreadystatechange = function () {
  'use strict';
  if (document.readyState === 'complete') {
    var userAgent = window.navigator.userAgent;
    var ieVersion;
    // In Microsoft internet explorer. Starting IE11, MEIE is never used.
    if (userAgent.indexOf('MSIE') !== -1) {
      ieVersion = parseInt(document.documentMode, 10);
      if (ieVersion < 11) {
        document.body.innerHTML = '<br/><br/>&nbsp;&nbsp;Installed IE version is not supported. Minimum supported ' +
        'version is IE11. Please upgrade and try again.';
      }
    }
  }
};
