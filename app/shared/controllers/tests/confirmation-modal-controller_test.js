(function () {
  'use strict';
  describe('Test Confirmation Modal Controller : ConfirmationModalController', function () {
    var ctrl, scope;

    beforeEach(module('elli.encompass.web'));
    beforeEach(module('kendo.directives'));

    beforeEach(inject(function ($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('ConfirmationModalController', {
        $scope: scope,
        customMessage: 'Custom message',
        popupIcon: 'Info'
      });
    }));

    it('Should Disable Save View and Reset View icons and should call SetMenuStateService to reflect the same in Main menu' +
      'on modalYesClick',
      inject(function (SetMenuStateService, PipelineDataStore) {
        spyOn(SetMenuStateService, 'setThickClientMenuState');
        PipelineDataStore.infoIconDisabled = true;
        ctrl.modalYesClick();
        expect(PipelineDataStore.saveButtonDisabled).toBe(true);
        expect(PipelineDataStore.resetButtonDisabled).toBe(true);
        expect(SetMenuStateService.setThickClientMenuState).toHaveBeenCalledWith([
          {MenuItemTag: 'PI_SaveView', Enabled: false, Visible: true},
          {MenuItemTag: 'PI_ResetView', Enabled: false, Visible: true}
        ]);
      }));

    it('Apply to all checkbox should change the popup text',
      inject(function (PipelineDataStore) {
        ctrl.applyCheck = true;
        PipelineDataStore.ConfirmModalApplyAllMessage = 'Test';
        ctrl.applyAllCheckChange();
        expect(ctrl.message).toBe(PipelineDataStore.ConfirmModalApplyAllMessage);
      }));

  });
}());
