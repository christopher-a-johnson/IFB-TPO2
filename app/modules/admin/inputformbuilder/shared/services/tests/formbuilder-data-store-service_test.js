/**
 * Created by urandhe on 4/27/2015.
 */
(function () {
  'use strict';
  describe('Form builder data store service for custom input form list', function () {
    var formBuilderDataStore, httpBackend, formBuilderGridData, formBuilderConst, Restangular;
    //Need to change when actual service in place.
    var mockGridDataURL = '/api/fb/FormsUsingScriptFile.json';//
    var mockGridColumnDataURL = '/api/fb/listGridColumns.json';
    //In current environment Url is pointing to service need to point to json file

    var mockGridResponse = [
      {
        'Id': '3',
        'Title': 'Logo 3',
        'Description': 'This is test',
        'FileSize': '30KB',
        'Public': 0,
        'LastModifiedBy': 'Joe Smith',
        'LastModifiedDateTime': '1410547401',
        'Used': false
      },
      {
        'Id': '4',
        'Title': 'Logo 4',
        'Description': 'This is test',
        'FileSize': '20KB',
        'Public': 0,
        'LastModifiedBy': 'Joe Smith',
        'LastModifiedDateTime': '1410547401',
        'Used': true
      }
    ];
    var mockColumnDataResponse = [
      {
        'columns': [
          {'field': 'FormName', 'width': 200, 'title': 'Form Name'},
          {'field': 'Description', 'title': 'Description', 'freeze': false}],
        'schema': {
          'id': 'Id',
          'fields': [
            {
              'field': 'Id',
              'params': {'type': 'string'}
            },
            {
              'field': 'FormName',
              'params': {'type': 'boolean'}
            }]
        }
      }
    ];
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (FormBuilderDataStore, $httpBackend, FormBuilderGridData, FormBuilderConst, _Restangular_) {
      formBuilderDataStore = FormBuilderDataStore;
      httpBackend = $httpBackend;
      formBuilderGridData = FormBuilderGridData;
      formBuilderConst = FormBuilderConst;
      Restangular = _Restangular_;
      spyOn(FormBuilderGridData, 'resolveDataPromise').and.callThrough();
      spyOn(FormBuilderGridData, 'resolveColumnPromise').and.callThrough();
    }));
    describe('Tests for ColumnPromise', function () {
      beforeEach(function () {
        spyOn(Restangular, 'all').and.callThrough();
      });
      it('Should set length of columns stored in data  store to greater than  zero',
        inject(function () {
          /*spyOn(Restangular, 'all').and.callThrough();*/
          httpBackend.whenGET(mockGridColumnDataURL).respond(mockColumnDataResponse);
          formBuilderGridData.resolveColumnPromise('listGridColumns');
          httpBackend.flush();
          expect(formBuilderDataStore.FormBuilderGridData.data.columns.length).toEqual(2);
        }));
      it('Should set length of columns returning  in resolve column promise to greater than  zero',
        inject(function () {
          var list = [];
          httpBackend.whenGET(mockGridColumnDataURL).respond(mockColumnDataResponse);
          formBuilderGridData.resolveColumnPromise('listGridColumns')
            .then(function (response) {
              angular.copy(Restangular.stripRestangular(response), list);
            });
          httpBackend.flush();
          expect(list.length).toEqual(2);
        }));
      it('Should match type of scheema from FormBuilderDataStore after input transformation',
        inject(function () {
          httpBackend.whenGET(mockGridColumnDataURL).respond(mockColumnDataResponse);
          formBuilderGridData.resolveColumnPromise('listGridColumns');
          httpBackend.flush();
          expect(formBuilderDataStore.FormBuilderGridData.data.schema.Id.type).toEqual('string');
        }));
    });
    describe('Tests for dataPromise', function () {
      it('Should set length of items from UsedFormsList to greater than zero',
        inject(function () {
          spyOn(Restangular, 'all').and.callThrough();
          var list = [];
          httpBackend.whenGET(mockGridDataURL).respond(mockGridResponse);
          formBuilderGridData.resolveDataPromise('FormsUsingScriptFile')
            .then(function (response) {
              angular.copy(Restangular.stripRestangular(response), list);
            });
          httpBackend.flush();
          expect(list.length).toEqual(2);
        }));
    });
  });
}());
