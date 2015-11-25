/**
 * Created by urandhe on 5/12/2015.
 */
(function () {
  'use strict';
  describe('Standard Form List Data Service returned promise', function () {
    var env, httpBackend, standardFormListData, Restangular;
    var mockResponse = [
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
    //Need to change when actual service in place.
    var gridDataURL = '/api/fb/standardForms.json';
    //In current environment Url is pointing to service need to point to json file

    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, StandardFormListData, _Restangular_) {
      env = ENV;
      httpBackend = $httpBackend;
      standardFormListData = StandardFormListData;
      Restangular = _Restangular_;
      spyOn(StandardFormListData, 'resolvePromise').and.callThrough();
      spyOn(Restangular, 'all').and.callThrough();
    }));

    it('Should check promise not equal to null', inject(function ($httpBackend) {
      $httpBackend.whenGET(gridDataURL).respond(mockResponse);
      expect(standardFormListData.resolvePromise()).not.toEqual(null);
    }));
  });
}());
