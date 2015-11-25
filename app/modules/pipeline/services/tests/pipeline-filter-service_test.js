/**
 * Created by UKolapkar on 7/17/2015.
 */
(function () {
  'use strict';
  describe('Pipeline filter service', function () {
    beforeEach(module('elli.encompass.web'));

    it('Should return filter summary string', inject(function (PipelineFilterService) {
      var filter = {
        'CriterionName': 'Pipeline.Messages',
        'DataSource': '',
        'FieldDescription': 'Messages',
        'FieldID': '',
        'FieldType': 'INTEGER',
        'OpDesc': 'Equals',
        'OpType': 'Equals',
        'ValueDescription': '',
        'ValueFrom': 10,
        'JointToken': 'and',
        'LeftParentheses': 0,
        'RightParentheses': 0,
        'ForceDataConversion': false,
        'IsVolatile': false,
        'allowClone': false,
        'OperatorOptions': [{'name': 'Is', 'value': 'Equals'}, {'name': 'Is not', 'value': 'NotEqual'}, {
          'name': 'Greater than',
          'value': 'GreaterThan'
        }, {'name': 'Not greater than', 'value': 'NotGreaterThan'}, {'name': 'Less than', 'value': 'LessThan'},
          {'name': 'Not less than', 'value': 'NotLessThan'}, {'name': 'Between', 'value': 'Between'}, {
            'name': 'Not between', 'value': 'NotBetween'
          }],
        'FieldOptions': []
      };
      var filterSummary = PipelineFilterService.getFilterSummary(filter);
      expect(filterSummary).toBe('Messages = 10');
    }));

    it('Should get field type for filter', inject(function (PipelineFilterService) {
      var result = PipelineFilterService.getFieldTypeForFilters('integer', true);
      expect(result).toBe('IsNumeric');
      result = PipelineFilterService.getFieldTypeForFilters('date', true);
      expect(result).toBe('IsMonthDay');
      result = PipelineFilterService.getFieldTypeForFilters('date', false);
      expect(result).toBe('IsDate');
      result = PipelineFilterService.getFieldTypeForFilters('dropdown', false);
      expect(result).toBe('IsOptionList');
      result = PipelineFilterService.getFieldTypeForFilters('text', false);
      expect(result).toBe('IsString');
    }));

    it('Should get filter DropDown Label', inject(function (PipelineFilterService) {
      var filter = {Datatype: 'DROPDOWN', ValueFrom: ['Test'], FilterOptions: [{DisplayName: 'Test', Value: 'Test'}]};
      var result = PipelineFilterService.getDropDownLabel(filter);
      expect(result).toBe('Test');
      filter = {Datatype: 'DROPDOWN', FilterOptions: [{DisplayName: 'Test', Value: 'Test'}]};
      result = PipelineFilterService.getDropDownLabel(filter);
      expect(result).toBe('Select');
    }));

    it('Should get filter summery for given filter', inject(function (PipelineFilterService) {
      var filterObj = {
        Datatype: 'DROPDOWN',
        ValueFrom: ['Test'],
        OpType: 'notequal',
        Header: 'Field',
        FieldDescription: 'Test',
        FilterOptions: [{DisplayName: 'Test', Value: 'Test'}]
      };
      var result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field <> Test');
      //for less than
      filterObj.OpType = 'lessthan';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field < Test');
      // on or brfore
      filterObj.OpType = 'onorbefore';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field <= Test');
      // greater than
      filterObj.OpType = 'greaterthan';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field > Test');
      //between
      filterObj.OpType = 'between';
      filterObj.ValueTo = 'test';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field between Test and test');
      // notbetween
      filterObj.OpType = 'notbetween';
      filterObj.ValueTo = 'test';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field not between Test and test');
      // notbetween
      filterObj.OpType = 'startswith';
      filterObj.ValueTo = 'test';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field starts with "Test"');
      //doesnotstartwith
      filterObj.OpType = 'doesnotstartwith';
      filterObj.ValueTo = 'test';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field does not starts with "Test"');
      //contains
      filterObj.OpType = 'contains';
      filterObj.ValueTo = 'test';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field contains "Test"');
      // not contains
      filterObj.OpType = 'doesnotcontain';
      filterObj.ValueTo = 'test';
      result = PipelineFilterService.getFilterSummary(filterObj);
      expect(result).toBe('Field does not contains "Test"');
    }));
  });
})();
