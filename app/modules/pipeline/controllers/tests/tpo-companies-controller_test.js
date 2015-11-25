'use strict';

describe('Test TPO Companies Controller', function () {
  beforeEach(module('elli.encompass.web'));

  var scope, ctrl, mockPipelineDataStore;
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    mockPipelineDataStore = {
      TPOCompaniesData: {
        items: [{externalIdField: 1, nameField: 'All'}, {externalIdField: 2, nameField: 'Test'}],
        selected: []
      },
      externalOrg: {id: null, name: null}
    };
    ctrl = $controller('TPOCompaniesController', {$scope: scope, PipelineDataStore: mockPipelineDataStore});
  }));

  it('Should enable OK button on selection of row', function () {
    ctrl.gridSelectionChange({externalIdField: 1, nameField: 'Test'});
    expect(ctrl.tpoCompaniesData.selected.length).toBe(1);
  });

  it('Should disable OK button on clear selection of grid', function () {
    ctrl.clearSelection();
    expect(ctrl.tpoCompaniesData.selected.length).toBe(0);
  });

  it('Should set object on click of OK button', inject(function (modalWindowService, PipelineDataStore) {
    spyOn(modalWindowService, 'closeTPOCompaniesPopup');
    ctrl.gridSelectionChange({externalIdField: 1, nameField: 'Test'});
    ctrl.tpoCompaniesOk();
    expect(ctrl.tpoCompaniesData.selected[0].nameField).toBe('Test');
    expect(modalWindowService.closeTPOCompaniesPopup).toHaveBeenCalled();

  }));

});
