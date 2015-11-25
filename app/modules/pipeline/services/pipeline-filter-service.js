/**
 * Created by ukolapkar on 7/14/2015.
 */
(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('PipelineFilterService', PipelineFilterService);
  /* @ngInject */
  function PipelineFilterService(_) {
    var filterService = {
      getFieldTypeForFilters: function (datatype, isRecurring) {
        datatype = datatype.toLowerCase();
        if (datatype === 'integer' || datatype.indexOf('decimal') !== -1) {
          return 'IsNumeric';
        } else if (datatype === 'date' || datatype === 'datetime') {
          if (isRecurring) {
            return 'IsMonthDay';
          } else {
            return 'IsDate';
          }
        } else if (datatype === 'dropdown' || datatype === 'yn') {
          return 'IsOptionList';
        }
        return 'IsString';
      },
      getDropDownLabel: function (filter) {
        var label = '', optionsList = '', values = [];
        if (filter.Datatype === 'DROPDOWN') {
          if (typeof filter.ValueFrom !== 'undefined' && filter.ValueFrom !== '') {
            values = angular.isArray(filter.ValueFrom) ? filter.ValueFrom : filter.ValueFrom.split(';');
            _.each(values, function (value) {
              optionsList = _.findWhere(filter.FieldOptions, {Value: value});
              label += (label !== '' ? ';' : '');
              label += (typeof optionsList !== 'undefined' ? optionsList.DisplayName : value);
            });
          } else {
            label = 'Select';
          }
        } else {
          if (filter.ValueFrom === 0) { // 0 is treated as falsy value, so adding check
            label = 0;
          } else {
            label = filter.ValueFrom || '';
          }
        }
        return label;
      },
      getFilterSummary: function (filter) {
        var operator = '';
        var valueFrom = filterService.getDropDownLabel(filter);
        var valueTo = filter.ValueTo || '';
        var filterValue = valueFrom;

        switch (filter.OpType.toLowerCase()) {
          case 'equals':
            operator = '=';
            break;
          case 'isnot':
          case 'notequal':
            operator = '<>';
            break;
          case 'before': //case before, datebefore and lessthan sharing the same operator
          case 'datebefore':
          case 'lessthan':
            operator = '<';
            break;
          case 'onorbefore':
          case 'dateonorbefore':
          case 'notgreaterthan':
            operator = '<=';
            break;
          case 'after':
          case 'dateafter':
          case 'greaterthan':
            operator = '>';
            break;
          case 'onorafter':
          case 'dateonorafter':
          case 'notlessthan':
            operator = '>=';
            break;
          case 'datebetween':
          case 'between':
            operator = 'between';
            filterValue = valueFrom + ' and ' + valueTo;
            break;
          case 'datenotbetween':
          case 'notbetween':
            operator = 'not between';
            filterValue = valueFrom + ' and ' + valueTo;
            break;
          case 'startswith':
            operator = 'starts with';
            filterValue = '"' + valueFrom + '"';
            break;
          case 'doesnotstartwith':
            operator = 'does not starts with';
            filterValue = '"' + valueFrom + '"';
            break;
          case 'contains':
            operator = 'contains';
            filterValue = '"' + valueFrom + '"';
            break;
          case 'doesnotcontain':
            operator = 'does not contains';
            filterValue = '"' + valueFrom + '"';
            break;
          case 'isanyof':
            var selectedItemCount = valueFrom.toString().split(';'); //splitted to check the multi select
            operator = (selectedItemCount.length > 1) ? 'is any of' : '=';
            filterValue = (selectedItemCount.length > 1) ? '(' + valueFrom + ')' : valueFrom;
            break;
          case 'isnotanyof':
            selectedItemCount = valueFrom.toString().split(';'); //splitted to check the multi select
            operator = (selectedItemCount.length > 1) ? 'is not any of' : '<>';
            filterValue = (selectedItemCount.length > 1) ? '(' + valueFrom + ')' : valueFrom;
            break;
          default: //default case is require in different operators like Is, Equals, Today, Previous year etc.
            operator = '=';
            filterValue = (valueFrom ? valueFrom : filter.OpType); //for YN datatypes, there is no valueFrom, use OpType
            break;
        }
        return (filter.Header || filter.FieldDescription) + ' ' + operator + ' ' + filterValue;
      }
    };

    return filterService;
  }
}());

