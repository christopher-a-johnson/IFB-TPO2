(function () {
  'use strict';

  angular.module('elli.encompass.web.shared', []);

  angular.module('elli.encompass.web.shared').constant('SharedEventConst', {
    CLICK_EVENT: 'click',
    FOCUS_OUT_EVENT: 'focusout',
    INPUT_EVENT: 'input.search-box',
    MOUSE_MOVE_EVENT: 'mousemove',
    MOUSE_OVER_EVENT: 'mouseover',
    MOUSE_OUT_EVENT: 'mouseout'
  });
}());
