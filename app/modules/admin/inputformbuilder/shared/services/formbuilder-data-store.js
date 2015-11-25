(function () {
  'use strict';

  angular.module('elli.encompass.web.admin.formbuilder').factory('FormBuilderDataStore', FormBuilderDataStore);

  function FormBuilderDataStore() {
    return {
      resetView: false,
      FormBuilderGridData: {selected: [], data: {columns: [], items: [], schema: {}}},
      UsedFormsList: {items: []}
    };
  }
}());
