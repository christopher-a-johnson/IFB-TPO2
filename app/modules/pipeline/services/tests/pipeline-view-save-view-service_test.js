(function () {
  'use strict';
  describe('Pipeline View Save View Service', function () {
    var env, httpBackend, Restangular, pipelineDataStore;
    beforeEach(module('elli.encompass.web'));
    beforeEach(inject(function (ENV, $httpBackend, _Restangular_, PipelineDataStore) {
      env = ENV;
      pipelineDataStore = PipelineDataStore;
      httpBackend = $httpBackend;
      Restangular = _Restangular_;
    }));

    it('Should save view and disable save and reset buttons',
      inject(function (PipelineDataStore, SaveViews, ENV, $httpBackend, PipelineViewListData) {
        spyOn(Restangular, 'all').and.callThrough();
        spyOn(PipelineViewListData, 'resolvePromise');
        var payload = {
          'SetAsDefaultPersonaName': '',
          'SetAsDefaultViewName': '',
          'PipelineViews': {
            'PipelineView': [
              {
                'Columns': [
                  {
                    'Alignment': 'Right',
                    'OrderIndex': 0,
                    'PipelineField': {
                      'FieldId': 'Pipeline.Alerts',
                      'Header': 'Alerts',
                      'Name': 'Alerts.AlertCount'
                    },
                    'Width': 100,
                    'SortOrder': 'None',
                    'SortPriority': -1,
                    'Required': 'False'
                  }
                ],
                'Filter': null,
                'Name': 'Test',
                'SetAsDefault': false,
                'OrgType': 'Internal',
                'ExternalOrgId': '',
                'Ownership': 'User',
                'LoanFolder': '<All Folders>',
                'PersonaName': ''
              }
            ]
          }
        };
        $httpBackend.expectPOST(ENV.restURL + '/pipeline/view/saveviews').respond(201, {
          'SavePipelineViewsResponse': {
            'SavePipelineViewsResponse1': {
              'numOfUpdatedCustomViewsField': 1,
              'numOfUpdatedCustomViewsFieldSpecified': true,
              'numOfUpdatedPersonaViewsField': 0,
              'numOfUpdatedPersonaViewsFieldSpecified': true,
              'PropertyChanged': null
            }
          },
          'SetViewAsDefaultMessage': null
        });
        SaveViews.resolvePromise(payload);
        $httpBackend.flush();

        expect(Restangular.all).toHaveBeenCalledWith('pipeline/view/saveviews');
        expect(PipelineViewListData.resolvePromise).toHaveBeenCalled();
        expect(PipelineDataStore.saveButtonDisabled).toBe(true);
        expect(PipelineDataStore.resetButtonDisabled).toBe(true);
      }));
  });
})();
