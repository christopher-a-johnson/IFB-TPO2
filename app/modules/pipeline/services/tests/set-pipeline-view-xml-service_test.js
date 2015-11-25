(function () {
  'use strict';
  describe('Set Pipeline View Xml service Test', function () {
    var pipelineXml, pipelineXml1, pipelineXml2, setPipelineViewXmlCallBack1;
    beforeEach(module('elli.encompass.web'));

    beforeEach(inject(function () {
      pipelineXml = '<objdata><element name="root"><element name="name">MyPipelineView</element>' +
        '<element name="loanFolder">Completed Loans</element>' +
        '<element name="filter">' +
        '<element name="0">' +
        '<element name="fieldType">IsString</element>' +
        '<element name="fieldID">Loan.BorrowerName</element>' +
        '<element name="criterionName">Loan.BorrowerName</element>' +
        '<element name="fieldDescription">Loan.BorrowerName</element>' +
        '<element name="opType">Contains</element>' +
        '<element name="valueFrom">test</element>' +
        '<element name="valueTo"></element>' +
        '<element name="jointToken">And</element>' +
        '<element name="leftParentheses">0</element>' +
        '<element name="rightParentheses">0</element>' +
        '<element name="valueDescription" null="0">test</element>' +
        '<element name="volatile">False</element>' +
        '<element name="forceDataConversion">False</element>' +
        '<element name="dataSource">Unknown</element>' +
        '</element>' +
        '</element>' +
        '<element name="layout">' +
        '<element name="columns">' +
        '<element name="0">' +
        '<element name="id">Alerts.AlertCount</element>' +
        '<element name="title">Alerts</element>' +
        '<element name="desc">Alerts</element>' +
        '<element name="tag">Alerts.AlertCount</element>' +
        '<element name="width">100</element>' +
        '<element name="displayOrder">0</element>' +
        '<element name="sortOrder">None</element>' +
        '<element name="sortPriority">-1</element>' +
        '<element name="alignment">Right</element>' +
        '<element name="required">False</element>' +
        '</element>' +
        '</element>' +
        '</element>' +
        '<element name="ownership">All</element><element name="orgType">Internal</element>' +
        '<element name="externalOrgId" null="1"></element></element>' +
        '</objdata>';

      pipelineXml1 = '<objdata><element name="root"><element name="name">MyPipelineView</element>' +
        '<element name="loanFolder">&lt;All Folders&gt;</element>' +
        '<element name="filter">' +
        '<element name="0">' +
        '<element name="fieldType">IsString</element>' +
        '<element name="fieldID">Loan.BorrowerName</element>' +
        '<element name="criterionName">Loan.BorrowerName</element>' +
        '<element name="fieldDescription">Loan.BorrowerName</element>' +
        '<element name="opType">Contains</element>' +
        '<element name="valueFrom">test</element>' +
        '<element name="valueTo"></element>' +
        '<element name="jointToken">And</element>' +
        '<element name="leftParentheses">0</element>' +
        '<element name="rightParentheses">0</element>' +
        '<element name="valueDescription" null="1"></element>' +
        '<element name="volatile">False</element>' +
        '<element name="forceDataConversion">False</element>' +
        '<element name="dataSource">Unknown</element>' +
        '</element>' +
        '</element>' +
        '<element name="layout">' +
        '<element name="columns">' +
        '<element name="0">' +
        '<element name="id">Alerts.AlertCount</element>' +
        '<element name="title">Alerts</element>' +
        '<element name="desc">Alerts</element>' +
        '<element name="tag">Alerts.AlertCount</element>' +
        '<element name="width">100</element>' +
        '<element name="displayOrder">0</element>' +
        '<element name="sortOrder">Descending</element>' +
        '<element name="sortPriority">0</element>' +
        '<element name="alignment">Left</element>' +
        '<element name="required">False</element>' +
        '</element>' +
        '</element>' +
        '</element>' +
        '<element name="ownership">null</element><element name="orgType">null</element>' +
        '<element name="externalOrgId" null="0">null</element></element>' +
        '</objdata>';

      pipelineXml2 = '<objdata><element name="root"><element name="name">MyPipelineView</element>' +
        '<element name="loanFolder">&lt;All Folders&gt;</element>' +
        '<element name="filter">' +
        '<element name="0">' +
        '<element name="fieldType">IsString</element>' +
        '<element name="fieldID">Loan.BorrowerName</element>' +
        '<element name="criterionName">Loan.BorrowerName</element>' +
        '<element name="fieldDescription">Loan.BorrowerName</element>' +
        '<element name="opType">Contains</element>' +
        '<element name="valueFrom">test</element>' +
        '<element name="valueTo"></element>' +
        '<element name="jointToken">And</element>' +
        '<element name="leftParentheses">0</element>' +
        '<element name="rightParentheses">0</element>' +
        '<element name="valueDescription" null="1"></element>' +
        '<element name="volatile">False</element>' +
        '<element name="forceDataConversion">False</element>' +
        '<element name="dataSource">Unknown</element>' +
        '</element>' +
        '</element>' +
        '<element name="layout">' +
        '<element name="columns">' +
        '<element name="0">' +
        '<element name="id">Alerts.AlertCount</element>' +
        '<element name="title">Alerts</element>' +
        '<element name="desc">Alerts</element>' +
        '<element name="tag">Alerts.AlertCount</element>' +
        '<element name="width">100</element>' +
        '<element name="displayOrder">0</element>' +
        '<element name="sortOrder">Ascending</element>' +
        '<element name="sortPriority">0</element>' +
        '<element name="alignment">Left</element>' +
        '<element name="required">False</element>' +
        '</element>' +
        '</element>' +
        '</element>' +
        '<element name="ownership">null</element><element name="orgType">TPO</element>' +
        '<element name="externalOrgId" null="0">null</element></element>' +
        '</objdata>';
      pipelineXml = JSON.stringify({
        Xml: pipelineXml
      });
      pipelineXml1 = JSON.stringify({
        Xml: pipelineXml1
      });
      pipelineXml2 = JSON.stringify({
        Xml: pipelineXml2
      });

      setPipelineViewXmlCallBack1 = function (resp) {
      };
    }));

    it('Should test if encompass stePipelineViewXml method is called with correct xml',
      inject(function (PipelineDataStore, SetPipelineViewXmlService, encompass, applicationLoggingService, $timeout) {
        PipelineDataStore.PipelineViewListDataStore = {selectedItem: {ViewName: 'MyPipelineView'}};
        PipelineDataStore.LoanFolderDropdownData = {selectedItem: 'Completed Loans'};
        PipelineDataStore.LoanViewDropdownData = {selectedItem: {id: 'All'}};
        PipelineDataStore.CompanyViewDropdownData = {selectedItem: {id: 'Internal'}};
        PipelineDataStore.externalOrg = {id: ''};
        PipelineDataStore.PipelineGridData = {
          filters: [{
            FieldType: 'IsString', FieldID: 'Loan.BorrowerName',
            CriterionName: 'Loan.BorrowerName', FieldDescription: 'Loan.BorrowerName', OpType: 'Contains',
            ValueFrom: 'test',
            ValueTo: '', JointToken: 'And', LeftParentheses: '0', RightParentheses: '0',
            ValueDescription: 'test', IsVolatile: 'False', ForceDataConversion: 'False', DataSource: 'Unknown'
          }],
          data: {
            columns: [{
              uniqueID: 'Alerts.AlertCount', title: 'Alerts',
              width: '100', OrderIndex: '0', field: 'Alerts', alignment: 'Right', required: 'False'
            }]
          },
          sort: [{field: 'Alerts1', dir: 'asc'}]
        };

        spyOn(encompass, 'setPipelineViewXml').and.callFake(function (jsonParams, callback) {
        });
        SetPipelineViewXmlService.setPipelineViewXml();
        $timeout.flush();
        expect(encompass.setPipelineViewXml).toHaveBeenCalledWith(pipelineXml, jasmine.any(Function));
      }));

    it('Should test if encompass stePipelineViewXml method is called with incorrect xml',
      inject(function (PipelineDataStore, SetPipelineViewXmlService, encompass, applicationLoggingService, $timeout, PipelineConst) {
        PipelineDataStore.PipelineViewListDataStore = {selectedItem: {ViewName: 'MyPipelineView'}};
        PipelineDataStore.LoanFolderDropdownData = {selectedItem: PipelineConst.AllFolder};
        PipelineDataStore.LoanViewDropdownData = {selectedItem: null};
        PipelineDataStore.CompanyViewDropdownData = {selectedItem: null};
        PipelineDataStore.externalOrg = {id: '-1'};
        PipelineDataStore.PipelineGridData = {
          filters: [{
            FieldType: 'IsString', FieldID: 'Loan.BorrowerName',
            CriterionName: 'Loan.BorrowerName', FieldDescription: 'Loan.BorrowerName', OpType: 'Contains',
            ValueFrom: 'test',
            ValueTo: '', JointToken: 'And', LeftParentheses: '0', RightParentheses: '0',
            ValueDescription: null, IsVolatile: 'False', ForceDataConversion: 'False', DataSource: 'Unknown'
          }],
          data: {
            columns: [{
              uniqueID: 'Alerts.AlertCount', title: 'Alerts',
              width: '100', OrderIndex: '0', field: 'Alerts', alignment: null, required: null
            }]
          },
          sort: [{field: 'Alerts', dir: 'desc'}]
        };

        spyOn(encompass, 'setPipelineViewXml').and.callFake(function (jsonParams, callback) {
        });
        SetPipelineViewXmlService.setPipelineViewXml();
        $timeout.flush();
        expect(encompass.setPipelineViewXml).toHaveBeenCalledWith(pipelineXml1, jasmine.any(Function));
      }));

    it('Should test if encompass stePipelineViewXml method is called with incorrect xml',
      inject(function (PipelineDataStore, SetPipelineViewXmlService, encompass, applicationLoggingService, $timeout, PipelineConst) {
        PipelineDataStore.PipelineViewListDataStore = {selectedItem: {ViewName: 'MyPipelineView'}};
        PipelineDataStore.LoanFolderDropdownData = {selectedItem: PipelineConst.AllFolder};
        PipelineDataStore.LoanViewDropdownData = {selectedItem: null};
        PipelineDataStore.CompanyViewDropdownData = {selectedItem: {id: 'TPO'}};
        PipelineDataStore.externalOrg = {id: '-1'};
        PipelineDataStore.PipelineGridData = {
          filters: [{
            FieldType: 'IsString', FieldID: 'Loan.BorrowerName',
            CriterionName: 'Loan.BorrowerName', FieldDescription: 'Loan.BorrowerName', OpType: 'Contains',
            ValueFrom: 'test',
            ValueTo: '', JointToken: 'And', LeftParentheses: '0', RightParentheses: '0',
            ValueDescription: null, IsVolatile: 'False', ForceDataConversion: 'False', DataSource: 'Unknown'
          }],
          data: {
            columns: [{
              uniqueID: 'Alerts.AlertCount', title: 'Alerts',
              width: '100', OrderIndex: '0', field: 'Alerts', alignment: null, required: null
            }]
          },
          sort: [{field: 'Alerts', dir: 'asc'}]
        };

        spyOn(encompass, 'setPipelineViewXml').and.callFake(function (jsonParams, callback) {
        });
        SetPipelineViewXmlService.setPipelineViewXml();
        $timeout.flush();
        expect(encompass.setPipelineViewXml).toHaveBeenCalledWith(pipelineXml2, jasmine.any(Function));
      }));
  });
})();
