'use strict';

describe('Test Rename manage view controller', function () {
  beforeEach(module('elli.encompass.web'));

  var scope, ctrl;
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('RenameManageViewController', {$scope: scope, customMessage: 'LWriter'});
  }));

  it('Should check if the variables are defined', function () {
    expect(ctrl.renameValue).toBeDefined();
  });

  it('Should check if information popup is shown when rename value is empty',
    inject(function (modalWindowService, PipelineConst) {
      spyOn(modalWindowService.popupInformation, 'open');
      ctrl.renameValue = '';
      ctrl.okClick();
      expect(modalWindowService.popupInformation.open).toHaveBeenCalledWith({
        message: PipelineConst.RenameRequiredMessage,
        title: PipelineConst.PopupTitle
      });
    }));

  it('Should check if information popup is shown when rename value is > 260 characters',
    inject(function (modalWindowService, PipelineConst) {
      spyOn(modalWindowService.popupInformation, 'open');
      ctrl.renameValue = 'showInformationPopupshowInformationPopupshowInformationPopupshowInformationPopup' +
        'showInformationPopupshowInformationPopupshowInformationPopupshowInformationPopupshowInformationPopup' +
        'showInformationPopupshowInformationPopupshowInformationPopupshowInformationPopupshowInformationPopup';
      ctrl.okClick();
      expect(modalWindowService.popupInformation.open).toHaveBeenCalledWith({
        message: PipelineConst.RenameMaxLengthMessage,
        title: PipelineConst.PopupTitle
      });
    }));

  it('Should check if information popup is shown when the rename value already exists',
    inject(function (modalWindowService, PipelineDataStore) {
      PipelineDataStore.PipelineViewListDataStore.items = [{ViewName: 'LOfficer'}, {ViewName: 'LProcessor'},
        {ViewName: 'LAdmin'}, {ViewName: 'LSuperAdmin'}, {ViewName: 'LUnderwriter'}, {ViewName: 'LManager'}];
      spyOn(modalWindowService.popupInformation, 'open');
      ctrl.renameValue = 'LUnderwriter';
      ctrl.okClick();
      expect(modalWindowService.popupInformation.open).toHaveBeenCalled();
    }));

  it('Should check if resolvePromise method of RenameViewData service is called',
    inject(function (PipelineDataStore, RenameViewData) {
      PipelineDataStore.PipelineViewListDataStore.items = [{ViewName: 'LOfficer'}, {ViewName: 'LProcessor'},
        {ViewName: 'LAdmin'}, {ViewName: 'LSuperAdmin'}, {ViewName: 'LUnderwriter'}, {ViewName: 'LManager'}];
      spyOn(RenameViewData, 'resolvePromise').and.callFake(function (payload) {
      });
      ctrl.renameValue = 'NewView';
      ctrl.okClick();
      expect(RenameViewData.resolvePromise).toHaveBeenCalled();
    }));

  it('Should check if close popup method is called',
    inject(function () {
      spyOn(ctrl, 'closePopUp');
      ctrl.renameValue = 'LWriter';
      ctrl.okClick();
      expect(ctrl.closePopUp).toHaveBeenCalled();
    }));

  it('Should check if close rename window method is called',
    inject(function (modalWindowService) {
      spyOn(modalWindowService, 'closeRenameWindow');
      ctrl.closePopUp();
      expect(modalWindowService.closeRenameWindow).toHaveBeenCalled();
    }));

  it('Should close popup on Esc keypress',
    inject(function (modalWindowService) {
      spyOn(modalWindowService, 'closeRenameWindow');
      ctrl.eventHandler({keyCode: 27});
      expect(modalWindowService.closeRenameWindow).toHaveBeenCalled();
    }));

  it('Should perform action on Enter keypress',
    inject(function (modalWindowService, $timeout) {
      spyOn(modalWindowService, 'closeRenameWindow');
      ctrl.eventHandler({keyCode: 13});
      $timeout.flush();
      expect(modalWindowService.closeRenameWindow).toHaveBeenCalled();
    }));

});
