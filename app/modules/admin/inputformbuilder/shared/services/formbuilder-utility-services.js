(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').factory('FormBuilderUtilityServices', FormBuilderUtilityServices);

  var kendoInstance;
  var formListConstant;
  var curPage;
  //FormListConst: It is dependency use as it.
  function FormBuilderUtilityServices(kendo, FormListConst, FormBuilderService) {
    kendoInstance = kendo;
    formListConstant = FormListConst;
    curPage = FormBuilderService.getCurPage();
    return {
      compare: compare,
      nameTemplate: nameTemplate,
      descriptionTemplate: descriptionTemplate,
      lastModifiedByTemplate: lastModifiedByTemplate,
      lastModifiedDateTemplate: lastModifiedDateTemplate,
      fileSizeTemplate: fileSizeTemplate,
      enabledTemplate: enabledTemplate
    };
  }

  function compare(field1, field2, fieldType) {
    // fieldType 0 : string comparisons , 1: date comparisons , 2 : fileSize comparisons
    if (field1 === field2) {
      return function (a, b) {
        if (curPage === formListConstant.FORM_LIST_PAGE) {
          field2 = formListConstant.HIDDEN_NAME;
          field1 = formListConstant.HIDDEN_NAME;
        }
        return a[field1] === b[field1] ? 0 : a[field1] > b[field1] ? 1 : -1;
      };
    } else {
      if (fieldType === 0) {
        return function (a, b) {
          if (curPage === formListConstant.FORM_LIST_PAGE) {
            var formListDescription = formListConstant.HIDDEN_DESCRIPTION;
            var formListModifiedBy = formListConstant.HIDDEN_MODIFIED_BY;
            field1 = (field1 === 'Description' || field1 === 'HiddenDescription') ? formListDescription : formListModifiedBy;
            field2 = formListConstant.HIDDEN_NAME;
          }
          return a[field1] === b[field1] ? (a[field2] > b[field2] ? 1 : -1)
            : a[field1] > b[field1] ? 1 : -1;
        };
      } else if (fieldType === 1) {
        return function (a, b) {
          return new Date(a[field1] * 1000).valueOf() === new Date(b[field1] * 1000).valueOf() ?
            (a[field2] > b[field2] ? 1 : -1)
            : new Date(a[field1] * 1000) > new Date(b[field1] * 1000) ? 1 : -1;
        };
      } else if (fieldType === 2) {
        return function (a, b) {
          var aFileSize = parseFloat(a[field1]);
          var bFileSize = parseFloat(b[field1]);
          return aFileSize === bFileSize ? ((a[field2] > b[field2]) ? 1 : -1)
            : ((aFileSize > bFileSize) ? 1 : -1);
        };
      }
    }
  }

  function nameTemplate(columnName) {
    return function (data) {
      /*jshint
       expr: true
       */
      return (data[columnName]) ? '<a ng-href="{{fbGridCtrl.returnURL(\'' + data.Id + '\')}}" ' +
      'ng-click="fbGridCtrl.openFile(\'' + data.Id + '\',$event)" target="_blank"><span ng-bind="dataItem.'
      + columnName + '">' + data[columnName] + '</span></a>' : '<span></span>';
    };
  }

  function descriptionTemplate(columnName) {
    return function (data) {
      if (data[columnName] !== null && data[columnName] !== undefined) {
        if (data[columnName].length > 500) {
          var content = data[columnName];
          var limitedContent = content.substring(0, 500);
          return '<span ng-bind="dataItem.' + columnName + '">' + limitedContent + '</span>';
        } else {
          return '<span ng-bind="dataItem.' + columnName + '">' + data[columnName] + '</span>';
        }
      } else {
        return '<span></span>';
      }
    };
  }

  function lastModifiedByTemplate(columnName) {
    return function (data) {
      /*jshint
       expr: true
       */
      return (data[columnName]) ? '<span ng-bind="dataItem.' + columnName + '">'
      + data[columnName] + '</span>' : '';
    };
  }

  function lastModifiedDateTemplate(columnName) {
    return function (data) {
      if (data[columnName] !== null && data[columnName] !== undefined) {
        return kendoInstance.toString(new Date(data[columnName] * 1000), 'G');
      } else {
        return '';
      }
    };
  }

  function fileSizeTemplate(columnName) {
    return function (data) {
      if (data[columnName] !== null && data[columnName] !== undefined) {
        return '<span>' + data[columnName] + '</span>';
      } else {
        return '<span></span>';
      }
    };
  }

  function enabledTemplate(columnName) {
    return function (data) {
      if (data[columnName] !== null && data[columnName] !== undefined) {
        if (data[columnName] === 1 || data[columnName] === true) {
          return '<div class="div-checkmark-image"></div>';
        } else {
          return '<span></span>';
        }
      } else {
        return '<span></span>';
      }
    };
  }
}());
