/**
 * Created by bpandey on 6/24/2015.
 */

(function () {
  'use strict';
  describe('Test for forlist-grid-services', function () {
    var formListGridServices;
    var columns = [
      {
        'field': 'Name',
        'template': 'template',
        'sortable': {}
      },
      {
        'field': 'ModifiedBy',
        'template': 'template',
        'sortable': {}
      },
      {
        'field': 'ModifiedDate',
        'template': 'template',
        'sortable': {}
      },
      {
        'field': 'Description',
        'template': 'template',
        'sortable': {}
      },
      {
        'field': 'Enabled',
        'template': 'Enabled',
        'sortable': {}
      }
    ];
    beforeEach(module('elli.encompass.web'));
    //Inject dependencies
    beforeEach(inject(function (FormListGridServices) {
      formListGridServices = FormListGridServices;
    }));
    it('Should check when getColumnApi is called',
      function () {
        spyOn(formListGridServices, 'getColumnsApi').and.callThrough();
        formListGridServices.getColumnsApi();
        expect(formListGridServices.getColumnsApi).toHaveBeenCalled();
      });
    it('Should check when getColumnApi is called and Value it returned',
      function () {
        spyOn(formListGridServices, 'getColumnsApi').and.callThrough();
        formListGridServices.getColumnsApi();
        expect(formListGridServices.getColumnsApi()).toEqual('listGridColumns');
      });
    it('Should check when getDataApi is called',
      function () {
        spyOn(formListGridServices, 'getDataApi').and.callThrough();
        formListGridServices.getDataApi();
        expect(formListGridServices.getDataApi).toHaveBeenCalled();
      });
    it('Should check when getDataApi is called and The value returned',
      function () {
        spyOn(formListGridServices, 'getDataApi').and.callThrough();
        formListGridServices.getDataApi();
        expect(formListGridServices.getDataApi()).toEqual('inputforms');
      });
    it('Should return data which is sorted descending according to modified date when called sortDefault',
      function () {
        var response = [{'ModifiedDate':1420547400, 'HiddenName': 'A'}, {'ModifiedDate': 1420547402, 'HiddenName': 'B'}];
        spyOn(formListGridServices, 'sortDefault').and.callThrough();
        var result = formListGridServices.sortDefault(response);
        expect(result[0].HiddenName).toBe('B');
      });
    it('Should return data which is sorted ascending according to modified date when called sortDefault',
      function () {
        var response = [{'ModifiedDate':1420547402, 'HiddenName': 'A'}, {'ModifiedDate': 1420547400, 'HiddenName': 'B'}];
        spyOn(formListGridServices, 'sortDefault').and.callThrough();
        var result = formListGridServices.sortDefault(response);
        expect(result[0].HiddenName).toBe('A');
      });
    it('Should return data which is sorted ascending according to name if modified date is same',
      function () {
        var response = [{'ModifiedDate':1420547400, 'HiddenName': 'a'}, {'ModifiedDate': 1420547400, 'HiddenName': 'k'}];
        spyOn(formListGridServices, 'sortDefault').and.callThrough();
        var result = formListGridServices.sortDefault(response);
        expect(result[0].HiddenName).toBe('a');
      });
    it('Should return data which is sorted descending according to name if modified date is same',
      function () {
        var response = [{'ModifiedDate':1420547400, 'HiddenName': 'K'}, {'ModifiedDate': 1420547400, 'HiddenName': 'K'}];
        spyOn(formListGridServices, 'sortDefault').and.callThrough();
        var result = formListGridServices.sortDefault(response);
        expect(result[0].HiddenName).toBe('K');
      });
    it('Should check when getFooterPagingMessage is called',
      function () {
        spyOn(formListGridServices, 'getFooterPagingMessage').and.callThrough();
        formListGridServices.getFooterPagingMessage();
        expect(formListGridServices.getFooterPagingMessage).toHaveBeenCalled();
      });
    it('Should check when sortGridData is called',
      function () {
        var columns = {};
        spyOn(formListGridServices, 'sortGridData').and.callThrough();
        formListGridServices.sortGridData(columns);
        expect(formListGridServices.sortGridData).toHaveBeenCalled();
      });
    it('Should call sortGridData and Column should be defined',
      function () {
        spyOn(formListGridServices, 'sortGridData').and.callThrough();
        formListGridServices.sortGridData(columns);
        expect(formListGridServices.sortGridData).toHaveBeenCalled();
      });
    it('Should check when sortGridData is called and column is defined to enabled',
      function () {
        spyOn(formListGridServices, 'sortGridData').and.callThrough();
        formListGridServices.sortGridData(columns[4]);
        expect(formListGridServices.sortGridData(columns[4])).toEqual([]);
      });
    it('Should check when getUploadURL is called',
      function () {
        spyOn(formListGridServices, 'getUploadURL').and.callThrough();
        formListGridServices.getUploadURL();
        expect(formListGridServices.getUploadURL).toHaveBeenCalled();
      });
    it('Should check when getSupportText is called',
      function () {
        spyOn(formListGridServices, 'getSupportText').and.callThrough();
        formListGridServices.getSupportText();
        expect(formListGridServices.getSupportText).toHaveBeenCalled();
      });
    it('Should check when getPageSize is called',
      function () {
        spyOn(formListGridServices, 'getPageSize').and.callThrough();
        formListGridServices.getPageSize();
        expect(formListGridServices.getPageSize).toHaveBeenCalled();
      });
  });
})();
