/**
 * Created by Kdeshmukh on 8/21/2015.
 */
(function () {
  'use strict';
  describe('Pipeline Helper functions', function () {
    var env, startDate, endDate;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV) {
      env = ENV;
      startDate = '01/01/1999';
      endDate = '12/12/2199';
    }));
    it('Check if date is valid', inject(function (PipelineHelperService) {
      var enteredDate = '12/12/2009';
      var response = PipelineHelperService.getValidDate(enteredDate);
      expect(response).toBe('ValidDate');
    }));
    it('Check if date is between range', inject(function (PipelineHelperService) {
      var enteredDate = '01/12/2015'; //MM/dd/yyyy format
      var response = PipelineHelperService.getValidDate(enteredDate);
      expect(response).toBe('ValidDate');
    }));
    it('Check if date is out of range', inject(function (PipelineHelperService) {
      var enteredDate = '01/12/1800'; //MM/dd/yyyy format
      var response = PipelineHelperService.getValidDate(enteredDate);
      expect(response).toBe('InvalidRange');
    }));
  });
})();
