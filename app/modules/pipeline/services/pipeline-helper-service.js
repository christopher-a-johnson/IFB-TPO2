(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PipelineHelperService', PipelineHelperService);
  /* @ngInject */
  function PipelineHelperService(PipelineConst) {
    //Check if Date is between range
    function dateCheck(checkDate) {
      var fDate, lDate, cDate;
      fDate = Date.parse(PipelineConst.DateFilterStartDate);
      lDate = Date.parse(PipelineConst.DateFilterEndDate);
      cDate = Date.parse(checkDate);
      if ((cDate <= lDate && cDate >= fDate)) {
        return true;
      }
      return false;
    }

    var helperService = {
      //TODO: NGENC-6153 - temp workaround - for kendo grid
      //NGENC-6153 - We don't have to change this until we confirm if this is a valid use case, as Encompass is also current breaking
      // for cols with special chars. But the entire Pipeline app stops working when we hit this problem (col with spl chars).
      // This is a temporary workaround to remove all (except few) special chars before binding the column to the grid, to prevent the
      // application being completely broken. Once the backend API figures out a way to get proper data for this column, we will have
      // to fix the UI using some other mechanism like hash/encrypt logic to preserve the column name with special characters

      removeSpecialCharsForID: function (text) {
        //remove all special characters except $ and .
        return text.replace(/[^A-Za-z0-9$.]/g, '');
      },
      removeSpecialCharsForTitle: function (text) {
        //remove all special characters except $, period, space and hyphen
        return text.replace(/[^A-Za-z0-9$. -]/g, '');
      },
      getColumnNameForKendoGrid: function (fieldName) {
        return helperService.removeSpecialCharsForID(fieldName.replace(/\./g, '$'));
      },

      getValidDate: function (enteredDate) {
        var validateDate = kendo.parseDate(enteredDate, 'MM/dd/yyyy');
        //Check if its valid date
        if (validateDate instanceof Date) {
          //if valid date check if its between 1/1/1990 till 12/31/2199
          if (dateCheck(enteredDate)) {
            return 'ValidDate';
          }
          else {
            return 'InvalidRange';
          }
        }
        else {
          return 'InvalidDate';
        }
      }
    };
    return helperService;
  }

})();
