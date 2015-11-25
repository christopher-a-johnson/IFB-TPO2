(function () {
  'use strict';
  //This directive is used to simulate the behaviour of 'x' in text-boxes used for clearing the content

  function clearText(FSCONSTANTS) {
    return function () {
      angular.element(document)
        .on(FSCONSTANTS.INPUTEVENT, '.clearable', function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(FSCONSTANTS.MOUSEMOVEEVENT, '.x', function (e) {
          angular.element(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
        })
        .on(FSCONSTANTS.CLICKEVENT, '.onX', function () {
          angular.element(this).removeClass('x onX').val('').change();
        })
        .on(FSCONSTANTS.FOCUSOUTEVENT, FSCONSTANTS.INPUTEVENT, function () {
          angular.element(this).removeClass('x');
        })
        .on(FSCONSTANTS.FOCUS, FSCONSTANTS.INPUTEVENT, function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(FSCONSTANTS.MOUSEOVEREVENT, FSCONSTANTS.INPUTEVENT, function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(FSCONSTANTS.MOUSEOUTEVENT, FSCONSTANTS.INPUTEVENT, function () {
          angular.element(this).removeClass('x');
        });

      function tog(v) {
        return v ? 'addClass' : 'removeClass';
      }
    };
  }

  angular.module('elli.encompass.web.fieldsearch')
    .directive('fieldSearchClearable', clearText);

})();
