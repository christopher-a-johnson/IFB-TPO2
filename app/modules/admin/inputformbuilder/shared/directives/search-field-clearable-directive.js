/**
 * Created by URandhe on 8/11/2015.
 */
(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').directive('searchFieldClearable', searchFieldClearAble);

  /* @ngInject */
  function searchFieldClearAble(FormBuilderEventConst) {
    return function () {
      angular.element(document)
        .on(FormBuilderEventConst.INPUT_EVENT, '.clearable', function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(FormBuilderEventConst.MOUSE_MOVE_EVENT, '.x', function (e) {
          angular.element(this)[tog(this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left)]('onX');
        })
        .on(FormBuilderEventConst.CLICK_EVENT, '.onX', function () {
          angular.element(this).removeClass('x onX').val('').change();
        })
        .on(FormBuilderEventConst.FOCUS_OUT_EVENT, FormBuilderEventConst.INPUT_EVENT, function () {
          angular.element(this).removeClass('x');
        })
        .on(FormBuilderEventConst.FOCUS, FormBuilderEventConst.INPUT_EVENT, function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(FormBuilderEventConst.MOUSE_OVER_EVENT, FormBuilderEventConst.INPUT_EVENT, function () {
          angular.element(this)[tog(this.value)]('x');
        })
        .on(FormBuilderEventConst.MOUSE_OUT_EVENT, FormBuilderEventConst.INPUT_EVENT, function () {
          angular.element(this).removeClass('x');
        });

      function tog(v) {
        return v ? 'addClass' : 'removeClass';
      }
    };
  }
}());
