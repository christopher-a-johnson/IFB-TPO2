(function () {
  'use strict';
  angular.module('elli.encompass.web.pipeline').factory('SetPipelineViewXmlService', SetPipelineViewXmlService);
  /* @ngInject */
  function SetPipelineViewXmlService(encompass, applicationLoggingService, PipelineDataStore, _, $timeout, PipelineConst) {
    function setPipelineViewXmlCallBack(resp) {
      var param = JSON.parse(resp);
      if (param.ErrorCode !== 0) {
        applicationLoggingService.error('Pipeline view xml - ' + param.ErrorCode + '; Message: ' + param.ErrorMessage);
      }
    }

    function buildPipelineViewXml() {
      var pipelineXml = '<objdata><element name="root">' +
        '<element name="name">' + _.escape(PipelineDataStore.PipelineViewListDataStore.selectedItem.ViewName) +
        '</element>' +
        '<element name="loanFolder">' + (PipelineDataStore.LoanFolderDropdownData.selectedItem !== PipelineConst.AllFolder ?
          _.escape(_.trim(PipelineDataStore.LoanFolderDropdownData.selectedItem, '<>')) :
          _.escape(PipelineDataStore.LoanFolderDropdownData.selectedItem)) + '</element>' +
        '<element name="filter">' + buildFilterXml() + '</element><element name="layout">' +
        '<element name="columns">' + buildColumnsXml() + '</element></element>' +
        '<element name="ownership">' + (PipelineDataStore.LoanViewDropdownData.selectedItem ?
          _.escape(PipelineDataStore.LoanViewDropdownData.selectedItem.id) : null) + '</element>' +
        '<element name="orgType">' + (PipelineDataStore.CompanyViewDropdownData.selectedItem ?
          PipelineDataStore.CompanyViewDropdownData.selectedItem.id === 'TPO' ? 'TPO' :
            _.escape(PipelineDataStore.CompanyViewDropdownData.selectedItem.id) : null) + '</element>' +
        '<element name="externalOrgId" null="' + (PipelineDataStore.externalOrg.id ? '0' : '1') + '">' +
        (PipelineDataStore.externalOrg.id === '-1' ? null : _.escape(PipelineDataStore.externalOrg.id)) + '</element>' +
        '</element>' +
        '</objdata>';

      return pipelineXml;
    }

    function buildFilterXml() {
      var filterXml = '';
      _.each(PipelineDataStore.PipelineGridData.filters, function (filter, index) {
        filterXml += '<element name="' + index + '">' +
          '<element name="fieldType">' + _.escape(filter.FieldType) + '</element>' +
          '<element name="fieldID">' + filter.FieldID + '</element>' +
          '<element name="criterionName">' + _.escape(filter.CriterionName) + '</element>' +
          '<element name="fieldDescription">' + _.escape(filter.FieldDescription) + '</element>' +
          '<element name="opType">' + _.escape(filter.OpType) + '</element>' +
          '<element name="valueFrom">' + _.escape(filter.ValueFrom) + '</element>' +
          '<element name="valueTo">' + _.escape(filter.ValueTo) + '</element>' +
          '<element name="jointToken">' + _.escape(filter.JointToken) + '</element>' +
          '<element name="leftParentheses">' + filter.LeftParentheses + '</element>' +
          '<element name="rightParentheses">' + filter.RightParentheses + '</element>' +
          '<element name="valueDescription" null="' + (filter.ValueDescription ? '0' : '1') + '">' +
          _.escape(filter.ValueDescription) + '</element>' +
          '<element name="volatile">False</element>' +
          '<element name="forceDataConversion">False</element>' +
          '<element name="dataSource">Unknown</element>' +
          '</element>';
      });
      return filterXml;
    }

    function buildColumnsXml() {
      var columnsXml = '';
      _.each(PipelineDataStore.PipelineGridData.data.columns, function (column, index) {
        columnsXml += '<element name="' + index + '"><element name="id">' + _.escape(column.uniqueID) + '</element>' +
          '<element name="title">' + _.escape(column.title) + '</element>' +
          '<element name="desc">' + _.escape(column.title) + '</element>' +
          '<element name="tag">' + _.escape(column.uniqueID) + '</element>' +
          '<element name="width">' + parseInt(column.width, 10) + '</element>' +
          '<element name="displayOrder">' + column.OrderIndex + '</element>' +
          '<element name="sortOrder">' + ((PipelineDataStore.PipelineGridData.sort.length > 0 &&
          PipelineDataStore.PipelineGridData.sort[0].field === column.field) ?
            (PipelineDataStore.PipelineGridData.sort[0].dir === 'asc' ? 'Ascending' : 'Descending') : 'None') +
          '</element>' +
          '<element name="sortPriority">' + (PipelineDataStore.PipelineGridData.sort.length > 0 &&
          PipelineDataStore.PipelineGridData.sort[0].field === column.field ? 0 : -1) + '</element>' +
          '<element name="alignment">' + (column.alignment ? column.alignment : 'Left') + '</element>' +
          '<element name="required">' + (column.required ? column.required : 'False') + '</element></element>';
      });
      return columnsXml;
    }

    return {
      setPipelineViewXml: function () {
        $timeout(function () {
          encompass.setPipelineViewXml(JSON.stringify({
            Xml: buildPipelineViewXml()
          }), setPipelineViewXmlCallBack);
        }, 0);
      }
    };
  }
}());
