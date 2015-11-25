(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').directive('formbuilderGridTooltip', formbuilderGridTooltip);

  /* @ngInject*/
  function formbuilderGridTooltip(kendoGridHelper, kendo) {

    return ({
      restrict: 'A',
      bindToController: true,
      controllerAs:'fbTooltipCtrl',
      controller: 'FormBuilderGridTooltipCtrl',
      link: link
    });

    function link(scope, element, attrs, fbTooltipCtrl) {
      var gridElem = scope.$eval(attrs.kOptions);

      $(document).ready(function () {
        $(element).kendoTooltip({
          filter: '.menu',
          autoHide: false,
          position: 'right',
          width: $(element).width() - 80,
          height: 30,
          callout: false,
          showOn: 'click',
          content: function (e) {
            var dataItem = kendoGridHelper.getRowByDataItem(e.target.closest('tr'));
            var rowTemplate = kendo.template(angular.element(fbTooltipCtrl.tooltipTmpl).html());
            return rowTemplate(dataItem);
          }
        }).data('kendoTooltip');

      });

      //Add the icon for the tooltip action
      setTimeout(function () {
        if (gridElem.columns.length > 0) {
          if (gridElem.columns[0].title.trim().length > 0) {
            gridElem.columns.unshift({
              template: fbTooltipCtrl.tmplUsed,
              title: ' ',
              freeze: true,
              width: fbTooltipCtrl.width
            });
          }
        }
      }, 0);
    }
  }

}());
