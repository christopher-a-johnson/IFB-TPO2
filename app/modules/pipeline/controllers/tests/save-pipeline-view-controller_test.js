'use strict';

describe('Test Save Pipeline view Controller', function () {
  beforeEach(module('elli.encompass.web'));

  var scope, ctrl, Restangular;
  beforeEach(inject(function ($controller, $rootScope, PipelineDataStore,
                              PipelineGetView, $httpBackend, ENV, _Restangular_) {
    scope = $rootScope.$new();
    Restangular = _Restangular_;
    spyOn(Restangular, 'all').and.callThrough();
    $httpBackend.expectPOST(ENV.restURL + '/pipeline/view/getview').respond(201, {
      'PipelineView': {
        'ExternalOrgId': null,
        'FilterSummary': null,
        'LoanFolder': null,
        'Name': 'Default View',
        'OrgType': 'Internal',
        'Ownership': 'All',
        'Columns': [
          {
            'Alignment': 'Right',
            'OrderIndex': '0',
            'PipelineField': {
              'Header': 'Alerts',
              'Name': 'Alerts.AlertCount',
              'SortOrder': null,
              'FieldId': 'Field.ActiveFolder'
            },
            'Required': null,
            'SortOrder': 'Ascending',
            'SortPriority': '-1',
            'Width': '-1'
          }]
      },
      'PipelineViewSummary': [
        {
          'ViewName': 'Default View',
          'PersonaName': 'Accounting',
          'IsDefault': true,
          'Type': 'System'
        }]
    });
    PipelineGetView.resolvePromise();
    expect(Restangular.all).toHaveBeenCalledWith('pipeline/view/getview');
    $httpBackend.flush();
    ctrl = $controller('SavePipelineViewController', {$scope: scope});

  }));

  it('Should check if the variables are initialized with default values', function () {
    expect(ctrl.saveAsViewName).toBe('');
    expect(ctrl.setAsDefaultView).toBe(true);
  });

  it('Should disabled update view if system view selected ', function () {
    expect(ctrl.systemViewType).toBe(true);
    expect(ctrl.saveViewSelectedOption).toBe(1);
  });

  it('Should check if information popup is shown when saveAsViewName is empty',
    inject(function (modalWindowService, PipelineConst) {
      spyOn(modalWindowService.popupInformation, 'open');
      ctrl.saveAsViewName = '';
      ctrl.saveViewSelectedOption = 1;
      ctrl.okClick();
      expect(modalWindowService.popupInformation.open).toHaveBeenCalledWith({
        message: PipelineConst.SaveViewNameViewErrorMessage,
        title: PipelineConst.NameViewErrorTitle
      });
    }));

  it('Should check if information popup is shown when saveAsViewName contains "\\" character',
    inject(function (modalWindowService, PipelineConst) {
      spyOn(modalWindowService.popupInformation, 'open');
      ctrl.saveAsViewName = 'Test\\t';
      ctrl.saveViewSelectedOption = 1;
      ctrl.okClick();
      expect(modalWindowService.popupInformation.open).toHaveBeenCalledWith({
        message: PipelineConst.SaveViewNameViewErrorMessage,
        title: PipelineConst.NameViewErrorTitle
      });
    }));

  it('Should check if save view pipeline popup is closed',
    inject(function (modalWindowService) {
      spyOn(modalWindowService, 'closeSavePipelineViewPopup');
      ctrl.cancelClick();
      expect(modalWindowService.closeSavePipelineViewPopup).toHaveBeenCalled();
    }));
  it('Should check if creating a new custom view with same view name',
    inject(function (modalWindowService, PipelineDataStore, PipelineConst) {
      spyOn(modalWindowService.popupInformation, 'open');
      ctrl.saveViewSelectedOption = 1;
      ctrl.saveAsViewName = 'SameViewName';
      PipelineDataStore.PipelineViewListDataStore.items = [{Name: 'SameViewName'}];
      ctrl.okClick();
      expect(modalWindowService.popupInformation.open).toHaveBeenCalledWith({
        message: 'A view with the name \'SameViewName\' ' +
        'already exists. You must provide a unique name for this view.', title: PipelineConst.ExistingViewErrorTitle
      });
    }));

  it('Should check if creating a new custom view with non existing view name',
    inject(function (modalWindowService, PipelineDataStore, PipelineConst, CreateCustomView) {
      spyOn(modalWindowService, 'closeSavePipelineViewPopup');
      spyOn(CreateCustomView, 'resolvePromise').and.callFake(function () {
      });
      ctrl.saveViewSelectedOption = 1;
      ctrl.saveAsViewName = 'DifferentViewNameTest';
      PipelineDataStore.PipelineViewListDataStore = {items: [{Name: 'SameViewName'}], selectedItem: {PersonaName: ''}};
      PipelineDataStore.PipelineGridData.data.columns = [{
        alignment: '', OrderIndex: '', title: '', name: '', width: '',
        sortOrder: '', sortPriority: '', required: ''
      }];
      PipelineDataStore.CompanyViewDropdownData.selectedItem = '';
      PipelineDataStore.LoanViewDropdownData.selectedItem = '';
      ctrl.okClick();
      expect(CreateCustomView.resolvePromise).toHaveBeenCalled();
      expect(modalWindowService.closeSavePipelineViewPopup).toHaveBeenCalled();
    }));

  it('Should check if saving existing view',
    inject(function (modalWindowService, PipelineDataStore, PipelineConst, SaveViews) {
      spyOn(modalWindowService, 'closeSavePipelineViewPopup');
      spyOn(SaveViews, 'resolvePromise').and.callFake(function () {
      });
      ctrl.saveViewSelectedOption = 0;
      PipelineDataStore.PipelineGridData.data.columns = [{
        alignment: '', OrderIndex: '', title: '', name: '', width: '',
        sortOrder: '', sortPriority: '', required: ''
      }];
      PipelineDataStore.CompanyViewDropdownData.selectedItem = '';
      PipelineDataStore.LoanViewDropdownData.selectedItem = '';
      PipelineDataStore.PipelineViewListDataStore = {selectedItem: {ViewName: 'ViewName', PersonaName: ''}};
      ctrl.okClick();
      expect(SaveViews.resolvePromise).toHaveBeenCalled();
      expect(modalWindowService.closeSavePipelineViewPopup).toHaveBeenCalled();
    }));
});
