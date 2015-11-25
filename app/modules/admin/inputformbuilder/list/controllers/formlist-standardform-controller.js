/**
 * Created by urandhe on 4/30/2015.
 */
(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder.formlist').controller('StandardFormListCtrl', StandardFormListCtrl);

  /* @ngInject */
  function StandardFormListCtrl(kendo, StandardFormListData, FormBuilderModalWindowService, $timeout, _) {
    var vm = this;
    var selectedFile = '';
    vm.isOpenButtonDisabled = true;
    var standardFormGridData = [];
    var standardFormsDS = new kendo.data.DataSource({
      transport: {
        read: function (options) {
          StandardFormListData.resolvePromise().then(function (response) {
            var data = _.sortBy(response, function (item) {
              return item.name.toLowerCase();
            });
            options.success(standardFormGridData = data);
          });
        }
      }
    });

    vm.option = {
      dataSource: standardFormsDS,
      selectable: true,
      change: onChange
    };

    vm.CloseStandardWindowPopUp = function () {
      FormBuilderModalWindowService.closePopup();
    };

    function onChange(e) {
      var $listView = e.sender;
      var data = standardFormsDS.view();
      var $selectedElements = $listView.select();
      selectedFile = $.map($selectedElements, function (item) {
        var index = $(item).index();
        return data[index];
      });
      $timeout(function () {
        vm.isOpenButtonDisabled = false;
      }, 0);
    }

    vm.openSelectedForm = function () {
      return true;
    };

    /* Initialization code */
    function initialize() {
      vm.isOpenButtonDisabled = true;
    }

    initialize();
  }
})();
