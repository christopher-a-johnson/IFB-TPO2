(function () {
  'use strict';
  xdescribe('Move Loan folder list service', function () {
    var env, Restangular;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, _Restangular_) {
      env = ENV;
      Restangular = _Restangular_;
    }));

    it('Should test moveloanfolderlist resolvePromise',
      inject(function (PipelineDataStore, ENV, $httpBackend, MoveLoanFolderList) {
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectGET(ENV.restURL + '/pipeline/loan/getfoldersformoveloans').respond(201, {
          GetFoldersListForPipelineMoveLoansResponse1: {foldersListField: ['folder_1', 'folder_2']},
          FromFolders: ['Folder_3', 'Folder_4']
        });
        MoveLoanFolderList.resolvePromise();
        $httpBackend.flush();
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getfoldersformoveloans');
        expect(PipelineDataStore.MoveLoanFolderList.items).toEqual(['folder_1', 'folder_2']);
        expect(PipelineDataStore.MoveLoanFolderList.selectedItem).toBe(1);
        expect(PipelineDataStore.MoveLoanFromFolderList.items).toEqual(['Folder_3', 'Folder_4']);
      }));

    it('Should test moveloanfolderlist resolvePromise with no response',
      inject(function (PipelineDataStore, ENV, $httpBackend, MoveLoanFolderList) {
        spyOn(Restangular, 'all').and.callThrough();
        $httpBackend.expectGET(ENV.restURL + '/pipeline/loan/getfoldersformoveloans').respond(201, null);
        MoveLoanFolderList.resolvePromise();
        $httpBackend.flush();
        expect(Restangular.all).toHaveBeenCalledWith('pipeline/loan/getfoldersformoveloans');
        expect(PipelineDataStore.MoveLoanFolderList.items).toEqual([]);
        expect(PipelineDataStore.MoveLoanFolderList.selectedItem).toBe(null);
        expect(PipelineDataStore.MoveLoanFromFolderList.items).toEqual([]);
      }));
  });
})();
