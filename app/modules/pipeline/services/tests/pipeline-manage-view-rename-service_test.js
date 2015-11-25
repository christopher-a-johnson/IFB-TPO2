/**
 * Created by MVora on 9/15/2015.
 */

(function () {

  'use strict';
  xdescribe('RenameViewData service test', function () {
    var env, httpBackend, restangular, pipelineDataStore, pipelineViewListData, renameViewData;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_, PipelineDataStore, PipelineViewListData, RenameViewData) {
      env = ENV;
      httpBackend = $httpBackend;
      restangular = _Restangular_;
      pipelineDataStore = PipelineDataStore;
      pipelineViewListData = PipelineViewListData;
      renameViewData = RenameViewData;
    }));

    it('should execute RenameViewData service and set the new view name', function () {
      spyOn(restangular, 'all').and.callThrough();
      spyOn(pipelineViewListData, 'resolvePromise').and.callThrough();
      var payload =
      {
        'Name': 'Abc',
        'Modified': 'Abcd'
      };
      pipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid = [{'ViewName': ''}];
      httpBackend.expectPOST(env.restURL + '/pipeline/view/rename', payload).respond(201, {});
      renameViewData.resolvePromise(payload);
      httpBackend.flush();
      expect(pipelineDataStore.PipelineViewListDataStore.newViewName).toBe('Abcd');
      expect(pipelineDataStore.PipelineViewListDataStore.SeletedItemFromGrid[0].ViewName).toBe('Abcd');
    });
  });

})
();
