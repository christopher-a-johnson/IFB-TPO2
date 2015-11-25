/**
 * Created by apenmatcha on 8/31/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.shared').directive('ngenSearchFieldClearable', searchFieldClearAble);

  /* @ngInject */
  function searchFieldClearAble(SharedEventConst) {
    return function () {
      angular.element(document)
        .on(SharedEventConst.INPUT_EVENT, '.clearable', function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(SharedEventConst.MOUSE_MOVE_EVENT, '.x', function (e) {
          angular.element(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
        })
        .on(SharedEventConst.CLICK_EVENT, '.onX', function () {
          angular.element(this).removeClass('x onX').val('').change();
        })
        .on(SharedEventConst.FOCUS_OUT_EVENT, SharedEventConst.INPUT_EVENT, function () {
          angular.element(this).removeClass('x');
        })
        .on(SharedEventConst.FOCUS, SharedEventConst.INPUT_EVENT, function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(SharedEventConst.MOUSE_OVER_EVENT, SharedEventConst.INPUT_EVENT, function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(SharedEventConst.MOUSE_OUT_EVENT, SharedEventConst.INPUT_EVENT, function () {
          angular.element(this).removeClass('x');
        });
      function tog(v) {
        return v ? 'addClass' : 'removeClass';
      }
    };
  }}());
